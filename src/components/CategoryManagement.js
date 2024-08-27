import React, { useState } from 'react';
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

const CategoryManagement = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/categories`, { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <Section>
      <SectionTitle>Add New Category</SectionTitle>
      <Input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Category Name"
      />
      <Button onClick={handleAddCategory}>Add Category</Button>
    </Section>
  );
};

export default CategoryManagement;
