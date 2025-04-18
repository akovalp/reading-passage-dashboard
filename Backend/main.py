# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Backend.routers import text, questions
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Reading Passage & Questions API",
    version="0.1.0",
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # React app typically runs on port 3000
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],

    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
app.include_router(text.router)
app.include_router(questions.router)


@app.get("/")
async def root():
    return {"message": "Reading Passage & Questions API"}
