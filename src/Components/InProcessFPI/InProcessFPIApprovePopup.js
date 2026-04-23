// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
// import React, { useEffect, useState } from 'react'
// import { ProcessInspecSubmit, ProcessInspecUniqueId, ReworkManHourShowData } from '../../ApiService/LoginPageService';
// import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import { DataGrid } from '@mui/x-data-grid';

// const InProcessFPIApprovedPopup = ({ status, setRefreshData, isButtonDisabled, setOpenFPIApprovePopup, OpenFPIApprovePopup, selectedOptionName, jobCardsNo, inspectionList, topData }) => {
//     const [qTestNo, setQTestNo] = useState('');
//     const [serialNo, setSerialNo] = useState('');
//     const [reworkRows, setReworkRows] = useState([]);
//     const [selectionModel, setSelectionModel] = useState([]);
//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });

//     const reworkColumns = [
//         {
//             field: 'user',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     User                </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'hour',
//             headerClassName: 'super-app-theme--header',
//             headerName: (
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Hour
//                 </span>
//             ),
//             type: 'number',      // ✅ change
//             editable: true,      // ✅ add
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         }
//         ,
//         {
//             field: 'rate',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Total Cost
//                 </span>,

//             type: 'number',
//             sortable: true,
//             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
//         },
//     ];
//     useEffect(() => {
//         if (OpenFPIApprovePopup) {
//             ProcessInspecUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
//             ReworkManHourShowData(handleReworkManHourShow, handeReworkManHourException);

//         }

//     }, [OpenFPIApprovePopup]);

//     const handleReworkManHourShow = (dataObject) => {
//         setReworkRows(
//             (dataObject?.data || []).map((row) => ({
//                 id: row.id,
//                 user: row.user,

//                 // 👇 backend gives per-hour cost
//                 ratePerHour: Number(row.rate),

//                 // 👇 initially hour = 0
//                 hour: 0,

//                 // 👇 calculated field
//                 rate: 0
//             }))
//         );
//     };


//     const handeReworkManHourException = (errorStatus, errorMessage) => {
//         console.log(errorMessage);
//     }
//     const handleProcessInspecUniqueIdSucess = (deataObject) => {
//         setQTestNo(deataObject?.qTestNo || '');
//         setSerialNo(deataObject?.snNo || '');
//     }

//     const handleProcessInspecUniqueIdException = () => {

//     }

//     const handleClose = () => {
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };

//     const selectedRework = reworkRows.filter((row) =>
//         selectionModel.includes(row.id)
//     );

//     const handleRowUpdate = (newRow) => {
//         const updatedRow = {
//             ...newRow,
//             rate: Number(newRow.hour || 0) * Number(newRow.ratePerHour || 0)
//         };

//         setReworkRows((prev) =>
//             prev.map((row) => (row.id === newRow.id ? updatedRow : row))
//         );

//         return updatedRow;
//     };



//     const handleSubmit = (e) => {
//         if (status === "rework" && selectedRework.length === 0) {
//             setNotification({
//                 status: true,
//                 type: 'error',
//                 message: 'Please enter hours and select at least one row'
//             });
//             return;
//         }

//         e.preventDefault();
//         const { jCId, jcNo, itemId, machId, operationId, Qty, customer, date, shift2 } = topData || {};
//         console.log('Submit clicked with:', { jCId, itemId, machId, operationId, Qty, customer, date, shift2 });
//         const updatedInspectionList = inspectionList.map((item) => ({
//             ...item,
//             jCId,
//             machId,
//             Qty,
//             itemId,
//             operationId,
//             customer,
//             date,
//             shift2,
//         }));
//         ProcessInspecSubmit({
//             qlty: updatedInspectionList,
//             qTestNo: qTestNo,
//             serialNo: serialNo,
//             type: selectedOptionName,
//             result: '',
//             status: 'approved',
//             reason: "",
//             reworkRates: status === "rework" ? selectedRework : [], // ⭐ IMPORTANT
//             remarks: '',
//             jCId,
//             jcNo,
//             machId,
//             Qty,
//             itemId,
//             customer,
//             operationId,
//             date,
//             shift2,
//         }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException);
//     }

//     const handleProcessInspecSubmitSuccess = (dataObject) => {
//         console.log('Success Callback:', dataObject);
//         setRefreshData(oldvalue => !oldvalue)
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });
//         setTimeout(() => {
//             setOpenFPIApprovePopup(false);
//             setQTestNo('');
//             setSerialNo('');
//         }, 3000);
//     };

//     const handleProcessInspecSubmitException = (errorObject, message) => {
//         console.log(message);
//         setNotification({
//             status: true,
//             type: 'error',
//             message: message,
//         });
//     }


