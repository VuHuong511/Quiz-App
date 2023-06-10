import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizScreen = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://opentdb.com/api.php?amount=5"
        );
        setQuestions(response.data.results);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);
  return (
    <div>
      <h1>QuizScreen</h1>
      {questions.map((question, index) => (
        <div key={index}>
          <h2>{question.category}</h2>
          <p>{question.question}</p>
        </div>
      ))}
    </div>
  );
};

export default QuizScreen;
