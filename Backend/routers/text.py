from fastapi import APIRouter, HTTPException
from Backend.models.schemas import GeneratedTextRequest, GeneratedTextResponse
from Backend.services.text_generator import TextGenerator

router = APIRouter(
    prefix="/text",
    tags=["Text Generator"],
)


@router.post(
    "/generate",
    response_model=GeneratedTextResponse,
    summary="Generate a reading passage",
    description="Generates a reading passage based on the provided topic, language, level, and style. Supports iterative refinement for English passages to meet specific difficulty criteria (Gunning Fog score)."

)
async def generate_text(req: GeneratedTextRequest):
    """
    Handles the request to generate a text passage.

    It initializes the `TextGenerator` based on the requested provider
    and calls the generation service.
    """
    try:
        tg = TextGenerator(provider=req.provider)
        return await tg.generate_text(
            topic=req.topic,
            language=req.language,
            level=req.level,
            style=req.style,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
