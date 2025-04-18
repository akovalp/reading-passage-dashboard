// App.jsx
import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import TextGenerationForm from "./components/TextGenerationForm";
import GeneratedContent from "./components/GeneratedContent";
import { useTextGeneration } from "./hooks/useTextGeneration";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import "./App.css";

function App() {
  // Quiz result state
  const [quizResult, setQuizResult] = useState(null);

  // Text generation hook
  const {
    generatedText,
    isLoading: isTextLoading,
    error: textError,
    generateText,
  } = useTextGeneration();

  // Questions generation hook
  const {
    questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
    showQuestions,
    generateQuestions,
  } = useQuestionGeneration();

  // Handle form submission
  const handleGenerateText = async (formData) => {
    await generateText(formData);
  };

  // Handle questions generation, accept provider from UI
  const handleGenerateQuestions = async (provider) => {
    await generateQuestions(generatedText, "English", provider);
  };

  // Handle quiz submission
  const handleQuizSubmit = (score, total) => {
    setQuizResult(score != null ? `${score} / ${total}` : null);
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Header title="Reading Passage Dashboard" />

        <div className="content">
          <TextGenerationForm
            onGenerateText={handleGenerateText}
            isLoading={isTextLoading}
          />

          <GeneratedContent
            generatedText={generatedText}
            isLoading={isTextLoading}
            textError={textError || questionsError}
            isQuestionsLoading={isQuestionsLoading}
            questions={questions}
            showQuestions={showQuestions}
            onGenerateQuestions={handleGenerateQuestions}
            onQuizSubmit={handleQuizSubmit}
            quizResult={quizResult}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
