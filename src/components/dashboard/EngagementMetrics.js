import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaUsers, FaChartLine } from 'react-icons/fa';

const MetricsContainer = styled.div`
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TotalUsersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const TotalUsersIcon = styled(FaUsers)`
  font-size: 2rem;
  color: #4CAF50;
`;

const TotalUsersText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  cursor: pointer;
  padding: 10px;
  border-bottom: 3px solid ${props => (props.active ? '#4CAF50' : 'transparent')};
  color: ${props => (props.active ? '#4CAF50' : '#666')};
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  font-size: 1.1rem;

  &:hover {
    color: #4CAF50;
  }
`;

const Content = styled.div`
  flex-grow: 1;
`;

const MetricGrid = styled.div`
  display: flex;
  gap: 20px;
`;

const MetricColumn = styled.div`
  flex: 1;
`;

const MetricCard = styled.div`
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MetricIcon = styled(FaChartLine)`
  font-size: 1.5rem;
  margin-right: 10px;
  color: #4CAF50;
`;

const MetricText = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

function EngagementMetrics() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    dailyActiveUsers: [],
    totalLast7Days: 0,
    totalLast15Days: 0,
    totalLast30Days: 0,
  });

  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/chartMetric/engagement-metrics`);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching engagement metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const renderDailyMetrics = () => {
    const half = Math.ceil(metrics.dailyActiveUsers.length / 2);
    const firstColumn = metrics.dailyActiveUsers.slice(0, half);
    const secondColumn = metrics.dailyActiveUsers.slice(half);

    return (
      <MetricGrid>
        <MetricColumn>
          {firstColumn.map((dayMetric, index) => (
            <MetricCard key={index}>
              <MetricIcon />
              <MetricText>
                <strong>{dayMetric.day}:</strong> {dayMetric.count} active users
              </MetricText>
            </MetricCard>
          ))}
        </MetricColumn>
        <MetricColumn>
          {secondColumn.map((dayMetric, index) => (
            <MetricCard key={index}>
              <MetricIcon />
              <MetricText>
                <strong>{dayMetric.day}:</strong> {dayMetric.count} active users
              </MetricText>
            </MetricCard>
          ))}
        </MetricColumn>
      </MetricGrid>
    );
  };

  const renderWeeklyMetrics = () => (
    <>
      <MetricCard>
        <MetricIcon />
        <MetricText><strong>Total Active Users (Last 7 Days):</strong> {metrics.totalLast7Days}</MetricText>
      </MetricCard>
      <MetricCard>
        <MetricIcon />
        <MetricText><strong>Total Active Users (Last 15 Days):</strong> {metrics.totalLast15Days}</MetricText>
      </MetricCard>
      <MetricCard>
        <MetricIcon />
        <MetricText><strong>Total Active Users (Last 30 Days):</strong> {metrics.totalLast30Days}</MetricText>
      </MetricCard>
    </>
  );

  return (
    <MetricsContainer>
      <TotalUsersContainer>
        <TotalUsersIcon />
        <TotalUsersText>{metrics.totalUsers} Total Users</TotalUsersText>
      </TotalUsersContainer>

      <Tabs>
        <Tab active={activeTab === 'daily'} onClick={() => setActiveTab('daily')}>Daily</Tab>
        <Tab active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')}>Weekly</Tab>
      </Tabs>

      <Content>
        {activeTab === 'daily' && renderDailyMetrics()}
        {activeTab === 'weekly' && renderWeeklyMetrics()}
      </Content>
    </MetricsContainer>
  );
}

export default EngagementMetrics;
