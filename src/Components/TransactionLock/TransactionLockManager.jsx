// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//     Button,
//     TextField,
//     Box,
//     Typography,
//     DialogActions,
//     DialogContent,
//     Dialog,
//     DialogTitle,
//     Paper
// } from "@mui/material";

// import ApplicationStore from "../../Utility/localStorageUtil";
// import {
//     TransactionModuleLock,
//     TransactionModuleUnlock,
//     TransactionLockSettingsShow,
// } from "../../ApiService/LoginPageService";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";

// const TransactionLockManager = () => {
//     const [toast, setToast] = useState({ open: false, message: "", type: "" });

//     const [rows, setRows] = useState([]);
//     const [selectionModel, setSelectionModel] = useState([]);
//     const [lockDialogOpen, setLockDialogOpen] = useState(false);
//     const [reason, setReason] = useState("");

//     const { userDetails } = ApplicationStore().getStorage("userDetails") || {};

//     /** ---------- LOAD MODULE TABLE FROM BACKEND ---------- **/
//     const loadData = () => {
//         TransactionLockSettingsShow(
//             (res) => {
//                 const data = res.data || [];

//                 const formatted = data.map((item) => ({
//                     id: item.id,
//                     moduleName: item.moduleName,
//                     lockStatus: item.isLocked === 1 ? "locked" : "open",
//                     reason: item.reason || "",
//                     lockedBy: item.lockedBy || "",
//                     lockedAt: item.lockedAt || "",
//                 }));

//                 setRows(formatted);
//                 localStorage.setItem("moduleLocks", JSON.stringify(formatted));
//             },
//             () => alert("Error loading module lock settings")
//         );
//     };

//     useEffect(() => {
//         loadData();
//     }, []);

//     /** ------------- LOCK MODULE ------------- **/
//     // const handleSubmitLock = () => {

//     //     if (!reason.trim()) {
//     //         alert("Reason is required.");
//     //         return;
//     //     }

//     //     const selectedModules = selectionModel.map(
//     //         (id) => rows.find((r) => r.id === id).moduleName
//     //     );

//     //     const payload = {
//     //         moduleNames: selectedModules,
//     //         reason: reason,
//     //     };

//     //     TransactionModuleLock(
//     //         payload,
//     //         () => {
//     //             setReason("");
//     //             setLockDialogOpen(false);
//     //             loadData();
//     //         },
//     //         (err, msg) => alert("Error locking modules: " + msg)
//     //     );
//     // };
//     const handleSubmitLock = () => {
//         if (!reason.trim()) {
//             alert("Reason is required.");
//             return;
//         }

//         const selectedModules = selectionModel.map(
//             (id) => rows.find((r) => r.id === id).moduleName
//         );

//         const payload = {
//             moduleNames: selectedModules,
//             reason: reason,
//         };

//         TransactionModuleLock(
//             payload,
//             () => {
//                 setReason("");
//                 setLockDialogOpen(false);
//                 setSelectionModel([]); // <-- CLEAR SELECTION

//                 setToast({
//                     open: true,
//                     type: "success",
//                     message: "Module(s) locked successfully!",
//                 });

//                 loadData();
//             },
//             (err, msg) => {
//                 setToast({
//                     open: true,
//                     type: "error",
//                     message: "Failed to lock modules!",
//                 });
//             }
//         );
//     };

//     /** ------------- UNLOCK MODULE ------------- **/
//     const handleUnlock = () => {
//         const selectedModules = selectionModel.map(
//             (id) => rows.find((r) => r.id === id).moduleName
//         );

//         const payload = { moduleNames: selectedModules };

//         TransactionModuleUnlock(
//             payload,
//             () => {
//                 setSelectionModel([]); // <-- CLEAR SELECTION

//                 setToast({
//                     open: true,
//                     type: "success",
//                     message: "Module(s) unlocked successfully!",
//                 });

//                 loadData();
//             },
//             (err, msg) => {
//                 setToast({
//                     open: true,
//                     type: "error",
//                     message: "Failed to unlock modules!",
//                 });
//             }
//         );
//     };


