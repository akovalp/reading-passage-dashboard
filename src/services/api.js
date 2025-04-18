// src/services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Common API client for interacting with the backend
 */
export const apiClient = {
  /**
   * Generate a reading passage with the given parameters
   * @param {Object} params - Text generation parameters
   * @returns {Promise<Object>} Generated text response
   */
  async generateText(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/text/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
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

      return await response.json();
    } catch (error) {
      console.error("Text generation error:", error);
      throw error;
    }
  },

  /**
   * Generate questions for a given text
   * @param {Object} params - Question generation parameters
   * @returns {Promise<Object>} Generated questions response
   */
  async generateQuestions(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate questions: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Question generation error:", error);
      throw error;
    }
  },
};
