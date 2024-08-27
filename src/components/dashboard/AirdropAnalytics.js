import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaUsers, FaChartLine } from 'react-icons/fa';

const AnalyticsContainer = styled.div`
  padding: 20px;
  margin-top: 20px;
  background-color: #f0fbf0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const OverviewContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const OverviewItem = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 30%;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
  color: #4CAF50;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  color: #666;
`;

const DropdownContainer = styled.div`
  margin-top: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
`;

const CompletionStats = styled.div`
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

function AirdropAnalytics() {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [taskCompletionRates, setTaskCompletionRates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/fetchdata`);
        const taskResponse = await axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
        setData(userResponse.data);
        setTasks(taskResponse.data);

        const taskRates = {};
        userResponse.data.forEach(user => {
          user.tasksCompleted.forEach(taskId => {
            taskRates[taskId] = (taskRates[taskId] || 0) + 1;
          });
        });

        setTaskCompletionRates(taskRates);
        setSelectedTask(Object.keys(taskRates)[0] || '');
      } catch (error) {
        console.error('Error fetching airdrop analytics:', error);
      }
    };

    fetchData();
  }, []);

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
  };

  const getTaskNameOrId = (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    return task?.name || taskId;
  };

  if (!data || Object.keys(taskCompletionRates).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <AnalyticsContainer>
      <OverviewContainer>
                  <Icon><FaChartLine /></Icon>
          <StatValue>{data.reduce((sum, user) => sum + user.points, 0).toFixed(2)}</StatValue>
          <StatLabel>Total Points Distributed</StatLabel>
        
      </OverviewContainer>

      <DropdownContainer>
        <Select value={selectedTask} onChange={handleTaskChange}>
          {Object.keys(taskCompletionRates).map(taskId => (
            <option key={taskId} value={taskId}>
              {getTaskNameOrId(taskId)}
            </option>
          ))}
        </Select>

        {selectedTask && (
          <CompletionStats>
            <h3>Task: {getTaskNameOrId(selectedTask)}</h3>
            <p>Completed by {taskCompletionRates[selectedTask]} users</p>
          </CompletionStats>
        )}
      </DropdownContainer>
    </AnalyticsContainer>
  );
}

export default AirdropAnalytics;