//     const columns = [
//         {
//             field: "moduleName",
//             headerName: "Module Name",
//             flex: 1,
//             align: 'center', headerAlign: 'center',
//             headerClassName: 'super-app-theme--header',

//         },

//         {
//             field: "lockStatus",
//             headerName: "Status",
//             flex: 1,
//             align: 'center', headerAlign: 'center',
//             headerClassName: 'super-app-theme--header',

//             renderCell: (params) => (
//                 <span
//                     style={{
//                         padding: "6px 14px",
//                         borderRadius: "20px",
//                         fontSize: "12px",
//                         color: "#fff",
//                         fontWeight: "bold",
//                         background: params.value === "open" ? "#27ae60" : "#d35400",
//                         boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//                     }}
//                 >
//                     {params.value.toUpperCase()}
//                 </span>
//             ),
//         },

//         {
//             field: "reason", headerClassName: 'super-app-theme--header',
//             headerName: "Reason", flex: 1, align: 'center', headerAlign: 'center',
//         },
//         {
//             field: "lockedBy", headerClassName: 'super-app-theme--header',
//             headerName: "Locked By", flex: 1, align: 'center', headerAlign: 'center',
//         },
//         {
//             field: "lockedAt", headerClassName: 'super-app-theme--header',
//             headerName: "Locked At", flex: 1, align: 'center', headerAlign: 'center',
//         },
//     ];

//     return (

//         <Box p={3}>

//             <Typography variant="h5" sx={{ fontWeight: "bold", color: "#00337a" }}>
//                 🔐 Transaction Lock Settings
//             </Typography>

//             {/* ---------- Data Grid ---------- */}
//             <Paper elevation={4} sx={{ borderRadius: "12px", overflow: "hidden", mt: 4 }}>
//                 <DataGrid
//                     rows={rows}
//                     columns={columns}
//                     checkboxSelection
//                     disableRowSelectionOnClick
//                     rowSelectionModel={selectionModel}
//                     onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}

//                     sx={{
//                         height: 500,
//                         // borderRadius: '12px',
//                         '& .super-app-theme--header': {
//                             WebkitTextStrokeWidth: '0.6px',
//                             backgroundColor: '#93bce6',
//                             color: '#1c1919'
//                         },
//                         '& .MuiDataGrid-cell': {
//                             border: '0.5px solid #969696',
//                         },
//                         '& .MuiDataGrid-columnHeader': {
//                             border: '0.5px solid #969696', // Add border to column headers
//                         },
//                     }}
//                     getRowClassName={(params) => {
//                         // Find the index of the row within the rows array
//                         const rowIndex = rows.findIndex(row => row.id === params.row.id);
//                         // Check if the index is valid
//                         if (rowIndex !== -1) {
//                             console.log(' ');
//                             return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                         }
//                         return ''; // Return default class if index is not found
//                     }}
//                 />

//             </Paper>

//             {/* ---------- Action Buttons ---------- */}
//             <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
//                 <Button variant="outlined" size="small" onClick={loadData}>
//                     Refresh
//                 </Button>

//                 <Button
//                     variant="contained"
//                     color="error"
//                     size="small"
//                     disabled={!selectionModel.length}
//                     onClick={() => setLockDialogOpen(true)}
//                 >
//                     Lock Selected
//                 </Button>

//                 <Button
//                     variant="contained"
//                     color="success"
//                     size="small"
//                     disabled={!selectionModel.length}
//                     onClick={handleUnlock}
//                 >
//                     Unlock Selected
//                 </Button>
//             </Box>
//             <Snackbar
//                 open={toast.open}
//                 autoHideDuration={3000}
//                 onClose={() => setToast({ ...toast, open: false })}
//             >
//                 <Alert
//                     severity={toast.type}
//                     sx={{ width: "100%" }}
//                     onClose={() => setToast({ ...toast, open: false })}
//                 >
//                     {toast.message}
//                 </Alert>
//             </Snackbar>

