import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CategoryManagement from '../components/CategoryManagement';
import QuizForm from '../components/QuizForm';
import QuizList from '../components/QuizList';

const Container = styled.div`
  padding: 20px;
  background-color: #f4f7fa;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const QuizManagement = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // For filtering
  const formRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchQuizzes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/categories`);
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/quiz/quizzes/questions`);
      setQuizzes(response.data);
    } catch (error) {
      setError('Error fetching quizzes');
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter quizzes by selected category
  const filteredQuizzes = selectedCategory
    ? quizzes.filter(quiz => quiz.category === selectedCategory)
    : quizzes;

  return (
    <Container>
      <Title>Quiz Management</Title>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <CategoryManagement categories={categories} setCategories={setCategories} />
      <div ref={formRef}>
        <QuizForm
          categories={categories}
          quizzes={quizzes}
          setQuizzes={setQuizzes}
          editingQuiz={editingQuiz}
          setEditingQuiz={setEditingQuiz}
        />
      </div>
      <QuizList
        quizzes={filteredQuizzes}
        setQuizzes={setQuizzes}
        onEdit={handleEditQuiz}
        categories={categories}
        setSelectedCategory={setSelectedCategory} // Pass function to change selected category
      />
    </Container>
  );
};

export default QuizManagement;
