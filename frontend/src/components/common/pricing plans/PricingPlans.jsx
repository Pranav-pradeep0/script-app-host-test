import { useTheme } from '@emotion/react';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CheckCircle from '@assets/images/CheckCircle.svg';
import { Link, useNavigate } from 'react-router-dom';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { VITE_BASE_URL } from '@/constants';
import axios from 'axios';
import Recomended from '@assets/images/Recomended.svg';

const PricingPlans = () => {

    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    const { palette } = useTheme();
    const [subscriptionPlans, SetSubscriptionPlans] = useState([]);
    const navigate = useNavigate();

    const [paymentData, setPaymentData] = useState({
        name: '',
        amount: '',
        MUID: '',
        transactionId: ''
    })

    const handlePayment = async (amount) => {
        try {
            const response = await axios.post(`${VITE_BASE_URL}/scriptview/payment/gateway/payment`, {
                name: userName,
                merchantTransactionId: `T${userId}`,
                merchantUserId: 'MUID' + userId,
                amount
            })
            console.log("payment response", response);
        } catch (error) {
            console.error('An error occurred during payment:', error);
        }
    }

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${VITE_BASE_URL}/subscription/getSubscriptions`);
            console.log(response.data.plans);
            const { plans } = response.data
            SetSubscriptionPlans(plans)
        } catch (error) {
            console.error('Error fetching subscriptions:', error.response.data.message);
        }
    }

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    return (
        <Box
            sx={{
                backgroundColor: palette.primary.main,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={{}}>
                <Box sx={{ marginBottom: '30px' }}>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: '36px',
                            fontWeight: '700',
                        }}
                    >
                        Pricing Plans
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        width: 'min-content',
                        gap: '50px',
                        marginInline: 'auto',
                    }}
                >
                    {subscriptionPlans?.length < 1 ?

                        <Box sx={{ height: '200px', width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontSize: '30px', textAlign: 'center', color: 'white', }}>
                                No Plans Found.
                            </Typography>
                        </Box>

                        :

                        subscriptionPlans?.map((plan, index) => (
                            <Box
                                key={index}
                                sx={{
                                    height: '411px',
                                    width: '250px',
                                    backgroundColor: '#C5AC57',
                                    textAlign: 'center',
                                    marginInline: 'auto',
                                }}
                            >
                                <Typography
                                    sx={{ fontWeight: '600', fontSize: '20px', padding: '5px' }}
                                >
                                    {plan.planTitle}
                                </Typography>
                                <Box
                                    sx={{
                                        backgroundColor: '#434343',
                                        height: '89.8%',
                                        margin: '1px',
                                        color: 'white',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative'
                                    }}
                                >
                                    {
                                        plan.isRecomended &&

                                        <Box
                                            sx={{ width: '100px', position: 'absolute', left: '50%', transform: 'translate(-50%)', marginTop: '10px', paddingBottom: '10px' }}
                                            component="img"
                                            src={Recomended}
                                        />

                                    }
                                    <Box
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.699)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '15px',
                                            width: '95%',
                                            justifyContent: 'space-evenly',
                                            paddingLeft: '20px',
                                            paddingRight: '10px',
                                            paddingTop: plan.isRecomended ? '50px' : '40px',
                                            overflowWrap: 'anywhere'
                                        }}
                                    >
                                        {plan.description.map((feature, featureIndex) => (
                                            <Box
                                                key={featureIndex}
                                                sx={{ display: 'flex', gap: '10px' }}
                                            >
                                                <Box
                                                    sx={{ marginBottom: 'auto' }}
                                                    width="20px"
                                                    component="img"
                                                    src={CheckCircle}
                                                />
                                                <Typography sx={{ textAlign: 'start', color: '', }}>
                                                    {feature}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            alignItems: 'center',
                                            marginTop: 'auto',
                                            paddingBottom: '20px',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-around',
                                                backgroundColor: '#393939',
                                                width: 'max-content',
                                                paddingInline: '20px',
                                                paddingBlock: '5px',
                                                borderRadius: '4px',
                                                color: 'rgba(255, 255, 255, 0.699)',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '26px',
                                                    fontWeight: '700',
                                                    height: '35px',
                                                }}
                                            >
                                                ₹ {plan.price}
                                            </Typography>
                                            <Typography style={{ fontSize: '10px', fontWeight: '300' }}>
                                                {plan.type}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                sx={{
                                                    width: '144px',
                                                    background:
                                                        'linear-gradient(93.69deg, #C5AC57 10.11%, #C5AC57 46.89%, #E1D5AB 85.01%)',
                                                }}
                                                onClick={() => handlePayment(plan.price)}
                                            >
                                                Subscribe Now
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'rgba(255, 255, 255, 0.699)',
                        marginTop: '40px',
                        gap: '40px',
                        fontSize: '20px',
                        fontWeight: '700',
                    }}
                >
                    <Link onClick={() => {
                        navigate('/login')
                    }} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}> <CaretLeft />Back To Login</Link>
                    <Link onClick={
                        () => {
                            navigate('/')
                        }} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>Skip For Now <CaretRight /></Link>
                </Box>
            </Box>
        </Box>
    );
};

export default PricingPlans;
