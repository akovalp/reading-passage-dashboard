# Reading Passage & Question Generator Dashboard

This project provides a web-based dashboard for generating reading passages and corresponding multiple-choice comprehension questions based on user-specified criteria. It leverages Large Language Models (LLMs) via different providers (Ollama and Groq) for content generation.

## Overview

The primary goal of this application is to assist educators, content creators, or language learners in quickly creating tailored reading materials and assessment questions. Users can define the topic, language, difficulty level, and writing style for the passage, and the application generates relevant text and questions.

## Features

*   **Text Generation:**
    *   Generate reading passages on any given topic.
    *   Specify target language, difficulty level (Basic, Intermediate, Advanced), and writing style (e.g., Formal, Casual).
    *   Supports multiple LLM providers (configurable, defaults to Ollama and Groq).
    *   For English passages, uses the Gunning Fog index to iteratively refine the text to match the target difficulty level.
*   **Question Generation:**
    *   Generate multiple-choice comprehension questions based on the generated text.
    *   Specify the number of questions and the number of choices per question.
    *   Supports multiple LLM providers for question generation.
*   **Interactive Dashboard:**
    *   User-friendly interface built with React.
    *   Form to input generation parameters.
    *   Displays generated text and questions.
    *   Allows users to take a quiz based on the generated questions and view their score.
    *   Copy generated text to clipboard.
    *   Dark mode toggle.
*   **Backend API:**
    *   Built with FastAPI (Python).
    *   Provides endpoints for text and question generation.

## Tech Stack

*   **Frontend:** React, CSS
*   **Backend:** Python, FastAPI
*   **LLM Interaction:** Ollama, Groq API
*   **Text Analysis (English):** `textstat` library

## Prerequisites

*   **Node.js and npm:** For running the React frontend. ([Download Node.js](https://nodejs.org/))
*   **Python 3.9+ and pip:** For running the FastAPI backend. ([Download Python](https://www.python.org/))
*   **Ollama (Optional):** If you want to use local models via Ollama. ([Install Ollama](https://ollama.com/))
*   **Groq API Key (Optional):** If you want to use the Groq API. Get one from [GroqCloud](https://console.groq.com/keys).

## Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd reading-passage-dashboard
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    *   (Assuming you have a `requirements.txt` in the `Backend` directory - if not, create one based on imports like `fastapi`, `uvicorn`, `pydantic`, `python-dotenv`, `ollama`, `aiohttp`, `textstat`, `pydantic-settings`)
    ```bash
    cd Backend
    pip install -r requirements.txt # Or pip install fastapi uvicorn pydantic python-dotenv ollama aiohttp textstat pydantic-settings
    cd ..
    ```

4.  **Set up Environment Variables:**
    *   Create a `.env` file in the *root* directory of the project (alongside `package.json`).
    *   Add your API keys and any model configurations if needed. For Groq:
        ```env
        # .env
        GROQ_API_KEY=your_groq_api_key_here
        ```
    *   The backend (`Backend/core/settings.py`) and frontend (`src/services/api.js`) might have default models set. You can override backend defaults via the `.env` file if necessary (though currently, it primarily looks for `GROQ_API_KEY`).

5.  **Run the Application:**
    *   This command uses `concurrently` (defined in `package.json`) to start both the backend server and the frontend development server.
    ```bash
    npm run dev
    ```
    *   This will typically:
        *   Start the FastAPI backend on `http://127.0.0.1:8000`.
        *   Start the React frontend on `http://localhost:3000`.

6.  **Access the Dashboard:**
    *   Open your web browser and navigate to `http://localhost:3000`.

## How It Works

1.  The user fills out the form in the React frontend, specifying parameters like topic, language, level, style, and provider choices.
2.  When "Generate Text" is clicked, the frontend sends a POST request to the `/text/generate` endpoint of the FastAPI backend.
3.  The backend's `TextGenerator` service selects the appropriate LLM provider (Ollama or Groq) and model.
4.  It constructs a prompt based on the user's input. For English, it may iterate, using `textstat` to check the Gunning Fog score and adjusting the prompt until the desired level is achieved or maximum iterations are reached.
5.  The LLM generates the text, which is sent back to the frontend and displayed.
6.  When "Generate Questions" is clicked, the frontend sends the generated text and question parameters (number, choices, provider) to the `/questions/generate` endpoint.
7.  The backend's `QuestionGenerator` service uses the selected provider to generate multiple-choice questions in JSON format based on the provided text.
8.  The questions are sent back to the frontend and displayed as an interactive quiz.
9.  Users can take the quiz, submit answers, and see their score.

---

Feel free to contribute or report issues!