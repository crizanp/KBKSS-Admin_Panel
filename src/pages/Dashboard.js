import React from 'react';
import styled from 'styled-components';
import UserGrowthChart from '../components/dashboard/UserGrowthChart';
import TopUserTable from '../components/dashboard/TopUsersTable';
import EngagementMetrics from '../components/dashboard/EngagementMetrics';
import AirdropAnalytics from '../components/dashboard/AirdropAnalytics';

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px;
`;

const HalfWidthContainer = styled.div`
  background-color: #f0fbf0;
  padding: 10px;
  border-radius: 8px;
  width: 48%; /* Set width to 48% to allow for spacing */
  margin-bottom: 20px;

  @media (max-width: 768px) {
    width: 100%; /* Full width on smaller screens */
  }
`;

function Dashboard() {
  return (
    <>
      <DashboardContainer>
        <HalfWidthContainer>
          <UserGrowthChart />
        </HalfWidthContainer>
        <HalfWidthContainer>
          <EngagementMetrics />
        </HalfWidthContainer>
      </DashboardContainer>
      <TopUserTable />
      <AirdropAnalytics />
    </>
  );
}

export default Dashboard;
