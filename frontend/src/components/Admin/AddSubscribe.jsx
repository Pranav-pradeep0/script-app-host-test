import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, MenuItem, Modal, Select, Switch, TextField, Typography } from '@mui/material';
import { Plus, X } from '@phosphor-icons/react';
import axios from 'axios';
import { VITE_BASE_URL } from '@/constants';
import Plans from './Plans';
import Swal from 'sweetalert2';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '550px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px"
};

const AddSubscribe = () => {
    const [open, setOpen] = useState(false);
    const [planDetails, setPlanDetails] = useState({
        planTitle: '',
        type: 'Monthly',
        periodinHoursOrMonths: '',
        price: '',
        description: [''],
        subscribeButtonText: '',
        isRecomended: false
    });

    const [plans, setPlans] = useState([])

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setPlanDetails({
            planTitle: '',
            type: 'Monthly',
            periodinHoursOrMonths: '',
            price: '',
            description: [''],
            subscribeButtonText: '',
            isRecomended: false
        });
    };

    const handleDescriptionChange = (index, value) => {
        if (value.trim() !== '') {
            const newDescriptions = [...planDetails.description];
            newDescriptions[index] = value;
            setPlanDetails({
                ...planDetails,
                description: newDescriptions
            });
        }
    };

    const handleAddDescription = () => {
        if (planDetails.description[planDetails.description.length - 1].trim() !== '') {
            setPlanDetails({
                ...planDetails,
                description: [...planDetails.description, '']
            });
        }
    };


    const handleDescriptionKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAddDescription();
        }
    };

    const handleRemoveDescription = (index) => {
        if (planDetails.description.length > 1) {
            const newDescriptions = [...planDetails.description];
            newDescriptions.splice(index, 1);
            setPlanDetails({
                ...planDetails,
                description: newDescriptions
            });
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setPlanDetails({
            planTitle: '',
            type: 'Monthly',
            periodinHoursOrMonths: '',
            price: '',
            description: [''],
            subscribeButtonText: '',
            isRecommended: false
        });
    };

    const handleCreate = async () => {
        try {
            if (!planDetails.planTitle || !planDetails.price || !planDetails.description.length) {
                console.error("Please fill in all required fields.");
                Swal.fire({
                    icon: 'error',
                    title: 'Please fill in all required fields.',
                    showConfirmButton: false,
                    timer: 1000,
                });
                return;
            }

            const response = await axios.post(`${VITE_BASE_URL}/subscription/addSubscription`, {
                planTitle: planDetails.planTitle,
                type: planDetails.type,
                periodinHoursOrMonths: planDetails.periodinHoursOrMonths,
                price: planDetails.price,
                description: planDetails.description,
                subscribeButtonText: planDetails.subscribeButtonText,
                isRecomended: planDetails.isRecomended
            });

            console.log("API Response:", response.data);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Subscription Added Successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                });

                fetchSubscriptions();
                handleClose();
            } else {
                console.error("Failed to add subscription:", response.data.message);
            }
        } catch (error) {
            console.error("Error adding subscription:", error.message);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${VITE_BASE_URL}/subscription/getSubscriptions`);
            console.log(response.data.plans);
            const plans = response?.data?.plans;
            setPlans(plans);
        } catch (error) {
            console.error('Error fetching subscriptions:', error.response.data.message);
        }
    }

    const handlePlanDelete = async (planId) => {
        try {
            const response = await axios.delete(`${VITE_BASE_URL}/subscription/deleteSubscription/${planId}`)
            console.log(response.data.message);
            await fetchSubscriptions()
        }
        catch (error) {
            console.log("Error Deleting Plan", error.message)
        }
    }

    const handlePlanEdit = async (plan) => {
        try {
            const response = await axios.put(`${VITE_BASE_URL}/subscription/updateSubscription/${plan.planTitle}`, {
                type: plan.type,
                periodinHoursOrMonths: plan.periodinHoursOrMonths,
                price: plan.price,
                description: plan.description,
                subscribeButtonText: plan.subscribeButtonText,
                isRecomended: plan.isRecomended
            })
            console.log(response);
            if (response.status == 200) {
                fetchSubscriptions()
            }
        } catch (error) {
            console.error("Error updating plan", error.message)
        }
    }

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
                    Active Plans
                </Typography>
                <Button variant='contained' onClick={handleOpen}>
                    <Plus style={{ color: 'white', marginRight: '5px' }} /> Add New Plan
                </Button>
            </Box>

            <Box>
                <Plans subscriptionPlans={plans} handlePlanDelete={handlePlanDelete} handlePlanEdit={handlePlanEdit}></Plans>
            </Box>

            <Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ textAlign: 'center', fontSize: '24px', fontWeight: '700' }}>Add New Plan</Typography>
                        <Box sx={{ display: 'grid', gap: '15px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Plan Title</Typography>
                                <TextField
                                    type='text'
                                    size="small"
                                    id="outlined-basic"
                                    variant="outlined"
                                    placeholder='eg: Yearly'
                                    fullWidth
                                    value={planDetails.planTitle}
                                    onChange={(e) => setPlanDetails({ ...planDetails, planTitle: e.target.value })}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Type</Typography>
                                    <Select
                                        fullWidth
                                        value={planDetails.type}
                                        size='small'
                                        onChange={(e) => setPlanDetails({ ...planDetails, type: e.target.value })}
                                    >
                                        <MenuItem value="Yearly">Yearly</MenuItem>
                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                        <MenuItem value="Days">Days</MenuItem>
                                        <MenuItem value="Hourly">Hourly</MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Time Period</Typography>
                                    <TextField
                                        type='text'
                                        size="small"
                                        id="outlined-basic"
                                        variant="outlined"
                                        placeholder='In years/months/hours/days'
                                        fullWidth
                                        value={planDetails.periodinHoursOrMonths}
                                        onChange={(e) => setPlanDetails({ ...planDetails, periodinHoursOrMonths: e.target.value })}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Price in ₹</Typography>
                                    <TextField
                                        type='text'
                                        size="small"
                                        id="outlined-basic"
                                        variant="outlined"
                                        fullWidth
                                        value={planDetails.price}
                                        onChange={(e) => setPlanDetails({ ...planDetails, price: e.target.value })}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Descriptions / Features</Typography>
                                {planDetails.description?.map((description, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: '5px', }}>
                                        <TextField
                                            type='text'
                                            size="small"
                                            id={`description-${index}`}
                                            variant="outlined"
                                            value={description}
                                            onChange={(event) => handleDescriptionChange(index, event.target.value)}
                                            onKeyDown={handleDescriptionKeyDown}
                                            fullWidth
                                        />
                                        <Button variant='outlined' onClick={() => handleRemoveDescription(index)}><X /></Button>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Subscribe Button Text</Typography>
                                    <TextField
                                        type='text'
                                        size="small"
                                        id="outlined-basic"
                                        variant="outlined"
                                        placeholder='eg: Subscribe Now'
                                        fullWidth
                                        value={planDetails.subscribeButtonText}
                                        onChange={(e) => setPlanDetails({ ...planDetails, subscribeButtonText: e.target.value })}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Make Recommended</Typography>
                                    <Switch
                                        checked={planDetails.isRecomended}
                                        onChange={(e) => setPlanDetails({ ...planDetails, isRecomended: e.target.checked })}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: '20px', width: "60%", marginInline: 'auto', marginTop: '20px' }}>
                                <Button fullWidth sx={{ paddingBlock: "10px" }} variant='outlined' onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button fullWidth sx={{ paddingBlock: "10px" }} variant='contained' onClick={handleCreate}>
                                    Create
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>
    )
}

export default AddSubscribe;
