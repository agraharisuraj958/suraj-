import json
import logging
from app.core.config import settings
from app.services.retrieval.engine import hybrid_search
import anthropic
from google import genai
from openai import AsyncOpenAI
from sse_starlette.sse import ServerSentEvent

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are MediMind, a helpful medical AI assistant. Answer the user's question based ONLY on the provided context documents.
If the context does not contain the answer, explicitly say "not found in the provided documents".
Always cite your sources using [1], [2], etc., corresponding to the context numbers provided.
Always append this exact medical disclaimer at the very end of your response: "Disclaimer: This is not a medical diagnosis. Please consult a healthcare professional."

Context:
{context}
"""

async def generate_rag_stream(query: str, patient_id: str = None):
    # 1. Retrieve grounded context
    results = hybrid_search(query, patient_id=patient_id, top_k=3)

    # 2. Format context for prompt & yield citations immediately via SSE
    context_text = ""
    citations = []
    for i, res in enumerate(results, 1):
        context_text += f"Document [{i}] (Page {res['page']}):\n{res['text']}\n\n"
        citations.append(res)

    prompt = SYSTEM_PROMPT.format(context=context_text)

    # Send custom SSE event for citations so the frontend can render reference chips
    yield ServerSentEvent(event="citations", data=json.dumps(citations))

    # 3. Stream from LLM based on provider
    try:
        if settings.LLM_PROVIDER.lower() == "anthropic":
            client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            async with client.messages.stream(
                max_tokens=1024,
                system=prompt,
                messages=[{"role": "user", "content": query}],
                model=settings.LLM_MODEL or "claude-3-5-sonnet-20241022"
            ) as stream:
                async for text in stream.text_stream:
                    yield ServerSentEvent(event="token", data=text)

        elif settings.LLM_PROVIDER.lower() == "gemini":
            if not settings.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY is not configured.")

            client = genai.Client(api_key=settings.GEMINI_API_KEY, http_options={'api_version': 'v1beta'})
            model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
            response = client.models.generate_content_stream(
                model=model_name,
                contents=prompt
            )

            for chunk in response:
                text = getattr(chunk, "text", None)
                if text:
                    yield ServerSentEvent(event="token", data=text)

        else:  # OpenAI
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            stream = await client.chat.completions.create(
                model=settings.LLM_MODEL or "gpt-4o-mini",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": query}
                ],
                stream=True
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield ServerSentEvent(event="token", data=chunk.choices[0].delta.content)

        yield ServerSentEvent(event="done", data="[DONE]")
    except Exception as exc:
        logger.exception("Gemini generation failed during RAG stream")
        yield ServerSentEvent(event="error", data="I couldn't generate a response right now. Please try again.")