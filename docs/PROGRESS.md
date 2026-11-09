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
