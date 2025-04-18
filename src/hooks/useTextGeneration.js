import { useState } from "react";
import { apiClient } from "../services/api";

export const useTextGeneration = () => {
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateText = async (formData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedText("");

    try {
      const data = await apiClient.generateText(formData);
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
