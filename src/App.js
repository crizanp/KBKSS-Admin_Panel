// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import Sidebar from './components/Sidebar';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: ${(props) => (props.isOpen ? '250px' : '80px')};
  padding: 20px;
  width: ${(props) => (props.isOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)')};
  transition: margin-left 0.3s, width 0.3s;

  @media (max-width: 768px) {
    margin-left: ${(props) => (props.isOpen ? '200px' : '50px')};
    width: ${(props) => (props.isOpen ? 'calc(100% - 200px)' : 'calc(100% - 50px)')};
  }
`;

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <Layout>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <Content isOpen={isSidebarOpen}>
          <AppRoutes />
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
