import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const TaskListContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
`;

const AirdropSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Thead = styled.thead`
  background-color: #2c3e50;
  color: white;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: bold;
`;

const Tbody = styled.tbody`
  & > tr:nth-child(even) {
    background-color: #f4f4f4;
  }
`;

const Td = styled.td`
  padding: 15px;
  vertical-align: middle;
`;

const CreateTaskButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CreateTaskButton = styled.button`
  padding: 10px 20px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #3498db;
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
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 80%;
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

const TextArea = styled.textarea`
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

const Button = styled.button`
  padding: 10px 20px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #3498db;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

function TaskList() {
  const [airdrops, setAirdrops] = useState([]);
  const [selectedAirdrop, setSelectedAirdrop] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    link: '',
    points: '',
    proofPlaceholder: '',
    category: 'Special',
  });

  useEffect(() => {
    // Fetch all airdrops
    const fetchAirdrops = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/airdrops`);
        setAirdrops(response.data);
        if (response.data.length > 0) {
          setSelectedAirdrop(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching airdrops:', error);
      }
    };

    fetchAirdrops();
  }, []);

  useEffect(() => {
    if (selectedAirdrop) {
      // Fetch tasks for the selected airdrop
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${selectedAirdrop}`);
          setTasks(response.data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    }
  }, [selectedAirdrop]);

  const handleAirdropChange = (e) => {
    setSelectedAirdrop(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleCreateTask = () => {
    setIsModalOpen(true);
  };

  const handleSubmitTask = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/${selectedAirdrop}`, newTask);
      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
      setNewTask({
        name: '',
        description: '',
        link: '',
        points: '',
        proofPlaceholder: '',
        category: 'Special',
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <TaskListContainer>
      <Header>
        <Title>Tasks for {airdrops.find((airdrop) => airdrop._id === selectedAirdrop)?.name}</Title>
        <AirdropSelect value={selectedAirdrop} onChange={handleAirdropChange}>
          {airdrops.map((airdrop) => (
            <option key={airdrop._id} value={airdrop._id}>
              {airdrop.name}
            </option>
          ))}
        </AirdropSelect>
      </Header>
      <TaskTable>
        <Thead>
          <tr>
            <Th>Task Name</Th>
            <Th>Description</Th>
            <Th>Link</Th>
            <Th>Points</Th>
            <Th>Category</Th>
            <Th>Proof Placeholder</Th>
          </tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <Td>{task.name}</Td>
              <Td>{task.description}</Td>
              <Td>
                <a href={task.link} target="_blank" rel="noopener noreferrer">
                  {task.link}
                </a>
              </Td>
              <Td>{task.points}</Td>
              <Td>{task.category}</Td>
              <Td>{task.proofPlaceholder}</Td>
            </tr>
          ))}
        </Tbody>
      </TaskTable>

      <CreateTaskButtonContainer>
        <CreateTaskButton onClick={handleCreateTask}>Create New Task</CreateTaskButton>
      </CreateTaskButtonContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>Create New Task</h2>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </ModalHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitTask(); }}>
              <Label>Task Name</Label>
              <Input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleInputChange}
                required
              />
              <Label>Description</Label>
              <TextArea
                name="description"
                rows="3"
                value={newTask.description}
                onChange={handleInputChange}
                required
              />
              <Label>Link</Label>
              <Input
                type="url"
                name="link"
                value={newTask.link}
                onChange={handleInputChange}
                required
              />
              <Label>Points</Label>
              <Input
                type="number"
                name="points"
                value={newTask.points}
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
                <option value="Special">Special</option>
                <option value="Daily">Daily</option>
                <option value="Lists">Lists</option>
                <option value="Extra">Extra</option>
              </Select>
              <Label>Proof Placeholder</Label>
              <Input
                type="text"
                name="proofPlaceholder"
                value={newTask.proofPlaceholder}
                onChange={handleInputChange}
                required
              />
              <Button type="submit">Create Task</Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </TaskListContainer>
  );
}

export default TaskList;
