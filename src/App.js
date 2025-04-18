// App.jsx
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import TextGenerationForm from "./components/TextGenerationForm";
import GeneratedContent from "./components/GeneratedContent";
import { useTextGeneration } from "./hooks/useTextGeneration";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import "./App.css";

function App() {
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

  // Handle questions generation
  const handleGenerateQuestions = async () => {
    await generateQuestions(generatedText, "English", "ollama");
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
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
