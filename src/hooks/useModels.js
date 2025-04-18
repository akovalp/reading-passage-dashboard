import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../services/api";

/**
 * Custom hook for managing model data
 * @returns {Object} Model data and operations
 */
export const useModels = () => {
  const [models, setModels] = useState({
    ollama: [],
    groq: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch models from the backend
  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getAvailableModels();

      // Organize models by provider
      const ollamaModels = response.models.filter(
        (model) => model.provider === "ollama"
      );
      const groqModels = response.models.filter(
        (model) => model.provider === "groq"
      );

      setModels({
        ollama: ollamaModels,
        groq: groqModels,
      });

      return {
        ollama: ollamaModels,
        groq: groqModels,
      };
    } catch (err) {
      setError(err.message);
      console.error("Error fetching models:", err);
      return {
        ollama: [],
        groq: [],
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    isLoading,
    error,
    fetchModels,
  };
};
