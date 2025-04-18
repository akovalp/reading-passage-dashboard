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
  questionProvider,
}) => {
  const [copied, setCopied] = useState(false);

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

          <div className="question-controls">
            <Button
              className="btn primary"
              onClick={handleCopyText}
              disabled={!generatedText}
            >
              {copied ? "Copied! ✓" : "Copy Text"}
            </Button>

            <Button
              className="btn secondary"
              onClick={onGenerateQuestions}
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
            <>
              <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                📚 Ready to Create
              </div>
              <p>Enter a topic and generate a reading passage</p>
            </>
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