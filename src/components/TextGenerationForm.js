import React, { useState, useEffect } from "react";
import Button from "./UI/Button";
import LoadingSpinner from "./UI/LoadingSpinner";
import ModelSelector from "./UI/ModelSelector";

const TextGenerationForm = ({ onGenerateText, isLoading, initialData }) => {
  const [formData, setFormData] = useState({
    topic: "",
    language: "English",
    level: "Basic",
    style: "Formal",
    provider: "ollama",
    model: "",
    questionProvider: "ollama",
    questionModel: "",
    num_questions: 5,
    choices_num: 4,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModelChange = (model) => {
    setFormData({
      ...formData,
      model,
    });
  };

  const handleQuestionModelChange = (questionModel) => {
    setFormData({
      ...formData,
      questionModel,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateText(formData);
  };

  return (
    <div className="form-container">
      <h2>Generate New Text</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Topic:</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            required
            placeholder="e.g., The history of the internet"
          />
        </div>

        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
          >
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="style">Style:</label>
          <input
            type="text"
            id="style"
            name="style"
            value={formData.style}
            onChange={handleInputChange}
            required
            placeholder="e.g., Formal, Casual, Academic"
          />
        </div>

        <div className="form-group">
          <label htmlFor="provider">Text Generation Provider:</label>
          <select
            id="provider"
            name="provider"
            value={formData.provider}
            onChange={handleInputChange}
          >
            <option value="ollama">Ollama</option>
            <option value="groq">Groq</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="model">Text Generation Model:</label>
          <ModelSelector
            provider={formData.provider}
            selectedModel={formData.model}
            onModelChange={handleModelChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="questionProvider">
            Question Generation Provider:
          </label>
          <select
            id="questionProvider"
            name="questionProvider"
            value={formData.questionProvider || "ollama"}
            onChange={handleInputChange}
          >
            <option value="ollama">Ollama</option>
            <option value="groq">Groq</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="questionModel">Question Generation Model:</label>
          <ModelSelector
            provider={formData.questionProvider}
            selectedModel={formData.questionModel}
            onModelChange={handleQuestionModelChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="num_questions">Number of Questions:</label>
          <select
            id="num_questions"
            name="num_questions"
            value={formData.num_questions}
            onChange={handleInputChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="choices_num">Choices per Question:</label>
          <select
            id="choices_num"
            name="choices_num"
            value={formData.choices_num}
            onChange={handleInputChange}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <Button type="submit" className="btn primary" disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner text="Generating..." />
          ) : (
            "Generate Text"
          )}
        </Button>
      </form>
    </div>
  );
};

export default TextGenerationForm;
