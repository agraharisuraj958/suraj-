#!/usr/bin/env bash
# MediMind monorepo bootstrap
# Usage: bash setup.sh        (run from the folder where you want "medimind/" created)
set -euo pipefail

command -v node    >/dev/null || { echo "Install Node.js 20+ first (https://nodejs.org)"; exit 1; }
PY=""
for c in python3 python py; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c "import sys; sys.exit(0 if sys.version_info >= (3,11) else 1)" >/dev/null 2>&1; then
    PY="$c"; break
  fi
done
[ -n "$PY" ] || { echo "Install Python 3.11+ first (tick 'Add to PATH' in the installer)"; exit 1; }
command -v git     >/dev/null || { echo "Install git first"; exit 1; }

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
[ "$NODE_MAJOR" -ge 20 ] || { echo "Node 20+ required (found $(node -v))"; exit 1; }

# IN_PLACE=1 -> install into the current folder (e.g. an already-cloned repo)
if [ "${IN_PLACE:-0}" != "1" ]; then
  mkdir -p medimind && cd medimind
fi
git init -q 2>/dev/null || true

# ---------------------------------------------------------------- folders
mkdir -p docs infra
mkdir -p backend-node/src/{config,middlewares,utils,routes,modules/{auth,users,patients,doctors,appointments,prescriptions,billing,documents,ai}}
mkdir -p backend-node/tests
mkdir -p ai-service/app/{api/routes,core,schemas,services/{ingestion,retrieval,llm,agents}}
mkdir -p ai-service/{tests,data/uploads}
find backend-node/src backend-node/tests ai-service/app ai-service/tests ai-service/data -type d -empty -exec touch {}/.gitkeep \;

