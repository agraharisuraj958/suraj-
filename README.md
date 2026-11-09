# MediMind

## AI configuration

Copy the environment template and set your provider-specific keys.

- Example env file: `.env.example`
- Gemini model: `GEMINI_MODEL=gemini-2.5-flash`
- If using Gemini, keep `LLM_PROVIDER=gemini` and ensure `GEMINI_API_KEY` is set.
- Set `AI_SERVICE_HOST` and `AI_SERVICE_PORT` in the AI service env; the backend reads the same values to build `AI_SERVICE_URL`.

Example:

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
LLM_MODEL=gemini-2.5-flash
AI_SERVICE_HOST=127.0.0.1
AI_SERVICE_PORT=8000
```

## Run the AI service

From the ai-service folder:

```powershell
./run_dev.ps1
```

The script checks whether the configured port is free, falls back to the next free port if needed, starts uvicorn with reload, and prints the final local URL.

## Troubleshooting: WinError 10013

If you see `WinError 10013` when starting uvicorn on Windows, another process is already listening on the target port.

```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
netsh interface ipv4 show excludedportrange protocol=tcp
```

If port 8000 is blocked or reserved by Windows, either:

- stop the process that owns the port with `taskkill`, or
- use a different port via `AI_SERVICE_PORT` in the env file, or
- run the helper script again and let it pick the next free port automatically.

Example:

```env
AI_SERVICE_HOST=127.0.0.1
AI_SERVICE_PORT=8001
```