//     return (
//         <Dialog
//             sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
//             maxWidth="lg"
//             open={OpenFPIApprovePopup}>
//             <DialogTitle style={{ background: '#002D68', color: 'white' }}>
//                 Approved
//             </DialogTitle>
//             <DialogContent style={{ paddingTop: '20px' }}>
//                 <form className="space-y-6" onSubmit={handleSubmit}>
//                     <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                             <TextField
//                                 label="Q -Test No"
//                                 variant="outlined"
//                                 fullWidth
//                                 required
//                                 value={qTestNo}
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 label="Jobcard No"
//                                 variant="outlined"
//                                 fullWidth
//                                 required
//                                 value={jobCardsNo}
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 label="Serial No"
//                                 variant="outlined"
//                                 fullWidth
//                                 required
//                                 value={serialNo}
//                             />
//                         </Grid>
//                     </Grid>
//                     {status === "rework" && (
//                         <div style={{ height: 300, marginTop: 20 }}>
//                             <DataGrid
//                                 rows={reworkRows}
//                                 columns={reworkColumns}
//                                 checkboxSelection
//                                 disableRowSelectionOnClick
//                                 selectionModel={selectionModel}
//                                 // onRowSelectionModelChange={(ids) =>
//                                 //     setSelectionModel(ids)
//                                 // }
//                                 onRowSelectionModelChange={(ids) => {
//                                     const validIds = ids.filter((id) => {
//                                         const row = reworkRows.find(r => r.id === id);
//                                         return row && row.hour > 0;   // ✅ only allow if hour > 0
//                                     });

//                                     setSelectionModel(validIds);
//                                 }}

//                                 experimentalFeatures={{ newEditingApi: true }}   // ✅ ADD THIS

//                                 processRowUpdate={handleRowUpdate}
//                                 sx={{
//                                     // overflow: 'auto',
//                                     // height: '70vh',
//                                     // // minHeight: '500px',
//                                     // width: '100%',
//                                     '& .super-app-theme--header': {
//                                         WebkitTextStrokeWidth: '0.6px',

//                                     },
//                                     '& .MuiDataGrid-cell': {
//                                         border: '1px solid #969696',
//                                     },
//                                     '& .MuiDataGrid-columnHeader': {
//                                         border: '1px solid #969696', // Add border to column headers
//                                     },
//                                 }}
//                             />
//                         </div>
//                     )}
//                     <DialogActions>
//                         <Button
//                             variant="contained"
//                             style={{
//                                 width: '150px',

//                                 background: isButtonDisabled === true ? "gray" : '#002D68', color: 'white'
//                             }}
//                             type='submit'
//                             disabled={
//                                 isButtonDisabled ||
//                                 (status === "rework" &&
//                                     selectedRework.some(row => row.hour <= 0))
//                             }

//                         >
//                             submit
//                         </Button>
//                         <Button
//                             variant="contained"
//                             style={{ width: '150px', background: '#002D68', color: 'white' }}
//                             onClick={() => {
//                                 setOpenFPIApprovePopup(false);
//                                 setQTestNo('');
//                                 setSerialNo('');

//                             }}>
//                             Cancel
//                         </Button>
//                     </DialogActions>
//                 </form>
//             </DialogContent>
//             <NotificationBar
//                 handleClose={handleClose}
//                 notificationContent={openNotification.message}
//                 openNotification={openNotification.status}
//                 type={openNotification.type}
//             />
//         </Dialog>

//     )
// }

// export default InProcessFPIApprovedPopup;
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ProcessInspecSubmit,
    ProcessInspecUniqueId,
    ReworkManHourShowData
} from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';

/* =======================
   GRID COLUMNS (OPTIMISED)
======================= */
const reworkColumns = [
    {
        field: 'user',
        headerClassName: 'super-app-theme--header',
        headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>User</span>,
        type: 'string',
        minWidth: 80,
        flex: 1,
        align: 'center',
        headerAlign: 'center'
    },
    {
        field: 'hour',
        headerClassName: 'super-app-theme--header',
        headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Hour</span>,
        type: 'number',
        editable: true,
        minWidth: 100,
        flex: 1,
        align: 'center',
        headerAlign: 'center'
    },
    {
        field: 'rate',
        headerClassName: 'super-app-theme--header',
        headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Cost</span>,
        type: 'number',
        minWidth: 100,
        flex: 1,
        align: 'center',
        headerAlign: 'center'
    }
];

