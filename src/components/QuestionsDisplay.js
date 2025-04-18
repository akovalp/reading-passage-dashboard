import React, { useState } from "react";
import Button from "./UI/Button";

const QuestionsDisplay = ({ questions, onQuizSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleChange = (index, choice) => {
    setSelectedAnswers((prev) => ({ ...prev, [index]: choice }));
  };

  const handleSubmit = () => {
    const correctCount = questions.reduce(
      (count, q, idx) => count + (selectedAnswers[idx] === q.answer ? 1 : 0),
      0
    );
    setScore(correctCount);
    setSubmitted(true);
    if (onQuizSubmit) {
      onQuizSubmit(correctCount, questions.length);
    }
  };

  // Reset quiz to allow retry
  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
    if (onQuizSubmit) {
      onQuizSubmit(null, questions.length);
    }
  };

  return (
    <div className="quiz-container">
      <h2>Quiz</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {questions.map((q, i) => (
          <div key={i} className="quiz-question">
            <p>
              <span className="question-number">Q{i + 1}:</span> {q.question}
            </p>
            <div className="choices-container">
              {q.choices.map((choice, j) => (
                <label
                  key={j}
                  className={`choice-label ${
                    submitted
                      ? choice === q.answer
                        ? "correct"
                        : selectedAnswers[i] === choice
                        ? "incorrect"
                        : ""
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={choice}
                    checked={selectedAnswers[i] === choice}
                    disabled={submitted}
                    onChange={() => handleChange(i, choice)}
                  />
                  {choice}
                </label>
              ))}
            </div>
          </div>
        ))}
        {!submitted ? (
          <Button
            className="primary submit-quiz-btn"
            onClick={handleSubmit}
            disabled={
              questions.length > 0 &&
              Object.keys(selectedAnswers).length !== questions.length
            }
          >
            Submit Answers
          </Button>
        ) : (
          <div className="quiz-results">
            <p>
              You got <span className="score-highlight">{score}</span> out of{" "}
              <span className="score-highlight">{questions.length}</span>{" "}
              correct.
            </p>
            {score === questions.length && (
              <p className="perfect-score">Perfect score! 🎉</p>
            )}
            <Button className="secondary retry-quiz-btn" onClick={handleReset}>
              Try Again
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionsDisplay;
