// src/components/AirdropRow.js
import React from "react";
import styled from "styled-components";
import AirdropActions from "./AirdropActions";

const Tr = styled.tr`
  &:hover {
    background-color: #ecf0f1;
  }
`;

const Td = styled.td`
  padding: 15px;
  vertical-align: middle;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Description = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
function formatDate(dateString) {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, dateOptions);
}

function AirdropRow({ airdrop }) {
  return (
    <Tr>
      <Td>
        <Logo src={airdrop.logo} alt={`${airdrop.name} logo`} />
      </Td>
      <Td>{airdrop.name}</Td>
      <Td>
        <Description>{airdrop.description}</Description>
      </Td>
      <Td>
        <a href={airdrop.airdropLink} target="_blank" rel="noopener noreferrer">
          {airdrop.airdropLink}
        </a>
      </Td>
      <Td>{airdrop.reward}</Td>
      <Td>{airdrop.participants}</Td>
      <Td>{airdrop.winners}</Td>
      <Td>{formatDate(airdrop.startDate)}</Td>
      <Td>{formatDate(airdrop.endDate)}</Td>
      <Td>{airdrop.status}</Td>
      <Td>
        <AirdropActions airdropId={airdrop._id} />
      </Td>
    </Tr>
  );
}


export default AirdropRow;
