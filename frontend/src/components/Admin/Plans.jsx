import { Box, Button, IconButton, MenuItem, Modal, Select, Switch, TextField, Typography } from '@mui/material'
import CheckCircle from '@assets/images/CheckCircle.svg';
import Recomended from '@assets/images/Recomended.svg';
import React, { useEffect, useState } from 'react'
import { Trash, X } from '@phosphor-icons/react';
import { Edit } from '@mui/icons-material';

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

const Plans = ({ subscriptionPlans, handlePlanDelete, handlePlanEdit }) => {

    const [plans, setPlans] = useState([]);

    const [open, setOpen] = useState(false);

    const [updatedPlan, setUpdatedPlan] = useState({
        planTitle: '',
        type: 'Monthly',
        periodinHoursOrMonths: '',
        price: '',
        description: [''],
        subscribeButtonText: '',
        isRecomended: false
    })

    useEffect(() => {
        setPlans(subscriptionPlans);
    }, [subscriptionPlans]);

    const handleDeleteAndUpdate = (planId) => {
        handlePlanDelete(planId);
        const updatedPlans = plans.filter(plan => plan._id !== planId);
        setPlans(updatedPlans);
    };

    const handleOpen = (plan) => {
        setOpen(true)
        setUpdatedPlan({
            planTitle: plan.planTitle,
            type: plan.type,
            periodinHoursOrMonths: plan.periodinHoursOrMonths,
            price: plan.price,
            description: plan.description,
            subscribeButtonText: plan.subscribeButtonText,
            isRecomended: plan.isRecomended
        })
    };

    const handleDescriptionChange = (index, value) => {
        if (value.trim() !== '') {
            const newDescriptions = [...updatedPlan.description];
            newDescriptions[index] = value;
            setUpdatedPlan({
                ...updatedPlan,
                description: newDescriptions
            });
        }
    };

    const handleAddDescription = () => {
        if (updatedPlan.description[updatedPlan.description.length - 1].trim() !== '') {
            setUpdatedPlan({
                ...updatedPlan,
                description: [...updatedPlan.description, '']
            });
        }
    };

    const handleDescriptionKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAddDescription();
        }
    };

    const handleRemoveDescription = (index) => {
        if (updatedPlan.description.length > 1) {
            const newDescriptions = [...updatedPlan.description];
            newDescriptions.splice(index, 1);
            setUpdatedPlan({
                ...updatedPlan,
                description: newDescriptions
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setUpdatedPlan({
            planTitle: '',
            type: 'Monthly',
            periodinHoursOrMonths: '',
            price: '',
            description: [''],
            subscribeButtonText: '',
            isRecomended: false
        })
    };

    return (
        <Box sx={{ marginTop: '50px' }}>
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
                {
                    plans?.length < 1 ?

                        <Box sx={{ height: '200px', width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontSize: '18px', textAlign: 'center', color: 'black', }}>
                                No Plans Found.
                            </Typography>
                        </Box>

                        :

                        plans?.map((plan, index) => (
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
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton onClick={() => handleOpen(plan)} sx={{ position: 'absolute', zIndex: 1, left: 5, top: 0, bottom: 0, }}>
                                        <Edit />
                                    </IconButton>
                                    <Typography
                                        sx={{ fontWeight: '600', fontSize: '20px', padding: '5px', }}
                                    >
                                        {plan.planTitle}
                                    </Typography>
                                    <IconButton onClick={() => handleDeleteAndUpdate(plan._id)} sx={{ position: 'absolute', zIndex: 1, right: 5, top: 0, bottom: 0, }}>
                                        <Trash />
                                    </IconButton>
                                </Box>
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
                                                {plan.type == "Monthly" && "Per Month"}
                                                {plan.type == "Yearly" && "Per Year"}
                                                {plan.type == "Days" && "Per Day"}
                                                {plan.type == "Hourly" && "Per Hour"}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                sx={{
                                                    width: '144px',
                                                    background:
                                                        'linear-gradient(93.69deg, #C5AC57 10.11%, #C5AC57 46.89%, #E1D5AB 85.01%)',
                                                }}
                                                onClick={() => handlePlanSelect(plan)}
                                            >
                                                Subscribe Now
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
            </Box>

            <Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ textAlign: 'center', fontSize: '24px', fontWeight: '700' }}>Edit Plan</Typography>
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
                                    value={updatedPlan.planTitle}
                                    onChange={(e) => setUpdatedPlan({ ...updatedPlan, planTitle: e.target.value })}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Type</Typography>
                                    <Select
                                        fullWidth
                                        value={updatedPlan.type}
                                        size='small'
                                        onChange={(e) => setUpdatedPlan({ ...updatedPlan, type: e.target.value })}
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
                                        value={updatedPlan.periodinHoursOrMonths}
                                        onChange={(e) => setUpdatedPlan({ ...updatedPlan, periodinHoursOrMonths: e.target.value })}
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
                                        value={updatedPlan.price}
                                        onChange={(e) => setUpdatedPlan({ ...updatedPlan, price: e.target.value })}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Descriptions / Features</Typography>
                                {updatedPlan.description?.map((description, index) => (
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
                                        value={updatedPlan.subscribeButtonText}
                                        onChange={(e) => setUpdatedPlan({ ...updatedPlan, subscribeButtonText: e.target.value })}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: '300', fontSize: '14px', paddingLeft: '3px' }}>Make Recommended</Typography>
                                    <Switch
                                        checked={updatedPlan.isRecomended}
                                        onChange={(e) => setUpdatedPlan({ ...updatedPlan, isRecomended: e.target.checked })}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: '20px', width: "60%", marginInline: 'auto', marginTop: '20px' }}>
                                <Button fullWidth sx={{ paddingBlock: "10px" }} variant='outlined' onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button fullWidth sx={{ paddingBlock: "10px" }} variant='contained' onClick={() => {
                                    handlePlanEdit(updatedPlan)
                                    handleClose()
                                }}>
                                    Save Changes
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>
    )
}

export default Plans