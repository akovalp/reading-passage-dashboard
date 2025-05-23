import { useState } from "react";

export const useQuestionGeneration = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);

  const generateQuestions = async (
    generatedText,
    language,
    provider,
    num_questions = 5,
    choices_num = 4,
    model = null
  ) => {
    if (!generatedText) return;

    setIsLoading(true);
    setQuestions([]);
    setError(null);
    setShowQuestions(false);

    try {
      const questionsData = {
        generated_text: generatedText,
        num_questions: parseInt(num_questions, 10),
        language,
        choices_num: parseInt(choices_num, 10),
        provider,
        model: model, // Include the selected model
      };

      const response = await fetch("http://127.0.0.1:8000/questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionsData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate questions: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setQuestions(data.questions);
      setShowQuestions(true);
      return data.questions;
    } catch (err) {
      setError(err.message);
      console.error("Error details:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    isLoading,
    error,
    showQuestions,
    generateQuestions,
    setShowQuestions,
  };
};
