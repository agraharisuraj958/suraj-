#!/usr/bin/env bash
# Finishes the setup: Python AI service + docs/PROGRESS.md. Run from the project ROOT.
set -euo pipefail
command -v git >/dev/null || { echo "Install git first"; exit 1; }
[ -d backend-node ] || { echo "Run this from the project root (the folder containing backend-node)"; exit 1; }
PY=""
for c in python3 python py; do
  if command -v "$c" >/dev/null 2>&1; then
    echo "found '$c': $("$c" --version 2>&1 || true)"
    if "$c" -c "import sys; sys.exit(0 if sys.version_info >= (3,11) else 1)" >/dev/null 2>&1; then PY="$c"; break; fi
  fi
done
[ -n "$PY" ] || { echo "No working Python 3.11+ found. Install from python.org and tick 'Add python.exe to PATH', then reopen the terminal."; exit 1; }
echo "Using Python: $PY"
mkdir -p docs
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
- AI (Windows): `cd ai-service && ./run_dev.ps1`
- AI (Mac/Linux): `cd ai-service && AI_SERVICE_HOST=127.0.0.1 AI_SERVICE_PORT=8000 uvicorn app.main:app --reload --host $AI_SERVICE_HOST --port $AI_SERVICE_PORT`
- Dev OS: Windows (run setup.sh in Git Bash)
EOF

git add -A >/dev/null 2>&1 || true
git commit -qm "chore: scaffold monorepo and install dependencies" >/dev/null 2>&1 || true

echo ""
echo "Done. Next:"
echo "  docker compose up -d   (run inside the project root; cd medimind first if you did not use IN_PLACE=1)"
echo "  Open docs/PROGRESS.md for the handoff log."