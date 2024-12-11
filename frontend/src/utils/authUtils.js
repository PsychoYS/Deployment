import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const refreshToken = async () => {
    const navigate = useNavigate();  // Ensure useNavigate is inside the component or context

    try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) throw new Error('No refresh token available');

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, { refreshToken: storedRefreshToken });
        const { accessToken } = response.data;

        localStorage.setItem('token', accessToken); // Save new access token
        return accessToken;
    } catch (err) {
        console.error('Error refreshing token:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return null;
    }
};
