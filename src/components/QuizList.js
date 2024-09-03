import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const QuizContainer = styled.div`
  margin-top: 30px;
`;

const QuizCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const QuizQuestion = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const QuizOption = styled.li`
  font-size: 16px;
  color: ${(props) => (props.isCorrect ? '#28a745' : '#333')};
`;

const Points = styled.p`
  color: #ff9800;
  font-weight: bold;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const QuizList = ({ quizzes, setQuizzes, onEdit, categories, setSelectedCategory }) => {
  const [showModal, setShowModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const handleDeleteQuiz = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/quiz/quizzes/${quizToDelete}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete));
      setShowModal(false);
      setQuizToDelete(null);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const openDeleteModal = (quizId) => {
    setQuizToDelete(quizId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setQuizToDelete(null);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <QuizContainer>
      <FilterContainer>
        <select onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </FilterContainer>

      <h2>Existing Quizzes</h2>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz._id}>
          <QuizQuestion>{quiz.questionText}</QuizQuestion>
          <ul>
            {quiz.options.map((option, index) => (
              <QuizOption key={index} isCorrect={option.isCorrect}>
                {option.text} {option.isCorrect && <strong>(Correct)</strong>}
              </QuizOption>
            ))}
          </ul>
          <Points>Points: {quiz.points}</Points>
          <Button onClick={() => onEdit(quiz)}>Edit</Button>
          <Button onClick={() => openDeleteModal(quiz._id)}>Delete</Button>
        </QuizCard>
      ))}

      {showModal && (
        <ModalOverlay>
          <Modal>
            <h3>Are you sure you want to delete this quiz?</h3>
            <div>
              <Button onClick={handleDeleteQuiz}>Yes, Delete</Button>
              <Button onClick={closeModal}>Cancel</Button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </QuizContainer>
  );
};

export default QuizList;
