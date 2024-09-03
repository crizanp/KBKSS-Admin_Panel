import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartContainer = styled.div`
  width: 100%; /* Make this full-width */
`;

function UserGrowthChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'User Growth',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/chartMetric/user-growth`);
        const { dates, userCounts } = response.data;

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'User Growth',
              data: userCounts,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching user growth data:', error);
      }
    };

    fetchUserGrowthData();
  }, []);

  if (!chartData.labels.length) {
    return <div>Loading...</div>;
  }

  return (
    <ChartContainer>
      <h3>User Growth Over Time</h3>
      <Line data={chartData} />
    </ChartContainer>
  );
}

export default UserGrowthChart;
