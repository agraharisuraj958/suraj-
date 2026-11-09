import logging

from google import genai

from app.core.config import settings

logger = logging.getLogger(__name__)


def check_gemini_model_availability() -> None:
    if settings.LLM_PROVIDER.lower() != "gemini":
        return

    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is not configured; skipping Gemini model availability check.")
        return

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY, http_options={"api_version": "v1beta"})
        model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        available = False
        for model in client.models.list():
            if getattr(model, "name", "") == f"models/{model_name}" or getattr(model, "name", "") == model_name:
                available = True
                break

        if not available:
            logger.warning(
                "Configured GEMINI_MODEL '%s' is not available for generateContent in the current Gemini account. "
                "The API may reject the model with a 404 or generateContent error.",
                model_name,
            )
        else:
            logger.info("Gemini model '%s' is available for generateContent.", model_name)
    except Exception as exc:  # pragma: no cover - startup health check only
        logger.warning("Could not validate Gemini model availability: %s", exc)
