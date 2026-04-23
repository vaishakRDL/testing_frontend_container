// import React, { useState } from 'react'
// import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';

// const AssemblyModule = ({ open, setOpen,valueSet,setValueSet }) => {

//     const [status,setStatus] = useState('Panding');
//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });

//     const handleSubmit = () => {

//     }

//     const onCloseClicked = () => {
//         setOpen(false);
//     }
//     const handleClose = () => {
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };
//     return (
//         <Dialog
//             sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
//             maxWidth="sm"
//             open={open}
//         >
//             <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 Update

//             </DialogTitle>
//             <form onSubmit={handleSubmit}>
//                 <DialogContent >
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//                             <Typography variant='h6'>
//                                 Status : {status}
//                             </Typography>
//                         </Grid>

//                         <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//                             <TextField
//                                 id="filled-basic"
//                                 variant="filled"
//                                 sx={{ mb: 1 }}
//                                 fullWidth
//                                 value={valueSet}
//                                 required
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                         </Grid>

//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         variant="contained"
//                         style={{ width: '250px', background: '#002D68', color: 'white' }}
//                     >
//                         <Typography variant='h5'>
//                             +
//                         </Typography>
//                     </Button>
//                     <Button
//                         variant="contained"
//                         style={{ width: '250px', background: '#002D68', color: 'white' }}
//                     >
//                         <Typography variant='h5'>
//                             -
//                         </Typography>
//                     </Button>
//                     <Button
//                         variant="contained"
//                         style={{ width: '250px', background: '#002D68', color: 'white' }}
//                     >

//                         ok
//                     </Button>
//                     <Button
//                         variant="contained"
//                         style={{ width: '150px', background: '#002D68', color: 'white' }}
//                         onClick={onCloseClicked}
//                     >
//                         Cancel
//                     </Button>
//                 </DialogActions>
//                 <NotificationBar
//                     handleClose={handleClose}
//                     notificationContent={openNotification.message}
//                     openNotification={openNotification.status}
//                     type={openNotification.type}
//                 />

//             </form>
//         </Dialog>
//     )
// }

// export default AssemblyModule
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { UpdateAssemblyPlanning } from '../../ApiService/LoginPageService';

const AssemblyModule = ({ open, setOpen, valueSet, setValueSet, selectedDate, selectedContractNumber, selectedItemCode, selectedFIM, stop, duty, type, selectedCycleTime, updatedValue, handleSubmitPress, originalNumber }) => {
    const [inValue, setInValue] = useState(0);

    const [status, setStatus] = useState('Panding');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (open === true && updatedValue) {
            setInValue(Number(updatedValue))
        }
        // updatedValue && setInValue(Number(updatedValue))
    }, [updatedValue, open])

    const handleSubmit = () => {

    }

    const onCloseClicked = () => {
        setOpen(false);
        setInValue(0);
    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const increaseValue = () => {
        if (valueSet > inValue) {
            setInValue(inValue + 1);
        }
    }

    const DcreaseValue = () => {
        if (valueSet >= inValue && 0 < inValue) {
            setInValue(inValue - 1);
        }
    }

    const handleUpdateAssembly = () => {
        UpdateAssemblyPlanning({
            KanbanDate: selectedDate,
            ContractNo: selectedContractNumber,
            PartNo: selectedItemCode,
            FIMCode: selectedFIM,
            Stop: stop,
            Duty: duty,
            Type: type,
            cycleTime: selectedCycleTime,
            Qty: inValue
        }, handleAssemblyPlanningSuccess, handleAssemblyPlanningException)
    }

    const handleAssemblyPlanningSuccess = (dataObject) => {
        setOpen(false)
        handleSubmitPress()
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleAssemblyPlanningException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage?.message,
        });
        setTimeout(() => {
        }, 2000);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Update

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant='h6'>
                                {/* Status : {status} */}
                                Status : {Number(updatedValue) === Number(originalNumber) ? 'Completed' : 'Pending'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                sx={{ mb: 1 }}
                                fullWidth
                                value={inValue}
                                required
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setInValue(e.target.value)}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '250px', background: '#002D68', color: 'white' }}
                        onClick={increaseValue}
                    >
                        {/* <Typography variant='h5'> */}
                        +
                        {/* </Typography> */}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '250px', background: '#002D68', color: 'white' }}
                        onClick={DcreaseValue}
                    >
                        {/* <Typography variant='h5'> */}
                        -
                        {/* </Typography> */}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '250px', background: '#002D68', color: 'white' }}
                        onClick={handleUpdateAssembly}
                    >

                        ok
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={onCloseClicked}
                    >
                        Cancel
                    </Button>
                </DialogActions>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

            </form>
        </Dialog>
    )
}

export default AssemblyModule