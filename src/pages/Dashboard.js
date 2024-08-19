import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

function Dashboard() {
  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>
      <p>Overview of key metrics and recent activity.</p>
      {/* Add charts, stats, and more */}
    </DashboardContainer>
  );
}

export default Dashboard;