const InProcessFPIApprovedPopup = ({
    status,
    setRefreshData,
    isButtonDisabled,
    setOpenFPIApprovePopup,
    OpenFPIApprovePopup,
    selectedOptionName,
    jobCardsNo,
    inspectionList,
    topData
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [reworkRows, setReworkRows] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: ''
    });

    /* =======================
       LOAD DATA
    ======================= */
    useEffect(() => {
        if (!OpenFPIApprovePopup) return;

        ProcessInspecUniqueId((data) => {
            setQTestNo(data?.qTestNo || '');
            setSerialNo(data?.snNo || '');
        });

        if (status === 'rework') {
            ReworkManHourShowData(handleReworkManHourShow);
        }
    }, [OpenFPIApprovePopup, status]);

    const handleReworkManHourShow = (dataObject) => {
        setReworkRows(
            (dataObject?.data || []).map((row) => ({
                id: row.id,
                user: row.user,
                ratePerHour: Number(row.rate), // backend rate (per hour)
                hour: 0,
                rate: 0
            }))
        );
    };

    /* =======================
       GRID LOGIC
    ======================= */
    const handleRowUpdate = (newRow) => {
        const updatedRow = {
            ...newRow,
            rate: Number(newRow.hour || 0) * Number(newRow.ratePerHour || 0)
        };

        setReworkRows((prev) =>
            prev.map((row) => (row.id === newRow.id ? updatedRow : row))
        );

        return updatedRow;
    };

    const handleSelectionChange = (ids) => {
        setSelectionModel(ids);
    };


    const selectedRework = useMemo(
        () => reworkRows.filter((row) => selectionModel.includes(row.id)),
        [reworkRows, selectionModel]
    );

    useEffect(() => {
        setSelectionModel((prev) =>
            prev.filter((id) => {
                const row = reworkRows.find((r) => r.id === id);
                return row && row.hour > 0;
            })
        );
    }, [reworkRows]);

    /* =======================
       SUBMIT
    ======================= */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting) return; // 🚫 Prevent double click

        if (status === "rework" && selectionModel.length === 0) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Please enter hours and select at least one row'
            });
            return;
        }
        setIsSubmitting(true); // ✅ Start Loader


        const {
            jCId,
            jcNo,
            itemId,
            machId,
            operationId,
            Qty,
            customer,
            date,
            shift2
        } = topData || {};

        const updatedInspectionList = inspectionList.map((item) => ({
            ...item,
            jCId,
            machId,
            Qty,
            itemId,
            operationId,
            customer,
            date,
            shift2
        }));

        ProcessInspecSubmit(
            {
                qlty: updatedInspectionList,
                qTestNo,
                serialNo,
                type: selectedOptionName,
                status: 'approved',
                reworkRates: status === 'rework' ? selectedRework : [],
                jCId,
                jcNo,
                machId,
                Qty,
                itemId,
                customer,
                operationId,
                date,
                shift2
            },
            (res) => {
                setRefreshData((old) => !old);
                setNotification({
                    status: true,
                    type: 'success',
                    message: res.message
                });
                setTimeout(() => {
                    setOpenFPIApprovePopup(false);
                    setQTestNo('');
                    setSerialNo('');
                }, 1000);
                setIsSubmitting(false); // ✅ Stop Loader

            },
            (_, message) => {
                setNotification({
                    status: true,
                    type: 'error',
                    message
                });
                setIsSubmitting(false); // ✅ Stop Loader on error

            }
        );
    };

    /* =======================
       UI
    ======================= */
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={OpenFPIApprovePopup}
        >
            <DialogTitle sx={{ background: '#002D68', color: 'white' }}>
                Approved
            </DialogTitle>

            <DialogContent style={{ paddingTop: '8px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField label="Q-Test No" fullWidth value={qTestNo} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Jobcard No" fullWidth value={jobCardsNo} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Serial No" fullWidth value={serialNo} />
                        </Grid>
                    </Grid>

                    {status === 'rework' && (
                        <div style={{ height: 300, marginTop: 20 }}>
                            <DataGrid
                                rows={reworkRows}
                                columns={reworkColumns}
                                checkboxSelection
                                disableRowSelectionOnClick
                                selectionModel={selectionModel}
                                onRowSelectionModelChange={handleSelectionChange}
                                experimentalFeatures={{ newEditingApi: true }}
                                processRowUpdate={handleRowUpdate}
                                sx={{
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px'
                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696'
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696'
                                    }
                                }}
                            />
                        </div>
                    )}

                    <DialogActions sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting ||
                                isButtonDisabled ||
                                (status === 'rework' &&
                                    selectedRework.some((row) => row.hour <= 0))
                            }
                            sx={{ width: 150, background: '#002D68' }}
                        >
                            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
                        </Button>

                        <Button
                            variant="contained"
                            sx={{ width: 150, background: '#002D68' }}
                            onClick={() => setOpenFPIApprovePopup(false)}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>

            <NotificationBar
                handleClose={() =>
                    setNotification({ status: false, type: '', message: '' })
                }
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    );
};

export default InProcessFPIApprovedPopup;
