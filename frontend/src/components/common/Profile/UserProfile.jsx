import { VITE_BASE_URL } from '@/constants';
import { Header } from '@common'
import { Avatar, Box, Breadcrumbs, Button, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Link from '@mui/material/Link';

const UserProfile = () => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const isadmin = localStorage.getItem("Admin")

    const { userId } = useParams()

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${VITE_BASE_URL}/auth/userinfo/${userId}`);
            setUser(response.data);
            setLoading(true)
            // console.log(user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    console.log(isadmin);

    if (!loading) {
        return <div>loading...</div>
    } else {


        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Box><Header></Header></Box>
                <Breadcrumbs aria-label="breadcrumb" sx={{ position: 'absolute', top: '110px', left: '100px' }}>
                    <Link sx={{ fontSize: "16px" }} underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Typography sx={{ fontSize: "16px" }} color="text.primary">Profile</Typography>
                </Breadcrumbs>
                <Box sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                    <Box sx={{ display: 'flex', height: isadmin ? '55vh' : '65vh', flexDirection: 'column', padding: '60px', borderRadius: '20px', alignItems: 'center', gap: '40px', paddingTop: '30px', border: 'rgba(0, 0, 0, 0.2) 1px solid' }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                alt=""
                                src=""
                                sx={{ width: 80, height: 80, backgroundColor: 'whitesmoke', color: 'black' }}
                            />

                            <Box
                                component="label"
                                htmlFor="file-input"
                                style={{
                                    position: 'absolute',
                                    width: '25px',
                                    height: '25px',
                                    borderRadius: '50%',
                                    bottom: -10,
                                    right: 26,
                                    border: '1px solid rgb(175, 175, 175)',
                                    cursor: 'pointer',
                                }}
                                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                />
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.625 3.9375H12.6759L11.7176 2.50031C11.6662 2.42336 11.5967 2.36025 11.5151 2.31659C11.4336 2.27293 11.3425 2.25006 11.25 2.25H6.75C6.65749 2.25006 6.56642 2.27293 6.48486 2.31659C6.4033 2.36025 6.33377 2.42336 6.28242 2.50031L5.32336 3.9375H3.375C2.92745 3.9375 2.49822 4.11529 2.18176 4.43176C1.86529 4.74822 1.6875 5.17745 1.6875 5.625V13.5C1.6875 13.9476 1.86529 14.3768 2.18176 14.6932C2.49822 15.0097 2.92745 15.1875 3.375 15.1875H14.625C15.0726 15.1875 15.5018 15.0097 15.8182 14.6932C16.1347 14.3768 16.3125 13.9476 16.3125 13.5V5.625C16.3125 5.17745 16.1347 4.74822 15.8182 4.43176C15.5018 4.11529 15.0726 3.9375 14.625 3.9375ZM11.5312 9.28125C11.5312 9.78188 11.3828 10.2713 11.1047 10.6875C10.8265 11.1038 10.4312 11.4282 9.96867 11.6198C9.50614 11.8114 8.99719 11.8615 8.50618 11.7639C8.01516 11.6662 7.56414 11.4251 7.21014 11.0711C6.85613 10.7171 6.61506 10.2661 6.51739 9.77507C6.41972 9.28406 6.46985 8.77511 6.66143 8.31258C6.85301 7.85006 7.17745 7.45473 7.59371 7.17659C8.00997 6.89846 8.49937 6.75 9 6.75C9.67133 6.75 10.3152 7.01668 10.7899 7.49139C11.2646 7.96609 11.5312 8.60992 11.5312 9.28125Z" fill="black" />
                                </svg>
                            </Box>

                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>First Name</Typography>
                                <TextField value={user?.firstname} size="small" id="outlined-basic" variant="outlined" sx={{ width: '550px' }} />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Second Name</Typography>
                                <TextField value={user?.lastname} size="small" id="outlined-basic" variant="outlined" sx={{ width: '550px' }} />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Email</Typography>
                                <TextField value={user?.email} type='email' size="small" id="outlined-basic" variant="outlined" sx={{ width: '550px' }} />
                            </Box>
                        </Box>

                        {
                            !isadmin &&

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Box>
                                    <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>Your Subscription is {user.subscription.status}</Typography>
                                    <Typography sx={{ fontWeight: '400', fontSize: '12px', color: 'rgba(255, 99, 99, 1)' }}>
                                        {/* {
                                        user.subscription.remainingDays >= 1 ? user.subscription.remainingDays + " Days Remaining" : 'Subscription Expired'
                                    } */}
                                        {
                                            user.subscription.remainingDays >= 1 ?
                                                user?.subscription.remainingDays + " Remaining" : 'Subscription Expired'
                                        }
                                    </Typography>
                                </Box>
                                <Box>
                                    <Button onClick={() => navigate('/upgradeplan')} variant='contained' sx={{ fontSize: '15px', fontWeight: '400' }}>Upgrade</Button>
                                </Box>
                            </Box>
                        }

                        {
                            isadmin &&
                            <Button
                                onClick={() => { navigate('/adminpanel') }}
                                variant='contained'>
                                Go back to AdminPanel
                            </Button>
                        }
                    </Box>

                </Box>
            </Box >
        )
    }
}

export default UserProfile