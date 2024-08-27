import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Modal from 'react-modal';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1rem;
  text-align: left;
`;

const Thead = styled.thead`
  background-color: #333;
  color: white;
`;

const Tbody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const Th = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const TaskDropdown = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

const TaskDetails = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #555;
`;

const ModalContent = styled.div`
  padding: 20px;
  text-align: center;
`;

const CloseButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4b4b;
  }
`;

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    border: '1px solid #ccc',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
    padding: '20px',
    color: '#fff',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const UserAnalytics = () => {
  const [userData, setUserData] = useState([]);
  const [taskData, setTaskData] = useState({});
  const [quizData, setQuizData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState({});
  const [selectedQuizDetails, setSelectedQuizDetails] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTask, setFilterTask] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, taskResponse, quizResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/user-info/fetchdata`),
          axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`),
          axios.get(`${process.env.REACT_APP_API_URL}/quizzes/questions`)
        ]);

        const tasks = taskResponse.data.reduce((acc, task) => {
          acc[task._id] = task.name;
          return acc;
        }, {});

        const quizzes = quizResponse.data.reduce((acc, quiz) => {
          acc[quiz._id] = quiz.questionText;
          return acc;
        }, {});

        setUserData(userResponse.data);
        setTaskData(tasks);
        setQuizData(quizzes);
        setFilteredData(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterAndSearchData = useCallback(() => {
    let filtered = userData;

    if (filterTask) {
      filtered = filtered.filter(user => user.tasksCompleted.some(taskId => taskData[taskId] === filterTask));
    }

    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.userID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        'demousername'.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchQuery, filterTask, userData, taskData]);

  useEffect(() => {
    filterAndSearchData();
  }, [searchQuery, filterTask, userData, filterAndSearchData]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleTaskSelect = (userID, taskId) => {
    const user = userData.find(user => user.userID === userID);
    if (user) {
      const task = user.taskHistory.find(task => task.taskId === taskId);
      if (task) {
        setSelectedTaskDetails(prevState => ({
          ...prevState,
          [userID]: {
            taskId: taskData[taskId] || taskId,
            completedAt: new Date(task.completedAt).toLocaleString()
          }
        }));
      }
    }
  };

  const handleQuizSelect = (userID, quizId) => {
    const user = userData.find(user => user.userID === userID);
    if (user) {
      const quiz = user.quizHistory.find(quiz => quiz.quizId === quizId);
      if (quiz) {
        setSelectedQuizDetails(prevState => ({
          ...prevState,
          [userID]: {
            quizId: quizData[quizId] || quizId,
            answeredAt: new Date(quiz.answeredAt).toLocaleString()
          }
        }));
      }
    }
  };

  if (loading) {
    return <p>Loading user analytics...</p>;
  }

  return (
    <div>
      <h1>User Analytics</h1>
      <p>View and manage user data and participation analytics.</p>

      <SearchInput
        type="text"
        placeholder="Search by User ID or Username"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TaskDropdown
        onChange={(e) => setFilterTask(e.target.value)}
      >
        <option value="">Filter by Task</option>
        {Object.values(taskData).map((taskName, index) => (
          <option key={index} value={taskName}>
            {taskName}
          </option>
        ))}
      </TaskDropdown>

      <Table>
        <Thead>
          <tr>
            <Th>Username</Th>
            <Th>User ID</Th>
            <Th>Total Points</Th>
            <Th>Tasks Completed</Th>
            <Th>Quizzes Completed</Th>
            <Th>Quiz Points</Th>
            <Th>Tap-Tap Points</Th>
          </tr>
        </Thead>
        <Tbody>
          {filteredData.map((user) => {
            const totalQuizPoints = user.quizHistory.reduce((sum, quiz) => sum + quiz.pointsEarned, 0);
            const totalTaskPoints = user.taskHistory.reduce((sum, task) => sum + task.pointsEarned, 0);
            const tapTapPoints = user.points - (totalQuizPoints + totalTaskPoints);

            return (
              <tr key={user.userID} onClick={() => handleUserClick(user)}>
                <Td>demousername</Td> {/* Static/dummy username */}
                <Td>{user.userID}</Td>
                <Td>{Math.floor(user.points)}</Td> 
                <Td>{user.tasksCompleted.length}</Td>
                <Td>{user.quizHistory.length}</Td>
                <Td>{totalQuizPoints}</Td>
                <Td>{Math.floor(tapTapPoints)}</Td>
              </tr>
            );
          })}
        </Tbody>
      </Table>

      {selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={customModalStyles}
          contentLabel="User Details"
          ariaHideApp={false}
        >
          <ModalContent>
            <h2>User ID: {selectedUser.userID}</h2>
            <h3>Total Points: {selectedUser.points}</h3>
            <h4>Task History:</h4>
            {selectedUser.taskHistory.length > 0 ? (
              <>
                <TaskDropdown
                  onChange={(e) => handleTaskSelect(selectedUser.userID, e.target.value)}
                >
                  <option value="">Select a task</option>
                  {selectedUser.taskHistory.map((task) => (
                    <option key={task.taskId} value={task.taskId}>
                      {taskData[task.taskId] || task.taskId} {/* Display task name */}
                    </option>
                  ))}
                </TaskDropdown>
                {selectedTaskDetails[selectedUser.userID] && (
                  <TaskDetails>
                    Task: {selectedTaskDetails[selectedUser.userID].taskId}, 
                    Completed At: {selectedTaskDetails[selectedUser.userID].completedAt}
                  </TaskDetails>
                )}
              </>
            ) : (
              <p>No tasks completed</p>
            )}

            <h4>Quiz History:</h4>
            {selectedUser.quizHistory.length > 0 ? (
              <>
                <TaskDropdown
                  onChange={(e) => handleQuizSelect(selectedUser.userID, e.target.value)}
                >
                  <option value="">Select a quiz</option>
                  {selectedUser.quizHistory.map((quiz) => (
                    <option key={quiz.quizId} value={quiz.quizId}>
                      {quizData[quiz.quizId] || quiz.quizId} {/* Display quiz name */}
                    </option>
                  ))}
                </TaskDropdown>
                {selectedQuizDetails[selectedUser.userID] && (
                  <TaskDetails>
                    Quiz: {selectedQuizDetails[selectedUser.userID].quizId}, 
                    Answered At: {selectedQuizDetails[selectedUser.userID].answeredAt}
                  </TaskDetails>
                )}
              </>
            ) : (
              <p>No quizzes completed</p>
            )}

            <CloseButton onClick={() => setIsModalOpen(false)}>Close</CloseButton>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default UserAnalytics;
