import { Header } from '@common'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import img from '@assets/images/subscriptionExpire.png'

const SubscriptionExpired = () => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: "column" }}>
            <Box><Header></Header></Box>
            <Box sx={{ flexGrow: "1", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box><img src={img} alt="" /></Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <Typography sx={{ fontSize: '28px', fontWeight: '600' }}>
                        Your Subscription Ended
                    </Typography>
                    <Typography sx={{ fontSize: '18px', fontWeight: '400' }}>
                        Please purchase any subscription plan to countinue
                    </Typography>
                    <Button sx={{ fontWeight: '400', fontSize: '14px' }} variant='contained'>Purchase Now</Button>
                </Box>
            </Box>
        </Box>

    )
}

export default SubscriptionExpired