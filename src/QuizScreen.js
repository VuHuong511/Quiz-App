import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

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
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const { confirm } = window;

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

    // Show a confirmation pop-up
    const proceed = confirm("Are you sure you want to choose this option?");

    if (proceed) {
      const currentQuestionData = questions[currentQuestion];
      const isCorrect = selectedAnswer === currentQuestionData.correct_answer;
      setIsAnswerCorrect(isCorrect);

      if (isCorrect) {
        setScore(score + 1);
        setFeedbackText("Correct!");
      } else {
        setFeedbackText("Incorrect!");
      }

      setShowAnswerFeedback(true);
      setSelectedAnswer("");
      setTimeout(() => {
        setShowAnswerFeedback(false);
        if (currentQuestion + 1 >= questions.length) {
          setQuizComplete(true);
        } else {
          setCurrentQuestion(currentQuestion + 1);
        }
        setFeedbackText("");
        setAnswerError("");
      }, 1500);
    }
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (quizComplete) {
    const passThreshold = Math.floor(questions.length * 0.6);
    const isPass = score >= passThreshold;

    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    if (isPass) {
      return (
        <div
          style={{ background: "#2B2A4C" }}
          className="min-h-screen p-4 text-center "
        >
          <div className="question-container mx-auto max-w-md mt-[100px] bg-white rounded-lg p-6">
            <div className="flex items-center justify-center mb-4 ">
              <img
                src="https://i.pinimg.com/564x/e7/bb/a8/e7bba8cfe31a357998e454d5bf84ab2a.jpg"
                alt="Gold Medal"
                className="w-20 h-20 mr-2"
              />
            </div>
            <p className="text-2xl font-bold mb-4 text-black ">
              Congratulations!
            </p>
            <p className="text-lg mb-4">You are amazing!</p>
            <p className="text-lg mb-4 ">
              Correct Answers: {score} / {questions.length}
            </p>
            <p className="text-lg ">
              Time Taken: {minutes} minutes {seconds} seconds
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{ background: "#2B2A4C" }}
          className="min-h-screen p-4 text-center "
        >
          <div className="question-container mx-auto max-w-md mt-[100px] bg-white rounded-lg p-6">
            <div className="flex items-center justify-center mb-4 ">
              <img
                src="https://i.pinimg.com/564x/79/07/b5/7907b5aec472cb7cfccaf75f16bb4648.jpg"
                alt="Gold Medal"
                className="w-20 h-20 mr-2"
              />
            </div>
            <p className="text-2xl font-bold mb-4 text-black ">Completed!</p>
            <p className="text-lg mb-4">Better Luck next time</p>
            <p className="text-lg mb-4 ">
              Correct Answers: {score} / {questions.length}
            </p>
            <p className="text-lg ">
              Time Taken: {minutes} minutes {seconds} seconds
            </p>
          </div>
        </div>
      );
    }
  }

  const currentQuestionData = questions[currentQuestion];
  const answers = [
    ...currentQuestionData.incorrect_answers,
    currentQuestionData.correct_answer,
  ];

  return (
    <div style={{ background: "#2B2A4C" }} className=" min-h-screen py-8">
      {!quizStarted && (
        <div className="start-container mx-auto max-w-sm">
          <img
            src="https://i.pinimg.com/564x/dd/b5/ec/ddb5ec3a1c40195db6e1ccbeb2065508.jpg"
            alt="Image"
            className="mt-8 md:mt-12 max-w-full w-full h-auto rounded-3xl border-2 mb-2"
          />

          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="start-input w-full md:w-[315px] px-4 py-2 rounded mb-4"
            required
          />
          <button
            onClick={handleStartQuiz}
            className="start-button bg-blue-500 text-white rounded py-2 px-4"
          >
            Start
          </button>
        </div>
      )}
      {quizStarted && (
        <div className="question-container mx-auto max-w-md mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="question-heading text-3xl font-bold mb-4 text-white">
            Question {currentQuestion + 1} / 5
          </h2>
          <p
            dangerouslySetInnerHTML={{ __html: currentQuestionData.question }}
            className="question-text mb-4 text-white"
          ></p>
          {answers.map((answer, index) => (
            <div
              key={index}
              className="border rounded-lg  border-white  answer-option flex items-center mb-2 text-white"
            >
              <input
                type="radio"
                id={`answer${index}`}
                name="answer"
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => handleAnswerSelection(answer)}
                className="answer-input mr-2"
              />
              <label
                htmlFor={`answer${index}`}
                dangerouslySetInnerHTML={{ __html: answer }}
                className="answer-label text-lg"
              ></label>
            </div>
          ))}
          {answerError && (
            <p className="error text-red-500 mb-4">{answerError}</p>
          )}
          <button
            onClick={handleNextQuestion}
            className="next-button bg-blue-500 text-white rounded py-2 px-4 mt-4"
          >
            Next
          </button>
          {showAnswerFeedback && (
            <p
              className={`feedback-text mt-4 ${
                isAnswerCorrect ? "text-green-500" : "text-red-500"
              }`}
            >
              {feedbackText}
            </p>
          )}
          <p className="elapsed-time mt-4 text-white flex mr-3">
            <FaClock className="mr-4" /> {Math.floor(elapsedTime / 60000)}{" "}
            minutes {Math.floor((elapsedTime % 60000) / 1000)} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
