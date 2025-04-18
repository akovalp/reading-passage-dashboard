from fastapi import APIRouter, HTTPException
from Backend.models.schemas import QuestionSchema, GenerateQuestionsRequest, GenerateQuestionsResponse
from Backend.services.question_generator import QuestionGenerator 

router = APIRouter(
    prefix="/questions",
    tags=["Question Generator"],
)

@router.post(
    "/generate",
    response_model=GenerateQuestionsResponse,
    summary="Generate multiple-choice questions",
    description="Generates multiple-choice questions based on the provided text."
)
async def generate_questions(req: GenerateQuestionsRequest):
    """
    Handles the request to generate multiple-choice questions.
    """
    try:
        qg = QuestionGenerator(provider=req.provider)
        return await qg.generate_questions(
            generated_text=req.generated_text,
            num_questions=req.num_questions,
            language=req.language,
            choices_num=req.choices_num,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