//             {/* ---------- Lock Dialog ---------- */}
//             <Dialog
//                 open={lockDialogOpen}
//                 onClose={() => setLockDialogOpen(false)}
//                 sx={{ "& .MuiDialog-paper": { width: "500px", borderRadius: "12px" } }}
//             >
//                 <DialogTitle sx={{ fontWeight: "bold" }}>🔐 Lock Modules</DialogTitle>

//                 <DialogContent>
//                     <Typography sx={{ mb: 1, fontSize: "14px" }}>
//                         Please enter a reason for locking the selected modules:
//                     </Typography>

//                     <TextField
//                         fullWidth
//                         multiline
//                         rows={3}
//                         variant="outlined"
//                         placeholder="Enter reason…"
//                         value={reason}
//                         onChange={(e) => setReason(e.target.value)}
//                         sx={{
//                             mt: 1,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px",
//                             },
//                         }}
//                     />
//                 </DialogContent>

//                 <DialogActions sx={{ p: 2 }}>
//                     <Button onClick={() => setLockDialogOpen(false)}>Cancel</Button>
//                     <Button variant="contained" color="error" onClick={handleSubmitLock}>
//                         Submit & Lock
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default TransactionLockManager;
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Button,
    TextField,
    Box,
    Typography,
    DialogActions,
    DialogContent,
    Dialog,
    DialogTitle,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";

import ApplicationStore from "../../Utility/localStorageUtil";
import {
    TransactionModuleLock,
    TransactionModuleUnlock,
    TransactionLockSettingsShow,
} from "../../ApiService/LoginPageService";
import { getErpSocket } from "../../Utility/erpSocket";

