import { useState } from "react";

export const useTextGeneration = () => {
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateText = async (formData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedText("");

    try {
      const response = await fetch("http://127.0.0.1:8000/text/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorDetail = errorData.detail || response.statusText;

        if (
          errorDetail.includes("API key") ||
          errorDetail.includes("GROQ_API_KEY")
        ) {
          throw new Error(
            `API key error: ${errorDetail}. Make sure to set up your .env file with the GROQ_API_KEY.`
          );
        } else {
          throw new Error(`Failed to generate text: ${errorDetail}`);
        }
      }

      const data = await response.json();
      setGeneratedText(data.generated_text);
      return data.generated_text;
    } catch (err) {
      setError(err.message);
      console.error("Error details:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatedText,
    isLoading,
    error,
    generateText,
    setGeneratedText,
  };
};
