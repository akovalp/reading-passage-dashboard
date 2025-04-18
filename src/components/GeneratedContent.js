import React, { useState } from "react";
import Button from "./UI/Button";
import LoadingSpinner from "./UI/LoadingSpinner";
import QuestionsDisplay from "./QuestionsDisplay";

const GeneratedContent = ({
  generatedText,
  isLoading,
  textError,
  isQuestionsLoading,
  questions,
  showQuestions,
  onGenerateQuestions,
  onQuizSubmit,
  quizResult,
}) => {
  const [copied, setCopied] = useState(false);
  const [questionProvider, setQuestionProvider] = useState("ollama");

  const handleCopyText = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="results-container">
      <h2>Generated Text</h2>
      {textError && <div className="error">{textError}</div>}

      {generatedText ? (
        <>
          <div className="text-output">
            {generatedText.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="actions">
            <Button
              className="btn primary"
              onClick={handleCopyText}
              disabled={!generatedText}
            >
              {copied ? "Copied! ✓" : "Copy Text"}
            </Button>

            {/* provider selection for questions */}
            <div className="form-group question-provider-group">
              <label htmlFor="question-provider">Provider:</label>
              <select
                id="question-provider"
                value={questionProvider}
                onChange={(e) => setQuestionProvider(e.target.value)}
              >
                <option value="ollama">Ollama</option>
                <option value="groq">Groq</option>
              </select>
            </div>
            <Button
              className="btn secondary"
              onClick={() => onGenerateQuestions(questionProvider)}
              disabled={isQuestionsLoading}
            >
              {isQuestionsLoading ? (
                <LoadingSpinner text="Generating Questions..." />
              ) : (
                "Generate Questions"
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="placeholder">
          {isLoading ? (
            <LoadingSpinner text="Generating text..." />
          ) : (
            "Enter a topic and generate a reading passage"
          )}
        </div>
      )}

      {showQuestions && questions.length > 0 && (
        <>
          {quizResult && (
            <div className="quiz-summary">Last quiz result: {quizResult}</div>
          )}
          <QuestionsDisplay questions={questions} onQuizSubmit={onQuizSubmit} />
        </>
      )}
    </div>
  );
};

export default GeneratedContent;