const TransactionLockManager = () => {

    const [toast, setToast] = useState({ open: false, message: "", type: "" });

    const [rows, setRows] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [lockDialogOpen, setLockDialogOpen] = useState(false);
    const [reason, setReason] = useState("");

    const { userDetails } = ApplicationStore().getStorage("userDetails") || {};

    /* ================= LOAD DATA (INITIAL) ================= */
    const loadData = () => {
        TransactionLockSettingsShow(
            (res) => {
                const formatted = (res.data || []).map((item) => ({
                    id: item.id,
                    moduleName: item.moduleName,
                    lockStatus: item.isLocked === 1 ? "locked" : "open",
                    reason: item.reason || "",
                    lockedBy: item.lockedBy || "",
                    lockedAt: item.lockedAt || "",
                }));
                setRows(formatted);
            },
            () => {
                setToast({
                    open: true,
                    type: "error",
                    message: "Error loading module lock settings",
                });
            }
        );
    };

    /* ================= INITIAL LOAD ================= */
    useEffect(() => {
        loadData();
    }, []);

    /* ================= SOCKET.IO LISTENER ================= */
    useEffect(() => {
        const socket = getErpSocket();

        const onModuleLockUpdate = (data) => {
            if (!data?.moduleNames?.length) return;

            setRows((prevRows) => {
                let changed = false;

                const updated = prevRows.map((row) => {
                    if (!data.moduleNames.includes(row.moduleName)) {
                        return row; // ⛔ no change
                    }

                    const newStatus =
                        data.action === "LOCK" ? "locked" : "open";

                    if (row.lockStatus === newStatus) {
                        return row; // ⛔ already same → no re-render
                    }

                    changed = true;

                    return {
                        ...row,
                        lockStatus: newStatus,
                        reason: newStatus === "locked" ? data.reason : "",
                        lockedBy: newStatus === "locked" ? data.lockedBy : "",
                        lockedAt:
                            newStatus === "locked"
                                ? new Date(data.lockedAt).toLocaleString()
                                : "",
                    };
                });

                return changed ? updated : prevRows;
            });
        };

        socket.on("MODULE_LOCK_UPDATED", onModuleLockUpdate);

        return () => {
            socket.off("MODULE_LOCK_UPDATED", onModuleLockUpdate);
        };
    }, []);


    /* ================= LOCK MODULE ================= */
    const handleSubmitLock = () => {
        if (!reason.trim()) {
            setToast({
                open: true,
                type: "warning",
                message: "Reason is required",
            });
            return;
        }

        const selectedModules = selectionModel
            .map((id) => rows.find((r) => r.id === id)?.moduleName)
            .filter(Boolean);

        TransactionModuleLock(
            { moduleNames: selectedModules, reason },
            () => {
                setReason("");
                setLockDialogOpen(false);
                setSelectionModel([]);

                setToast({
                    open: true,
                    type: "success",
                    message: "Module(s) locked successfully!",
                });
                // ❌ NO loadData() → socket will update
                loadData()

            },
            () => {
                setToast({
                    open: true,
                    type: "error",
                    message: "Failed to lock modules!",
                });
            }
        );
    };

    /* ================= UNLOCK MODULE ================= */
    const handleUnlock = () => {
        const selectedModules = selectionModel
            .map((id) => rows.find((r) => r.id === id)?.moduleName)
            .filter(Boolean);

        TransactionModuleUnlock(
            { moduleNames: selectedModules },
            () => {
                setSelectionModel([]);

                setToast({
                    open: true,
                    type: "success",
                    message: "Module(s) unlocked successfully!",
                });
                loadData()
                // ❌ NO loadData()
            },
            () => {
                setToast({
                    open: true,
                    type: "error",
                    message: "Failed to unlock modules!",
                });
            }
        );
    };

    /* ================= GRID COLUMNS ================= */
    const columns = [
        {
            field: "moduleName",
            headerName: "Module Name",
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "lockStatus",
            headerName: "Status",
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
            renderCell: (params) => (
                <span
                    style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        color: "#fff",
                        fontWeight: "bold",
                        background:
                            params.value === "open" ? "#27ae60" : "#d35400",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                >
                    {params.value.toUpperCase()}
                </span>
            ),
        },
        {
            field: "reason",
            headerName: "Reason",
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "lockedBy",
            headerName: "Locked By",
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "lockedAt",
            headerName: "Locked At",
            flex: 1,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
    ];

    return (
        <Box p={3}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#00337a" }}>
                🔐 Transaction Lock Settings
            </Typography>

            {/* ================= DATA GRID ================= */}
            <Paper elevation={4} sx={{ borderRadius: "12px", overflow: "hidden", mt: 1 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    disableRowSelectionOnClick
                    rowSelectionModel={selectionModel}
                    onRowSelectionModelChange={(newSelection) =>
                        setSelectionModel(newSelection)
                    }
                    sx={{
                        height: 500,
                        "& .super-app-theme--header": {
                            WebkitTextStrokeWidth: "0.6px",
                            backgroundColor: "#93bce6",
                            color: "#1c1919",
                        },
                        "& .MuiDataGrid-cell": {
                            border: "0.5px solid #969696",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            border: "0.5px solid #969696",
                        },
                    }}
                />
            </Paper>

            {/* ================= ACTION BUTTONS ================= */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button variant="outlined" size="small" onClick={loadData}>
                    Refresh
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={!selectionModel.length}
                    onClick={() => setLockDialogOpen(true)}
                >
                    Lock Selected
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={!selectionModel.length}
                    onClick={handleUnlock}
                >
                    Unlock Selected
                </Button>
            </Box>

            {/* ================= TOAST ================= */}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert
                    severity={toast.type}
                    sx={{ width: "100%" }}
                    onClose={() => setToast({ ...toast, open: false })}
                >
                    {toast.message}
                </Alert>
            </Snackbar>

            {/* ================= LOCK DIALOG ================= */}
            <Dialog
                open={lockDialogOpen}
                onClose={() => setLockDialogOpen(false)}
                sx={{ "& .MuiDialog-paper": { width: "500px", borderRadius: "12px" } }}
            >
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    🔐 Lock Modules
                </DialogTitle>

                <DialogContent>
                    <Typography sx={{ mb: 1, fontSize: "14px" }}>
                        Please enter a reason for locking the selected modules:
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Enter reason…"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setLockDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleSubmitLock}
                    >
                        Submit & Lock
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TransactionLockManager;

