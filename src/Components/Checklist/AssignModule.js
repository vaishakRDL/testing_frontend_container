import React, { useEffect, useState, useCallback } from 'react';
import {
    Button, Box, Dialog, DialogContent, DialogTitle, Grid, DialogActions,
    Typography, IconButton, Paper, MenuItem, Select, FormControl, InputLabel, Chip, Divider, alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import BuildIcon from "@mui/icons-material/Build";
import TuneIcon from "@mui/icons-material/Tune";
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AssignChecklist, MachineShowList, ToolListByMachineId } from '../../ApiService/LoginPageService';

/* ─── colour tokens ─────────────────────────────────────────────────────── */
const BRAND = {
    primary: "#0F62FE",
    surface: "#FFFFFF",
    border: "#E2E6EA",
    text: "#1A1A2E",
    muted: "#6B7280",
    accent: "#00C9A7",
};

/* ─── shared select styles ───────────────────────────────────────────────── */
const selectSx = {
    borderRadius: "10px",
    background: "#FFFFFF",

    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#C7CDD4",
        borderWidth: "1.5px",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: BRAND.primary,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: BRAND.primary,
        borderWidth: "2px",
    },

    "& .MuiSelect-select": {
        py: "10px",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: BRAND.text,
    },

    // placeholder text
    "& .MuiSelect-placeholder": {
        color: "#9CA3AF",
    }
};

/* ─── labelled select wrapper ────────────────────────────────────────────── */
function FieldGroup({ icon: Icon, label, value, onChange, options, renderValue, placeholder, multiple }) {
    const hasValue = multiple ? value?.length > 0 : Boolean(value);

    return (
        <Box>
            {/* micro-label row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
                <Icon sx={{ fontSize: 15, color: hasValue ? BRAND.primary : BRAND.muted }} />
                <Typography
                    sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: hasValue ? BRAND.primary : BRAND.muted,
                    }}
                >
                    {label}
                </Typography>
                {hasValue && (
                    <Chip
                        label="Selected"
                        size="small"
                        sx={{
                            height: 16,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            bgcolor: alpha(BRAND.accent, 0.12),
                            color: BRAND.accent,
                            border: `1px solid ${alpha(BRAND.accent, 0.3)}`,
                            ml: "auto",
                            "& .MuiChip-label": { px: 1 },
                        }}
                    />
                )}
            </Box>

            {/* the actual select */}
            <FormControl fullWidth size="small">
                <InputLabel
                    sx={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#6B7280",
                        "&.Mui-focused": {
                            color: BRAND.primary
                        }
                    }}
                >
                    {placeholder}
                </InputLabel>
                <Select
                    multiple={multiple}
                    value={value}
                    label={placeholder}
                    onChange={onChange}
                    renderValue={renderValue}
                    sx={selectSx}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                mt: 0.5,
                                borderRadius: "10px",
                                border: `1px solid ${BRAND.border}`,
                                boxShadow: "0 8px 32px rgba(15,98,254,0.10)",
                                "& .MuiMenuItem-root": {
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    color: BRAND.text,
                                    py: 1,
                                    "&:hover": { bgcolor: alpha(BRAND.primary, 0.07) },
                                    "&.Mui-selected": {
                                        bgcolor: alpha(BRAND.primary, 0.12),
                                        color: BRAND.primary,
                                        fontWeight: 700,
                                    },
                                },
                            },
                        },
                    }}
                >
                    {options}
                </Select>
            </FormControl>
        </Box>
    );
}

