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
  // Form data state
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

  // Handle form submission and update form data
  const handleGenerateText = async (data) => {
    setFormData(data);
    // Pass the form data along with the model
    await generateText({
      ...data,
      model: data.model, // Include selected model
    });
  };

  // Handle questions generation using provider from form data
  const handleGenerateQuestions = async () => {
    await generateQuestions(
      generatedText,
      formData.language,
      formData.questionProvider,
      formData.num_questions,
      formData.choices_num,
      formData.questionModel // Include selected question model
    );
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
            initialData={formData}
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
            questionProvider={formData.questionProvider}
            questionModel={formData.questionModel}
            formData={formData} // Pass formData to GeneratedContent
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
