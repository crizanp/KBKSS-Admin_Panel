import axios from 'axios';

// Use the environment variable to get the API base URL
const apiUrl = process.env.REACT_APP_API_URL;

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for CORS with credentials
    });

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};
