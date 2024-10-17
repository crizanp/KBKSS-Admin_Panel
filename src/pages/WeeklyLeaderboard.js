import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Modal, Button, Table, Input, Tabs, Select } from 'antd'; // Add Select for week dropdown
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

const Container = styled.div`
  padding: 20px;
  background-color: #f0f4f8;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
`;

const FormContainer = styled.div`
  margin-top: 30px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #34495e;
  font-size: 20px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  background-color: #3498db;
  color: white;
  border: none;
  &:hover {
    background-color: #2980b9;
    color: white;
  }
`;

const ResetButton = styled(Button)`
  background-color: #e74c3c;
  color: white;
  border: none;
  &:hover {
    background-color: #c0392b;
    color: white;
  }
`;

const API_URL = process.env.REACT_APP_API_URL;

const WeeklyLeaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [top3Users, setTop3Users] = useState([
    { userID: '', username: '', weeklyPoints: 0 },
    { userID: '', username: '', weeklyPoints: 0 },
    { userID: '', username: '', weeklyPoints: 0 },
  ]);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD')); // Default to today's date
  const [endDate, setEndDate] = useState(moment().add(7, 'days').format('YYYY-MM-DD')); // Default to 7 days from today
  const [modalVisible, setModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weeklyTopUsers, setWeeklyTopUsers] = useState([]); // New state for weekly top users
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastEndDate, setLastEndDate] = useState(null);
  useEffect(() => {
    fetchLatestWeekAndTopUsers();
    fetchAllWeeks();
  }, []);
  useEffect(() => {
    const updateCountdown = () => {
      const remainingTime = calculateNextReset();
      setTimeLeft(remainingTime);
    };
  
    updateCountdown(); // Initial call to set timeLeft
    const timer = setInterval(updateCountdown, 1000); // Update every second
  
    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);
  const formatTimeLeft = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };
  useEffect(() => {
    const fetchLastEndDate = async () => {
      try {
        const response = await axios.get('/api/weekly-winner'); // Your API endpoint
        const lastWinner = response.data[0]; // Assuming the last winner is the first in the sorted list
        return lastWinner.weekEndDate; // This should return the last end date
      } catch (error) {
        console.error('Error fetching last end date:', error);
        return null;
      }
    };
  
    fetchLastEndDate().then((lastEndDate) => {
      if (lastEndDate) {
        setLastEndDate(moment(lastEndDate)); // Store it in state
      }
    });
  }, []);
  useEffect(() => {
    const updateCountdown = () => {
      if (lastEndDate) {
        const nextReset = moment(lastEndDate).add(7, 'days'); // Add 7 days to last end date
        const remainingTime = nextReset.diff(moment(), 'seconds'); // Calculate remaining time in seconds
  
        setTimeLeft(remainingTime); // Update state
      }
    };
  
    updateCountdown(); // Initial call to set timeLeft
    const timer = setInterval(updateCountdown, 1000); // Update every second
  
    return () => clearInterval(timer); // Cleanup on component unmount
  }, [lastEndDate]); // Re-run effect when lastEndDate changes  
  const calculateNextReset = () => {
    const now = moment();
    const nextReset = moment().day(7).startOf('day'); // Set to next Sunday at midnight
  
    if (nextReset.isBefore(now)) {
      nextReset.add(1, 'weeks'); // If today is Sunday, get next week's Sunday
    }
  
    return nextReset.diff(now, 'seconds'); // Return time difference in seconds
  };
  
  const fetchAllWeeks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/weekly-winner`);
      const sortedWeeks = response.data.sort(
        (a, b) => new Date(b.weekStartDate) - new Date(a.weekStartDate)
      );
      setWeeks(sortedWeeks);
      if (sortedWeeks.length > 0) {
        setSelectedWeek(sortedWeeks[0]);
        fetchWeeklyTopUsers(sortedWeeks[0].weekStartDate); // Fetch top users for the latest week
      }
    } catch (error) {
      console.error('Error fetching weekly winners', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestWeekAndTopUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/chartMetric/top-users-weekly`);
      if (response.data && Array.isArray(response.data.topUsers)) {
        setTopUsers(response.data.topUsers);
        const initialTop3 = response.data.topUsers.slice(0, 3).map((user) => ({
          userID: user.userID,
          username: user.username,
          weeklyPoints: user.weeklyPoints,
        }));
        setTop3Users(initialTop3);
      }

      const latestWinnerResponse = await axios.get(`${API_URL}/weekly-winner`);
      const latestWinner = latestWinnerResponse.data[0];

      if (latestWinner) {
        const lastEndDate = moment(latestWinner.weekEndDate);
        setStartDate(lastEndDate.format('YYYY-MM-DD'));
        const newEndDate = lastEndDate.add(7, 'days');
        setEndDate(newEndDate.format('YYYY-MM-DD'));
      }
    } catch (error) {
      console.error('Error fetching weekly top users or latest weekly winner', error);
      setTopUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Change how the weekStartDate is passed to the backend
const fetchWeeklyTopUsers = async (weekStartDate) => {
    setLoading(true);
    try {
      // Send only the date part (YYYY-MM-DD)
      const response = await axios.get(`${API_URL}/weekly-winner/${weekStartDate.split('T')[0]}`);
      setWeeklyTopUsers(response.data.topUsers || []);
    } catch (error) {
      console.error('Error fetching top users for the week', error);
      setWeeklyTopUsers([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
    fetchWeeklyTopUsers(value);
  };

  const handleInputChange = (index, field, value) => {
    const newTop3Users = [...top3Users];
    newTop3Users[index][field] = value;
    setTop3Users(newTop3Users);
  };

  const isValidInput = () => {
    if (!startDate || !endDate) {
      alert('Both start date and end date are required.');
      return false;
    }

    const start = moment(startDate);
    const end = moment(endDate);
    const currentDate = moment();

    if (end.diff(start, 'days') !== 7) {
      alert('The difference between start date and end date must be exactly 7 days.');
      return false;
    }

    if (end.isAfter(currentDate)) {
      alert("End date must be less than or equal to today's date.");
      return false;
    }

    for (const user of top3Users) {
      if (!user.userID || user.weeklyPoints == null || user.weeklyPoints < 0) {
        alert('Each user must have a valid userID and weeklyPoints greater than or equal to 0.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidInput()) return;

    const data = {
      weekStartDate: startDate,
      weekEndDate: endDate,
      topUsers: top3Users,
    };

    try {
      await axios.post(`${API_URL}/weekly-winner`, data);
      alert('Top 3 users saved successfully!');
      setModalVisible(true); // Open confirmation modal
    } catch (error) {
      console.error('Error saving top 3 users', error.response?.data || error.message);
      alert('Failed to save the top 3 users.');
    }
  };

  const handleResetPoints = async () => {
    try {
      await axios.post(`${API_URL}/weekly-winner/reset-weekly-points`);
      alert('Weekly points reset for all users.');
      setResetModalVisible(false);
      fetchLatestWeekAndTopUsers(); // Refresh leaderboard after reset
    } catch (error) {
      console.error('Error resetting weekly points', error);
      alert('Failed to reset weekly points.');
    }
  };

  const openResetModal = () => {
    setResetModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeResetModal = () => {
    setResetModalVisible(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userID',
      key: 'userID',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => text || 'Unnamed User',
    },
    {
      title: 'Weekly Points',
      dataIndex: 'weeklyPoints',
      key: 'weeklyPoints',
    },
  ];

  return (
    <Container>
      <Title>Weekly Leaderboard</Title>
<div style={{ textAlign: 'center', margin: '20px 0', fontSize: '20px', color: '#2c3e50' }}>
  Time left for the next reset: {formatTimeLeft(timeLeft)}
</div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Top Users" key="1">
          {/* Top 10 Users Table */}
          <Table dataSource={topUsers} columns={columns} pagination={false} />
        </TabPane>

        <TabPane tab="Edit Top 3 Users" key="2">
          {/* Editable Form Section for Top 3 Users */}
          <SectionTitle>Edit Top 3 Users</SectionTitle>
          <FormContainer>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="startDate">Start Date:</label>
                <Input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="endDate">End Date:</label>
                <Input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {top3Users.map((user, index) => (
                <div key={index}>
                  <SectionTitle>User {index + 1}</SectionTitle>
                  <div>
                    <label htmlFor={`userID${index}`}>User ID:</label>
                    <Input
                      type="text"
                      id={`userID${index}`}
                      value={user.userID}
                      onChange={(e) => handleInputChange(index, 'userID', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`username${index}`}>Username:</label>
                    <Input
                      type="text"
                      id={`username${index}`}
                      value={user.username}
                      onChange={(e) => handleInputChange(index, 'username', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`weeklyPoints${index}`}>Weekly Points:</label>
                    <Input
                      type="number"
                      id={`weeklyPoints${index}`}
                      value={user.weeklyPoints}
                      onChange={(e) => handleInputChange(index, 'weeklyPoints', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <ButtonContainer>
                <StyledButton type="primary" htmlType="submit">
                  Submit
                </StyledButton>
                <ResetButton onClick={openResetModal}>
                  Reset Points
                </ResetButton>
              </ButtonContainer>
            </form>
          </FormContainer>
        </TabPane>

        {/* New Tab for Weekly Users */}
        <TabPane tab="Weekly Top Users" key="3">
          <SectionTitle>Select a Week</SectionTitle>
          <Select
            value={selectedWeek?.weekStartDate}
            style={{ width: 200, marginBottom: '20px' }}
            onChange={handleWeekChange}
          >
            {weeks.map((week) => (
              <Option key={week.weekStartDate} value={week.weekStartDate}>
                {`${week.weekStartDate} - ${week.weekEndDate}`}
              </Option>
            ))}
          </Select>

          <Table dataSource={weeklyTopUsers} columns={columns} pagination={false} />
        </TabPane>
      </Tabs>

      {/* Success Modal */}
      <Modal
        title="Success"
        visible={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        <p>Top 3 users have been successfully saved!</p>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        title="Confirm Reset"
        visible={resetModalVisible}
        onCancel={closeResetModal}
        footer={[
          <Button key="cancel" onClick={closeResetModal}>
            Cancel
          </Button>,
          <Button key="reset" type="primary" onClick={handleResetPoints}>
            Reset Points
          </Button>,
        ]}
      >
        <p>Are you sure you want to reset the weekly points for all users?</p>
      </Modal>
    </Container>
  );
};

export default WeeklyLeaderboard;