# ---------------------------------------------------------------- root files
cat > .gitignore <<'EOF'
node_modules/
dist/
.env
.env.*
!.env.example
__pycache__/
*.pyc
.venv/
.pytest_cache/
.ruff_cache/
ai-service/data/uploads/*
!ai-service/data/uploads/.gitkeep
.DS_Store
coverage/
EOF

cat > .env.example <<'EOF'
# ---------- Shared ----------
NODE_ENV=development

# ---------- Node backend ----------
PORT=4000
DATABASE_URL=postgresql://medimind:medimind@localhost:5432/medimind?schema=public
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
CORS_ORIGIN=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=internal-shared-secret

# ---------- FastAPI AI service ----------
LLM_PROVIDER=anthropic          # anthropic | openai
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
LLM_MODEL=claude-sonnet-4-5
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=medimind_docs
INTERNAL_API_KEY=internal-shared-secret
EOF

cat > docker-compose.yml <<'EOF'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: medimind
      POSTGRES_PASSWORD: medimind
      POSTGRES_DB: medimind
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U medimind"]
      interval: 5s
      retries: 10

  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333", "6334:6334"]
    volumes: [qdrantdata:/qdrant/storage]

volumes:
  pgdata:
  qdrantdata:
EOF

cat > .editorconfig <<'EOF'
root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
insert_final_newline = true
trim_trailing_whitespace = true
[*.py]
indent_size = 4
EOF

cp .env.example backend-node/.env
cp .env.example ai-service/.env

# ---------------------------------------------------------------- Node backend
echo ">>> Setting up Node backend (TypeScript + Express + Prisma)"
cd backend-node
npm init -y >/dev/null
npm pkg set name="medimind-backend" version="0.1.0" private=true main="dist/server.js" >/dev/null
npm pkg set scripts.dev="tsx watch src/server.ts" \
            scripts.build="tsc -p tsconfig.json" \
            scripts.start="node dist/server.js" \
            scripts.lint="eslint src --ext .ts" \
            scripts.format="prettier --write src" \
            scripts.test="vitest run" \
            scripts.prisma:generate="prisma generate" \
            scripts.prisma:migrate="prisma migrate dev" \
            scripts.prisma:studio="prisma studio" >/dev/null

npm install express cors helmet morgan dotenv zod jsonwebtoken bcryptjs cookie-parser \
  express-rate-limit multer axios pino pino-http swagger-ui-express yaml @prisma/client@6

npm install -D typescript tsx prisma@6 vitest supertest eslint prettier \
  @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken \
  @types/bcryptjs @types/cookie-parser @types/multer @types/supertest @types/swagger-ui-express \
  typescript-eslint pino-pretty

cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src"]
}
EOF

cat > .prettierrc <<'EOF'
{ "singleQuote": true, "semi": true, "trailingComma": "all", "printWidth": 100 }
EOF

npx prisma init --datasource-provider postgresql >/dev/null 2>&1 || true
# prisma init overwrites .env; restore our full env
cp ../.env.example .env
cd ..

# ---------------------------------------------------------------- FastAPI AI service
echo ">>> Setting up FastAPI AI service"
cd ai-service
"$PY" -m venv .venv
if [ -x .venv/Scripts/python.exe ]; then VENV_PY=".venv/Scripts/python.exe"; else VENV_PY=".venv/bin/python"; fi
"$VENV_PY" -m pip install --upgrade pip -q

cat > requirements.txt <<'EOF'
# API
fastapi
uvicorn[standard]
pydantic
pydantic-settings
python-multipart
httpx
sse-starlette
# LLM providers
anthropic
openai
# RAG
qdrant-client
fastembed
rank-bm25
pypdf
pdfplumber
tiktoken
# Utilities
tenacity
structlog
python-dotenv
EOF

cat > requirements-dev.txt <<'EOF'
-r requirements.txt
pytest
pytest-asyncio
ruff
EOF

"$VENV_PY" -m pip install -r requirements-dev.txt
"$VENV_PY" -m pip freeze > requirements.lock

cat > pyproject.toml <<'EOF'
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
EOF

touch app/__init__.py app/api/__init__.py app/api/routes/__init__.py app/core/__init__.py \
      app/schemas/__init__.py app/services/__init__.py app/services/ingestion/__init__.py \
      app/services/retrieval/__init__.py app/services/llm/__init__.py app/services/agents/__init__.py
cd ..

# ---------------------------------------------------------------- docs + progress file
cat > docs/PROGRESS.md <<'EOF'
# MediMind - Progress & Handoff Log

> Any AI assistant or developer picking this up: read this file first, then continue from "Next steps".

## Project
AI-first Hospital Management System, built as a take-home assignment for an AI role.
Evaluation focuses on AI depth (RAG, agents) plus engineering quality.
Backend is ours; a friend builds the frontend (React + TS + Tailwind) against our API contract.

## Stack decisions
- Node.js 20 + TypeScript + Express: auth (JWT), RBAC, CRUD, uploads, gateway to the AI service
- PostgreSQL 16 + Prisma 6: relational data
- FastAPI (Python 3.11+): RAG, triage, report analyzer, LLM agent with tools
- Qdrant: vector DB. fastembed (BAAI/bge-small-en-v1.5) for local embeddings (no torch needed)
- LLM: Anthropic or OpenAI, switchable via LLM_PROVIDER
- Docker Compose runs Postgres and Qdrant

## AI features planned
1. RAG assistant over clinical guideline PDFs, with citations
2. Patient history summarizer
3. Symptom triage (department + urgency)
4. Scheduling agent with tool calling
5. Lab report analyzer
All AI output carries a "not a diagnosis" disclaimer.

## Folder layout
- backend-node/   Express API (src/modules/<feature>/ with routes, controller, service, schema)
- ai-service/     FastAPI (app/api, app/core, app/services/{ingestion,retrieval,llm,agents}, app/schemas)
- docs/           this file, API contract, architecture
- docker-compose.yml, .env.example

## Status
- [x] Feature/idea selection: Hospital Management System
- [x] Monorepo scaffold and folder structure (setup.sh)
- [x] Node dependencies installed
- [x] Python dependencies installed (venv at ai-service/.venv)
- [x] docker-compose for Postgres and Qdrant
- [ ] Verify setup (docker compose up -d, prisma connects)
- [ ] Prisma schema and first migration
- [ ] Node: server bootstrap, config, error handling, logging, auth and RBAC
- [ ] FastAPI: app bootstrap, config, health route, internal API-key auth
- [ ] API contract (docs/API_CONTRACT.md, OpenAPI) shared with the frontend dev
- [ ] RAG ingestion, retrieval (hybrid and rerank), chat with streaming
- [ ] Triage, summarizer, report analyzer, scheduling agent
- [ ] Tests, Dockerfiles, README with architecture diagram, eval script

## Next steps
1. Run `docker compose up -d` and confirm Postgres and Qdrant are healthy
2. Design the Prisma schema (User, Patient, Doctor, Department, Appointment, Prescription, Invoice, Document, ChatSession, AuditLog)
3. Write the Node/FastAPI contract for AI endpoints

## Commands
- Infra: `docker compose up -d`
- Node: `cd backend-node && npm run dev`
- AI (Windows): `cd ai-service && .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000`
- AI (Mac/Linux): `cd ai-service && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000`
- Dev OS: Windows (run setup.sh in Git Bash)
EOF

git add -A >/dev/null 2>&1 || true
git commit -qm "chore: scaffold monorepo and install dependencies" >/dev/null 2>&1 || true

echo ""
echo "Done. Next:"
echo "  docker compose up -d   (run inside the project root; cd medimind first if you did not use IN_PLACE=1)"
echo "  Open docs/PROGRESS.md for the handoff log."