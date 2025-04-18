# app/models/schemas.py

from pydantic import BaseModel, Field
from typing import List, Optional
from Backend.core.settings import settings
from enum import Enum


class LevelEnum(str, Enum):
    Basic = "Basic"
    Intermediate = "Intermediate"
    Advanced = "Advanced"


# --- Text generation ---


class GeneratedTextRequest(BaseModel):
    topic: str = Field(..., description="The main subject or theme for the reading passage.",
                       example="The history of the internet")
    language: str = Field(..., description="The language of the reading passage.",
                          example="English")
    level: LevelEnum = Field(..., description="The difficulty level of the reading passage.",
                             example=LevelEnum.Basic)
    style: str = Field(..., description="The style of the reading passage.",
                       example="Formal")
    provider: str = settings.OLLAMA_PROVIDER
    model: Optional[str] = None


class GeneratedTextResponse(BaseModel):
    generated_text: str = Field(...,
                                description="The generated text to create questions from.")
    score: Optional[float] = None
    level: str = Field(...,
                       description="The difficulty level of the reading passage.")
    language: str = Field(...,
                          description="The language of the reading passage.")
    style: str = Field(..., description="The style of the reading passage.")
    iterations: Optional[int] = Field(...,
                                      description="The number of iterations used to generate the text.")
    failed_texts: Optional[List[str]] = Field(...,
                                              description="The list of texts that failed to generate.")
    prompts_used: Optional[List[str]] = Field(...,
                                              description="The list of prompts used to generate the text.")

# --- Question generation ---


class QuestionSchema(BaseModel):
    question: str = Field(..., description="The question text.")
    choices: List[str] = Field(...,
                               description="The list of choices for the question.")
    answer: str = Field(..., description="The correct answer to the question.")


class GenerateQuestionsRequest(BaseModel):
    generated_text: str = Field(...,
                                description="The generated text to create questions from.", example="The internet is a very important part of our lives today. It lets us talk to people and find information easily. But the internet is not new. It has a history.\n\nThe story of the internet began a long time ago, in the 1960s. The United States government wanted computers to share information. They wanted a way for computers to still work even if some were broken.\n\nThis idea led to a project called ARPANET. ARPANET was the first version of the internet. In 1969, the first message was sent using ARPANET. It was a small step, but very important.\n\nMore and more computers joined ARPANET over the years. Scientists used it to share their work. Later, a new way to use the internet was created. This was called the World Wide Web. The World Wide Web made the internet easier to use for everyone.\n\nIn the 1990s, people could use the internet at home. It grew quickly after that. Today, many people around the world use the internet every day to learn, talk, and have fun.")
    num_questions: int = Field(...,
                               description="The number of questions to generate.",
                               example=5)
    language: str = Field(..., description="The language of the questions.",
                          example="English")
    choices_num: int = Field(...,
                             description="The number of choices for each question.",
                             example=5)
    provider: str = Field(...,
                          description="The provider to use for question generation.",
                          example="ollama")
    model: Optional[str] = Field(None,
                                 description="The specific model to use for question generation.",
                                 example="gemma:7b")


class GenerateQuestionsResponse(BaseModel):
    questions: List[QuestionSchema] = Field(...,
                                            description="The list of questions generated.")
