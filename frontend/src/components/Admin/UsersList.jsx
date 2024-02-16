import { VITE_BASE_URL } from '@/constants';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Avatar, Stack, Typography, Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const tableCellStyle = {
    border: 'none',
    fontSize: '14px'
};

const UsersList = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const handleStatusChange = (event, userId) => {
        const updatedUsers = users.map((user) => {
            if (user._id === userId) {
                return { ...user, status: event.target.value };
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${VITE_BASE_URL}/admin/list-users`);
            const usersWithDaysLeft = response.data.users.map(user => ({
                ...user,
                daysLeft: calculateDaysLeft(user.subscription.expirationDate)
            }));
            const filteredUsers = usersWithDaysLeft.filter(user => !user.isadmin);
            setUsers(filteredUsers);
            setLoading(true)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const calculateDaysLeft = (expirationDateString) => {
        const expirationDate = new Date(expirationDateString);
        const currentDate = new Date();
        const timeDifference = expirationDate - currentDate;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysLeft;
    };

    const updateUserStatus = async (userId, newStatus) => {
        try {
            setUsers(prevUsers => {
                return prevUsers.map(user => {
                    if (user._id === userId) {
                        return { ...user, status: newStatus };
                    }
                    return user;
                });
            });

            const response = await axios.post(`${VITE_BASE_URL}/admin/update-user-status`, {
                userId,
                newStatus,
            });

            if (response.status === 200) {
                // console.log('User status updated successfully!');
            } else {
                console.error('Failed to update user status:', response.data.error);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    useEffect(() => {
        fetchUserData()
    }, [])


    if (!loading) {
        return <div>loading...</div>
    } else {
        return (
            <TableContainer component={Paper} >
                <Table aria-label="simple table" >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ tableCellStyle, color: '#00000086' }}>Sl No</TableCell>
                            <TableCell sx={{ tableCellStyle, color: '#00000086' }}>Name</TableCell>
                            <TableCell sx={{ tableCellStyle, color: '#00000086' }}>Email</TableCell>
                            <TableCell sx={{ tableCellStyle, color: '#00000086' }}>Plan</TableCell>
                            <TableCell sx={{ tableCellStyle, color: '#00000086' }}>Validity</TableCell>
                            <TableCell sx={{ tableCellStyle, color: '#00000086' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map((user, key) => (
                            <TableRow
                                key={key}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 'rgba(0, 0, 0, 0.10) 1px solid', }}
                            >
                                <TableCell sx={tableCellStyle}>{key + 1}</TableCell>
                                <TableCell sx={tableCellStyle}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <Avatar alt="" src="" />
                                        <Typography sx={{ fontWeight: '600', fontSize: '14px' }}>{user?.firstname}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={tableCellStyle}>{user?.email}</TableCell>
                                <TableCell sx={tableCellStyle}>{user.subscription.type}</TableCell>
                                <TableCell sx={tableCellStyle}>{user.daysLeft < 1 ? "Expired" : user.daysLeft}</TableCell>
                                <TableCell sx={tableCellStyle}>
                                    <Select
                                        fullWidth
                                        value={user.status}
                                        onChange={(e) => handleStatusChange(e, user._id)}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Suspended">Suspended</MenuItem>
                                        <MenuItem value="Terminated">Terminated</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell sx={{ padding: 0, marginLeft: 'auto' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => updateUserStatus(user._id, user.status)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default UsersList;
