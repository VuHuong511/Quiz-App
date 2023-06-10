import React, { useState, useEffect } from "react";

const QuizScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [answerError, setAnswerError] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=5");
      const data = await response.json();
      setQuestions(data.results);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    setAnswerError("");
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === "") {
      setAnswerError("Please select an answer");
      return;
    }

    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
      setFeedbackText("Correct!");
    } else {
      setFeedbackText("Incorrect!");
    }

    setShowFeedback(true);
    setSelectedAnswer("");
    setTimeout(() => {
      setShowFeedback(false);
      setCurrentQuestion(currentQuestion + 1);
      setFeedbackText("");
      setAnswerError("");
    }, 1500);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }
  if (currentQuestion >= questions.length) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>
      </div>
    );
  }
  const currentQuestionData = questions[currentQuestion];
  const answers = [
    ...currentQuestionData.incorrect_answers,
    currentQuestionData.correct_answer,
  ];
  return (
    <div>
      <h2>Question {currentQuestion + 1}</h2>
      <p dangerouslySetInnerHTML={{ __html: currentQuestionData.question }}></p>
      {answers.map((answer, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`answer${index}`}
            name="answer"
            value={answer}
            checked={selectedAnswer === answer}
            onChange={() => handleAnswerSelection(answer)}
          />
          <label
            htmlFor={`answer${index}`}
            dangerouslySetInnerHTML={{ __html: answer }}
          ></label>
        </div>
      ))}
      {answerError && <p className="error">{answerError}</p>}
      <button onClick={handleNextQuestion}>Next</button>
      {showFeedback && <p>{feedbackText}</p>}
    </div>
  );
};
export default QuizScreen;
