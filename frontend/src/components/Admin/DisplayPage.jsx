import React from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Header } from '@common';
import UsersList from './UsersList';
import AddSubscribe from './AddSubscribe';
import { Typography } from '@mui/material';

const DisplayPage = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const userStatus = localStorage.getItem('Admin')

    if (userStatus) {
        return (
            <Box>
                <Header></Header>
                <Box sx={{ width: '90%', typography: 'body1', marginInline: "auto", marginTop: '30px' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab sx={{ fontSize: "18px" }} label="Users List" value="1" />
                                <Tab sx={{ fontSize: "18px" }} label="Subscription Plans" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ width: '90%', marginInline: 'auto', marginTop: '30px' }}><UsersList></UsersList></TabPanel>
                        <TabPanel value="2" sx={{ width: '90%', marginInline: 'auto', marginTop: '30px' }}><AddSubscribe></AddSubscribe></TabPanel>
                    </TabContext>
                </Box>
            </Box>
        )
    }
    else {
        return (
            <Box>
                <Box sx={{ minHeight: '100vh', minWidth: '100vw', display: 'grid', placeItems: 'center' }}>
                    <Typography sx={{ fontSize: '30px', fontWeight: '700', textTransform: 'uppercase' }}>
                        Unauthorised
                    </Typography>
                </Box>
            </Box>
        )
    }
}

export default DisplayPage