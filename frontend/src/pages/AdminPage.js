import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commonStyles, animations } from '../styles/commonStyles';
import axiosInstance from '../utils/axios';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    Grid,
    Rating,
    Divider,
    Card,
    CardContent,
    CardActions
} from '@mui/material';

const AdminPage = () => {
    const navigate = useNavigate();
    const { authToken, logout } = useAuth();
    const [disputes, setDisputes] = useState([]);
    const [closureRequests, setClosureRequests] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [authToken, navigate]);

    const fetchData = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${authToken}` }
            };

            const [disputesRes, closureRes, feedbackRes] = await Promise.all([
                axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/disputes/all`, config),
                axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/closure/all`, config),
                axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/feedback/all`, config)
            ]);

            setDisputes(disputesRes.data);
            setClosureRequests(closureRes.data);
            setFeedbacks(feedbackRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleDisputeStatus = async (disputeId, newStatus) => {
        try {
            const response = await axiosInstance.patch(
                `${process.env.REACT_APP_API_URL}/api/disputes/${disputeId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            if (response.data) {
                await fetchData();
            }
        } catch (err) {
            console.error('Error updating dispute:', err.response?.data || err.message);
        }
    };

    const handleClosureRequest = async (username, isApproved) => {
        try {
            console.log('Processing closure request:', { username, isApproved });
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_API_URL} / api / closure / process`,
                { username, isApproved },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            if (response.data) {
                console.log('Closure request processed successfully:', response.data);
                // Update the local state immediately
                setClosureRequests(prevRequests =>
                    prevRequests.map(req =>
                        req.userId?.username === username
                            ? { ...req, status: isApproved ? 'approved' : 'rejected' }
                            : req
                    )
                );
                // Then fetch fresh data
                await fetchData();
            }
        } catch (err) {
            console.error('Error processing closure request:', err.response?.data || err.message);
        }
    };

    const handleFeedbackStatus = async (feedbackId, newStatus) => {
        try {
            await axiosInstance.patch(
                `${process.env.REACT_APP_API_URL}/api/feedback/${feedbackId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            fetchData();
        } catch (err) {
            console.error('Error updating feedback status:', err);
        }
    };

    const getStatusChip = (status) => {
        const colors = {
            pending: 'warning',
            'In Progress': 'info',
            Resolved: 'success'
        };

        return (
            <Chip
                label={status}
                color={colors[status] || 'default'}
                size="small"
                sx={{ borderRadius: '20px' }}
            />
        );
    };

    const muiStyles = {
        card: {
            bgcolor: '#1e1e1e',
            color: '#fff',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-5px)'
            }
        },
        button: {
            borderRadius: '20px',
            textTransform: 'none',
            px: 3
        }
    };

    return (
        <div style={commonStyles.pageContainer}>
            <style>{animations}</style>
            <Box sx={{
                minHeight: '100vh',
                pt: 4,
                pb: 8
            }}>
                <Container maxWidth="xl">
                    {/* Header */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 6,
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        <Typography variant="h3" sx={{ color: '#d4af37', fontWeight: 500 }}>
                            Admin Dashboard
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            sx={muiStyles.button}
                        >
                            Logout
                        </Button>
                    </Box>

                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{
                        mb: 6,
                        '& .MuiGrid-item': {
                            animation: 'slideIn 0.5s ease-out'
                        }
                    }}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ ...muiStyles.card, bgcolor: '#1a237e' }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                                        Active Disputes
                                    </Typography>
                                    <Typography variant="h2" sx={{ color: '#d4af37' }}>
                                        {disputes.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ ...muiStyles.card, bgcolor: '#b71c1c' }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                                        Pending Closures
                                    </Typography>
                                    <Typography variant="h2" sx={{ color: '#d4af37' }}>
                                        {closureRequests.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ ...muiStyles.card, bgcolor: '#1b5e20' }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                                        Total Feedback
                                    </Typography>
                                    <Typography variant="h2" sx={{ color: '#d4af37' }}>
                                        {feedbacks.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Disputes Section */}
                    <Paper sx={{
                        ...muiStyles.card,
                        p: 4,
                        mb: 4,
                        animation: 'slideIn 0.5s ease-out'
                    }}>
                        <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 500 }} gutterBottom>
                            Disputes Management
                        </Typography>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />
                        <Grid container spacing={3}>
                            {disputes.map((dispute, index) => (
                                <Grid item xs={12} md={6} key={dispute._id || index} sx={{
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s`
                                }}>
                                    <Card sx={muiStyles.card}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="h6" sx={{ color: '#fff' }}>
                                                    User: {dispute.userId?.username || 'Unknown'}
                                                </Typography>
                                                {getStatusChip(dispute.status)}
                                            </Box>
                                            <Typography sx={{ color: '#fff', opacity: 0.8, mb: 2 }}>
                                                {dispute.description}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#fff', opacity: 0.6 }}>
                                                Created: {new Date(dispute.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end', gap: 1, p: 2 }}>
                                            {dispute.status !== 'Resolved' && (
                                                <>
                                                    {dispute.status === 'pending' && (
                                                        <Button
                                                            variant="outlined"
                                                            color="info"
                                                            onClick={() => handleDisputeStatus(dispute._id, 'In Progress')}
                                                            sx={muiStyles.button}
                                                        >
                                                            Mark In Progress
                                                        </Button>
                                                    )}
                                                    {dispute.status === 'In Progress' && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => handleDisputeStatus(dispute._id, 'Resolved')}
                                                            sx={muiStyles.button}
                                                        >
                                                            Resolve
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    {/* Account Closure Section */}
                    <Paper sx={{
                        ...muiStyles.card,
                        p: 4,
                        mb: 4,
                        animation: 'slideIn 0.5s ease-out'
                    }}>
                        <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 500 }} gutterBottom>
                            Account Closure Requests
                        </Typography>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />
                        <Grid container spacing={3}>
                            {closureRequests.map((request, index) => (
                                <Grid item xs={12} md={6} key={request._id || index} sx={{
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s`
                                }}>
                                    <Card sx={muiStyles.card}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                                                User: {request.userId?.username || 'Unknown'}
                                            </Typography>
                                            <Typography sx={{ color: '#fff', opacity: 0.8, mb: 2 }}>
                                                Reason: {request.reason}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#fff', opacity: 0.6 }}>
                                                Requested: {new Date(request.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end', gap: 1, p: 2 }}>
                                            {request.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleClosureRequest(request.userId?.username, false)}
                                                        sx={muiStyles.button}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() => handleClosureRequest(request.userId?.username, true)}
                                                        sx={muiStyles.button}
                                                    >
                                                        Approve
                                                    </Button>
                                                </>
                                            )}
                                            {request.status !== 'pending' && (
                                                <Chip
                                                    label={request.status}
                                                    color={request.status === 'approved' ? 'success' : 'error'}
                                                    size="small"
                                                    sx={{ borderRadius: '20px' }}
                                                />
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    {/* Feedback Section */}
                    <Paper sx={{
                        ...muiStyles.card,
                        p: 4,
                        animation: 'slideIn 0.5s ease-out'
                    }}>
                        <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 500 }} gutterBottom>
                            Customer Feedback
                        </Typography>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />
                        <Grid container spacing={3}>
                            {feedbacks.map((feedback, index) => (
                                <Grid item xs={12} md={6} key={index} sx={{
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s`
                                }}>
                                    <Card sx={muiStyles.card}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="h6" sx={{ color: '#fff' }}>
                                                    User: {feedback.userId?.username || 'Anonymous'}
                                                </Typography>
                                                {getStatusChip(feedback.status)}
                                            </Box>
                                            <Rating
                                                value={feedback.rating}
                                                readOnly
                                                sx={{ mb: 2 }}
                                            />
                                            <Typography sx={{ color: '#fff', opacity: 0.8, mb: 2 }}>
                                                {feedback.comment}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleFeedbackStatus(feedback._id, 'reviewed')}
                                                disabled={feedback.status !== 'pending'}
                                                sx={muiStyles.button}
                                            >
                                                Mark as Reviewed
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </div>
    );
};

export default AdminPage; 