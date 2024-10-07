import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const LevelListContainer = styled.div`
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

const LevelTable = styled.table`
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

const CreateLevelButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CreateLevelButton = styled.button`
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

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

function LevelManagement() {
  const [levels, setLevels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState({
    levelNumber: '',
    name: '',
    tasks: '',
    games: '',
    invites: '',
    avatarsUnlocked: '',
  });
  const [editLevelId, setEditLevelId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch all levels
    const fetchLevels = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-level/levels`);
        setLevels(response.data);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    fetchLevels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLevel((prevLevel) => ({
      ...prevLevel,
      [name]: value,
    }));
  };

  const handleCreateOrEditLevel = async () => {
    setIsLoading(true);
    
    const formattedLevel = {
      ...newLevel,
      levelNumber: parseInt(newLevel.levelNumber),
      tasks: parseInt(newLevel.tasks),
      games: parseInt(newLevel.games),
      invites: parseInt(newLevel.invites),
      avatarsUnlocked: parseInt(newLevel.avatarsUnlocked),
    };

    console.log('Payload being sent:', formattedLevel); // Debugging: log the payload

    if (editLevelId) {
      // Edit existing level
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/user-level/levels/${editLevelId}`, formattedLevel);
        const updatedLevels = levels.map((level) =>
          level._id === editLevelId ? { ...level, ...formattedLevel } : level
        );
        setLevels(updatedLevels);
      } catch (error) {
        console.error('Error updating level:', error);
      }
    } else {
      // Create new level
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user-level/levels`, formattedLevel);
        setLevels([...levels, response.data]);
      } catch (error) {
        console.error('Error creating level:', error);
        console.log('Server response:', error.response); // Debugging: log server response
      }
    }

    setIsModalOpen(false);
    setNewLevel({
      levelNumber: '',
      name: '',
      tasks: '',
      games: '',
      invites: '',
      avatarsUnlocked: '',
    });
    setEditLevelId(null);
    setIsLoading(false);
  };

  const handleEditLevel = (level) => {
    setEditLevelId(level._id);
    setNewLevel({
      levelNumber: level.levelNumber,
      name: level.name,
      tasks: level.criteria.tasks,
      games: level.criteria.games,
      invites: level.criteria.invites,
      avatarsUnlocked: level.criteria.avatarsUnlocked,
    });
    setIsModalOpen(true);
  };

  const handleDeleteLevel = async (levelId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/user-level/levels/${levelId}`);
      setLevels(levels.filter((level) => level._id !== levelId));
    } catch (error) {
      console.error('Error deleting level:', error);
    }
  };

  return (
    <LevelListContainer>
      <Header>
        <Title>Level Management</Title>
      </Header>
      <LevelTable>
        <Thead>
          <tr>
            <Th>Level Number</Th>
            <Th>Name</Th>
            <Th>Tasks</Th>
            <Th>Games</Th>
            <Th>Invites</Th>
            <Th>Avatars Unlocked</Th>
            <Th>Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {levels.map((level) => (
            <tr key={level._id}>
              <Td>{level.levelNumber}</Td>
              <Td>{level.name}</Td>
              <Td>{level.criteria.tasks}</Td>
              <Td>{level.criteria.games}</Td>
              <Td>{level.criteria.invites}</Td>
              <Td>{level.criteria.avatarsUnlocked}</Td>
              <Td>
                <Button onClick={() => handleEditLevel(level)}>Edit</Button>
                <DeleteButton onClick={() => handleDeleteLevel(level._id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </Tbody>
      </LevelTable>

      <CreateLevelButtonContainer>
        <CreateLevelButton onClick={() => setIsModalOpen(true)}>Create New Level</CreateLevelButton>
      </CreateLevelButtonContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>{editLevelId ? 'Edit Level' : 'Create New Level'}</h2>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </ModalHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateOrEditLevel();
              }}
            >
              <Label>Level Number</Label>
              <Input
                type="number"
                name="levelNumber"
                value={newLevel.levelNumber}
                onChange={handleInputChange}
                required
              />
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={newLevel.name}
                onChange={handleInputChange}
                required
              />
              <Label>Tasks</Label>
              <Input
                type="number"
                name="tasks"
                value={newLevel.tasks}
                onChange={handleInputChange}
                required
              />
              <Label>Games</Label>
              <Input
                type="number"
                name="games"
                value={newLevel.games}
                onChange={handleInputChange}
                required
              />
              <Label>Invites</Label>
              <Input
                type="number"
                name="invites"
                value={newLevel.invites}
                onChange={handleInputChange}
                required
              />
              <Label>Avatars Unlocked</Label>
              <Input
                type="number"
                name="avatarsUnlocked"
                value={newLevel.avatarsUnlocked}
                onChange={handleInputChange}
                required
              />
              <Button type="submit" disabled={isLoading}>
                {editLevelId ? 'Update Level' : 'Create Level'}
              </Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </LevelListContainer>
  );
}

export default LevelManagement;
