import React, { useState, useEffect } from "react";

const QuizScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

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
      if (currentQuestion + 1 >= questions.length) {
        setQuizComplete(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
      setFeedbackText("");
      setAnswerError("");
    }, 1500);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleStartQuiz = () => {
    if (name.trim() === "") {
      setNameError("Please enter your name");
      return;
    }
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (quizStarted && !quizComplete) {
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizStarted, quizComplete, startTime]);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (quizComplete) {
    const passThreshold = Math.floor(questions.length * 0.6); // Adjust the pass threshold as desired
    const isPass = score >= passThreshold;

    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>
        <p>Elapsed Time: {Math.floor(elapsedTime / 1000)} seconds</p>
        <p>Pass Status: {isPass ? "Passed" : "Failed"}</p>
        <p>Correct Answers: {score}</p>
        <p>Incorrect Answers: {questions.length - score}</p>
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
      {!quizStarted && (
        <div>
          <label htmlFor="name">Enter your name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
          {nameError && <p className="error">{nameError}</p>}
          <button onClick={handleStartQuiz}>Start</button>
        </div>
      )}
      {quizStarted && (
        <div>
          <h2>Question {currentQuestion + 1}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: currentQuestionData.question }}
          ></p>
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
          <p>Elapsed Time: {Math.floor(elapsedTime / 1000)} seconds</p>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