const AssignModule = ({
    isAddButton, editData, setRefreshData, setAssignModalOpen, assignModalOpen, selectedRow
}) => {
    const [machineOptions, setMachineOptions] = useState([]);
    const [toolList, setToolList] = useState([]);

    const [Machine, setMachine] = useState('');
    const [Tool, setTool] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        setAssignModalOpen(assignModalOpen);
        if (assignModalOpen) {
            MachineShowList(handleMachineSuccess, handleExceptionList);
        }
    }, [assignModalOpen]);

    const handleMachineSuccess = ({ data }) => {
        setMachineOptions(data || []);
    };

    const handleExceptionList = () => {
        setMachineOptions([]);
    };

    const handleToolSuccess = ({ data }) => {
        setToolList(data || []);
    };

    const handleMachineChange = useCallback(
        (event) => {
            const id = event.target.value;
            setMachine(id);
            setTool("");
            setToolList([]);
            if (id) {
                ToolListByMachineId({ id }, handleToolSuccess, handleExceptionList);
            }
        },
        [setMachine, setTool]
    );

    const handleToolChange = (event) => {
        const toolId = event.target.value;
        setTool(toolId);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // let assignedItemIds = [];
        // if (Tool) assignedItemIds.push(Tool);
        // else if (Machine) assignedItemIds.push(Machine);

        AssignChecklist({
            checklistid: selectedRow?.id || selectedRow?.checklistid,
            toolId: Tool
        }, handleSuccess, handleException)
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    };

    const ClearData = () => {
        setMachine('');
        setTool('');
        setAssignModalOpen(false);
        setRefreshData(oldvalue => !oldvalue);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%', borderRadius: 3, overflow: 'hidden' } }}
            maxWidth="md"
            open={assignModalOpen}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #002D68 30%, #004b93 90%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                    Assign Checklist
                </Typography>
                <IconButton onClick={() => { setAssignModalOpen(false); ClearData() }} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, bgcolor: '#f8fafc' }}>
                <form onSubmit={handleSubmit}>

                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                        {/* ── header ── */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "10px",
                                    bgcolor: "#F3F4F6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <TuneIcon sx={{ fontSize: 20, color: BRAND.primary }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: BRAND.text, lineHeight: 1.2 }}>
                                    Machine &amp; Tool Selection
                                </Typography>
                                <Typography sx={{ fontSize: "0.72rem", color: BRAND.muted, mt: 0.25 }}>
                                    Choose a machine, then optionally select its associated tool
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: BRAND.border, mb: 3 }} />

                        {/* ── selects row ── */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: "12px",
                                        border: `1.5px solid ${Machine ? BRAND.primary : BRAND.border}`,
                                        background: "#fff",
                                        transition: "border-color 0.2s",
                                    }}
                                >
                                    <FieldGroup
                                        icon={PrecisionManufacturingIcon}
                                        label="Machine"
                                        placeholder="Select Machine"
                                        value={Machine}
                                        onChange={handleMachineChange}
                                        options={machineOptions.map((m) => (
                                            <MenuItem key={m.id} value={m.id}>
                                                {m.machineCode}
                                            </MenuItem>
                                        ))}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: "12px",
                                        border: `1.5px solid ${Tool ? BRAND.primary : BRAND.border}`,
                                        background: "#fff",
                                        opacity: Machine ? 1 : 0.55,
                                        transition: "opacity 0.2s, border-color 0.2s",
                                    }}
                                >
                                    <FieldGroup
                                        icon={BuildIcon}
                                        label="Tool"
                                        placeholder="Select Tool"
                                        value={Tool}
                                        onChange={handleToolChange}
                                        options={toolList.map((tool) => (
                                            <MenuItem key={tool.id} value={tool.id}>
                                                {tool.toolNo}
                                            </MenuItem>
                                        ))}
                                    />
                                </Box>
                            </Grid>

                            {/* status summary pill */}
                            {/* {Machine && (
                                <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            p: 2,
                                            borderRadius: "12px",
                                            background: "#F9FAFB",
                                            border: `1.5px solid #E2E6EA`,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: BRAND.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                            Selection Summary
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: BRAND.text }}>
                                            Machine: {machineOptions.find((m) => m.id === Machine)?.machineCode || "Selected"}
                                        </Typography>
                                        {Tool && (
                                            <Typography sx={{ fontSize: "0.78rem", color: BRAND.primary, fontWeight: 600 }}>
                                                Tool: {toolList.find((t) => t.id === Tool)?.toolNo || "Selected"}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            )} */}

                        </Grid>
                    </Paper>

                    <DialogActions sx={{ px: 0, py: 3, pb: 0, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!Machine}
                            sx={{
                                background: '#002D68',
                                color: 'white',
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { background: '#004b93' }
                            }}
                        >
                            Assign
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setAssignModalOpen(false)
                                ClearData();
                            }}
                            sx={{
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: '#002D68',
                                color: '#002D68',
                                '&:hover': { borderColor: '#004b93', bgcolor: 'rgba(0, 45, 104, 0.04)' }
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default AssignModule 