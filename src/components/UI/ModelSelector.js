import React, { useEffect, useState } from "react";
import { useModels } from "../../hooks/useModels";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Model selector component that displays available models based on the selected provider
 */
const ModelSelector = ({
  provider,
  selectedModel,
  onModelChange,
  className = "",
}) => {
  const { models, isLoading, error } = useModels();
  const [availableModels, setAvailableModels] = useState([]);

  // Update available models when provider changes
  useEffect(() => {
    if (provider && models[provider]) {
      setAvailableModels(models[provider]);
    } else {
      setAvailableModels([]);
    }
  }, [provider, models]);

  // Set default model when available models change
  useEffect(() => {
    if (availableModels.length > 0 && !selectedModel) {
      onModelChange(availableModels[0].id);
    }
  }, [availableModels, selectedModel, onModelChange]);

  // Handle model selection
  const handleChange = (e) => {
    onModelChange(e.target.value);
  };

  return (
    <div className={`model-selector ${className}`}>
      {isLoading ? (
        <div className="model-loading">
          <LoadingSpinner text="Loading models..." />
        </div>
      ) : error ? (
        <div className="model-error">
          <p>Failed to load models: {error}</p>
          <select
            value={selectedModel || ""}
            onChange={handleChange}
            disabled={true}
          >
            <option value="">No models available</option>
          </select>
        </div>
      ) : availableModels.length > 0 ? (
        <select
          value={selectedModel || availableModels[0]?.id || ""}
          onChange={handleChange}
          className="model-select"
        >
          {availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.id}
            </option>
          ))}
        </select>
      ) : (
        <select disabled={true} className="model-select">
          <option value="">No models available</option>
        </select>
      )}
    </div>
  );
};

export default ModelSelector;
