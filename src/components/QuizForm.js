import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Section = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #007bff;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Checkbox = styled.input`
  margin-left: 10px;
`;

const OptionLabel = styled.span`
  margin-left: 5px;
  font-size: 14px;
  color: #333;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #cc0000;
  }
`;

const QuizForm = ({ categories, quizzes, setQuizzes, editingQuiz, setEditingQuiz }) => {
  const [newQuiz, setNewQuiz] = useState({
    category: '',
    questionText: '',
    options: [{ text: '', isCorrect: false }],
    points: 0,
  });

  useEffect(() => {
    if (editingQuiz) {
      setNewQuiz(editingQuiz);
    } else {
      setNewQuiz({
        category: '',
        questionText: '',
        options: [{ text: '', isCorrect: false }],
        points: 0,
      });
    }
  }, [editingQuiz]);

  const handleAddOption = () => {
    setNewQuiz({
      ...newQuiz,
      options: [...newQuiz.options, { text: '', isCorrect: false }],
    });
  };

  const handleDeleteOption = (index) => {
    setNewQuiz({
      ...newQuiz,
      options: newQuiz.options.filter((_, i) => i !== index),
    });
  };

  const handleCreateOrUpdateQuiz = async () => {
    if (!newQuiz.category) {
      alert('Please select a category');
      return;
    }

    try {
      if (editingQuiz) {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/quiz/quizzes/${editingQuiz._id}`, newQuiz);
        setQuizzes(quizzes.map(quiz => quiz._id === editingQuiz._id ? response.data : quiz));
        setEditingQuiz(null);
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/quiz/quizzes`, newQuiz);
        setQuizzes([...quizzes, response.data]);
      }
      
      setNewQuiz({
        category: '',
        questionText: '',
        options: [{ text: '', isCorrect: false }],
        points: 0,
      });
    } catch (error) {
      console.error('Error creating or updating quiz:', error);
    }
  };

  return (
    <Section>
      <SectionTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</SectionTitle>
      <select
        value={newQuiz.category}
        onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '16px',
        }}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <Input
        type="text"
        value={newQuiz.questionText}
        onChange={(e) => setNewQuiz({ ...newQuiz, questionText: e.target.value })}
        placeholder="Question Text"
      />
      <Input
        type="number"
        value={newQuiz.points}
        onChange={(e) => setNewQuiz({ ...newQuiz, points: Number(e.target.value) })}
        placeholder="Points"
      />

      <h3>Options</h3>
      {newQuiz.options.map((option, index) => (
        <OptionContainer key={index}>
          <Input
            type="text"
            value={option.text}
            onChange={(e) => {
              const updatedOptions = newQuiz.options.map((opt, i) =>
                i === index ? { ...opt, text: e.target.value } : opt
              );
              setNewQuiz({ ...newQuiz, options: updatedOptions });
            }}
            placeholder="Option Text"
          />
          <Checkbox
            type="checkbox"
            checked={option.isCorrect}
            onChange={(e) => {
              const updatedOptions = newQuiz.options.map((opt, i) =>
                i === index ? { ...opt, isCorrect: e.target.checked } : opt
              );
              setNewQuiz({ ...newQuiz, options: updatedOptions });
            }}
          />
          <OptionLabel>Correct Answer</OptionLabel>
          <DeleteButton onClick={() => handleDeleteOption(index)}>Delete Option</DeleteButton>
        </OptionContainer>
      ))}
      <Button onClick={handleAddOption}>Add Another Option</Button>
      <Button onClick={handleCreateOrUpdateQuiz}>{editingQuiz ? 'Update Quiz' : 'Create Quiz'}</Button>
    </Section>
  );
};

export default QuizForm;
