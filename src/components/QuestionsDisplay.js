import React from "react";

const QuestionsDisplay = ({ questions }) => {
  return (
    <div className="questions-container">
      <h2>Generated Questions</h2>
      {questions.map((q, i) => (
        <div key={i} className="question">
          <p>
            <strong>Q{i + 1}:</strong> {q.question}
          </p>
          <ul>
            {q.choices.map((choice, j) => (
              <li
                key={j}
                className={choice === q.answer ? "correct-answer" : ""}
              >
                {choice}
                {choice === q.answer && " ✓"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuestionsDisplay;
