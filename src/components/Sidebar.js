import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaHome, FaCoins, FaTasks, FaUsers, FaCog, FaQuestion, FaGift, FaExchangeAlt, FaImage } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? '200px' : '60px')};
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOpen ? 'flex-start' : 'center')};
  transition: width 0.3s ease, padding 0.3s ease;
  padding: ${(props) => (props.isOpen ? '20px 10px' : '15px 5px')};
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 100;

  @media (max-width: 768px) {
    width: ${(props) => (props.isOpen ? '150px' : '0')};
    overflow: hidden;
  }
`;

const SidebarToggle = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isOpen ? 'flex-end' : 'center')};
  cursor: pointer;
  font-size: 22px;
  margin-bottom: 20px;
  color: white;

  &:hover {
    color: #3498db;
  }
`;

const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${(props) => (props.isOpen ? '10px 15px' : '10px 5px')};
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: ${(props) => (props.isOpen ? '16px' : '20px')};
  border-radius: 5px;
  transition: background 0.3s, padding 0.3s, font-size 0.3s;
  width: 100%;
  box-sizing: border-box;

  &.active {
    background-color: #2980b9;
  }

  &:hover {
    background-color: #34495e;
  }

  svg {
    margin-right: ${(props) => (props.isOpen ? '10px' : '0')};
    font-size: ${(props) => (props.isOpen ? '18px' : '22px')};
  }

  span {
    display: ${(props) => (props.isOpen ? 'inline' : 'none')};
    font-size: ${(props) => (props.isOpen ? '14px' : '0')};
  }
`;

const Logo = styled.div`
  font-size: ${(props) => (props.isOpen ? '20px' : '24px')};
  text-align: center;
  margin-bottom: 30px;
  color: #ecf0f1;

  @media (max-width: 768px) {
    font-size: ${(props) => (props.isOpen ? '18px' : '20px')};
  }
`;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { to: '/', icon: FaHome, label: 'Dashboard' },
    { to: '/airdrops', icon: FaGift, label: 'Airdrops' },
    { to: '/users', icon: FaUsers, label: 'Users' },
    { to: '/igh-airdrop', icon: FaExchangeAlt, label: 'IGH Airdrop' },
    { to: '/background', icon: FaImage, label: 'Background Image' }, // New icon for background
    { to: '/referrals', icon: FaCoins, label: 'Referrals' },
    { to: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarToggle isOpen={isOpen} onClick={toggleSidebar} aria-expanded={isOpen ? 'true' : 'false'}>
        <FaBars />
      </SidebarToggle>
      <Logo isOpen={isOpen}>{isOpen ? "🌟 Admin" : "🌟"}</Logo>

      {menuItems.map((item, index) => (
        <SidebarItem key={index} to={item.to} exact isOpen={isOpen}>
          <item.icon /> <span>{item.label}</span>
        </SidebarItem>
      ))}
    </SidebarContainer>
  );
}

export default Sidebar;
