import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3498db;
  }
`;

const CreateTaskButton = styled(Button)`
  padding: 10px 20px;
  margin-bottom: 20px;
`;

const CreateCategoryButton = styled(Button)`
  margin-left: 20px;
  padding: 10px 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #2980b9;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #2980b9;
  }
`;

const ActionButton = styled(Button)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

const CategoryList = styled.div`
  margin-top: 20px;
`;

const CategoryItem = styled.div`
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

function IGHAirdropTasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    link: "",
    points: "",
    proofPlaceholder: "",
    category: "",
    logo: "",
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [editCategoryId, setEditCategoryId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching IGH tasks:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/igh-task-category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchTasks();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleCreateTask = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setNewTask({
      name: "",
      description: "",
      link: "",
      points: "",
      proofPlaceholder: "",
      category: categories.length ? categories[0]._id : "",
      logo: "",
    });
  };

  const handleCreateCategory = () => {
    setIsCategoryModalOpen(true);
    setNewCategory({ name: "" });
    setEditCategoryId(null);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks/${currentTaskId}`, newTask);
        setTasks(tasks.map((task) => (task._id === currentTaskId ? response.data : task)));
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`, newTask);
        setTasks([...tasks, response.data]);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }

    setIsModalOpen(false);
    setNewTask({
      name: "",
      description: "",
      link: "",
      points: "",
      proofPlaceholder: "",
      category: categories.length ? categories[0]._id : "",
      logo: "",
    });
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    if (editCategoryId) {
      // Edit mode for category
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/igh-task-category/${editCategoryId}`, newCategory);
        const updatedCategories = categories.map((category) =>
          category._id === editCategoryId ? { ...category, ...newCategory } : category
        );
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    } else {
      // Create new category
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/igh-task-category`, newCategory);
        setCategories([...categories, response.data]);
      } catch (error) {
        console.error("Error creating category:", error);
      }
    }

    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/igh-task-category/${categoryId}`);
        setCategories(categories.filter((category) => category._id !== categoryId));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);

    // Save the new order to the backend
    const reorderPromises = reorderedCategories.map((category, index) =>
      axios.put(`${process.env.REACT_APP_API_URL}/igh-task-category/reorder/${category._id}`, { newOrder: index })
    );
    Promise.all(reorderPromises).catch((error) => console.error("Error reordering categories:", error));
  };

  return (
    <Container>
      <Title>IGH Airdrop Tasks</Title>
      <CreateTaskButton onClick={handleCreateTask}>Create New Task</CreateTaskButton>
      <CreateCategoryButton onClick={handleCreateCategory}>Create New Category</CreateCategoryButton>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <CategoryList {...provided.droppableProps} ref={provided.innerRef}>
              {categories.map((category, index) => (
                <Draggable key={category._id} draggableId={category._id} index={index}>
                  {(provided) => (
                    <CategoryItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <span>{category.name}</span>
                      <div>
                        <Button onClick={() => handleCreateCategory(category)}>Edit</Button>
                        <ActionButton onClick={() => handleDeleteCategory(category._id)}>Delete</ActionButton>
                      </div>
                    </CategoryItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CategoryList>
          )}
        </Droppable>
      </DragDropContext>

      {/* Task Modal */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>{isEditMode ? "Edit Task" : "Create New Task"}</h2>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </ModalHeader>
            <form onSubmit={handleSubmitTask}>
              <Label>Task Name</Label>
              <Input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleInputChange}
                required
              />
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                required
              />
              <Label>Category</Label>
              <Select
                name="category"
                value={newTask.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <Button type="submit">{isEditMode ? "Update Task" : "Create Task"}</Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>{editCategoryId ? "Edit Category" : "Create New Category"}</h2>
              <Button onClick={() => setIsCategoryModalOpen(false)}>Close</Button>
            </ModalHeader>
            <form onSubmit={handleSubmitCategory}>
              <Label>Category Name</Label>
              <Input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
                required
              />
              <Button type="submit">{editCategoryId ? "Update Category" : "Create Category"}</Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default IGHAirdropTasks;
