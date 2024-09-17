// src/pages/Settings.js
import React from 'react';
import Logout from '../components/Logout';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  background-color: #f4f4f4; /* Light background for better contrast */
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Settings() {
  return (
    <Container>
      <ButtonWrapper>
        <Logout />
      </ButtonWrapper>
    </Container>
  );
}

export default Settings;
