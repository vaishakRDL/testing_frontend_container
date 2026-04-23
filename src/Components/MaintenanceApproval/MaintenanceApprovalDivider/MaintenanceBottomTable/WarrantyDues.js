import React, { useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';

const rows = [
    { id: 1, Department: "Planning and Scheduling", Machine: 'Punching Machine', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 2, Department: "Planning and Scheduling", Machine: 'Punching Machine', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 3, Department: "Planning and Scheduling", Machine: 'Punching Machine', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 4, Department: "Planning and Scheduling", Machine: 'Punching Machine', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 5, Department: "Punching", Machine: 'Shearing Machine', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 6, Department: "Punching", Machine: 'Shearing Machine', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 7, Department: "Punching", Machine: 'RG35', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 8, Department: "Welding", Machine: 'RG80', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
    { id: 9, Department: "Welding", Machine: 'RG100', WarrantystartDate: '2022-02-20', WarrantyendDate: '2022-02-26', runHours: '5', Action: 'Renewal' },
];

const WarrantyDues = () => {
    const [selectedDateFrom, setSelectedDateFrom] = useState(null);
    const [selectedDateTo, setSelectedDateTo] = useState(null);

    const handleDateFromChange = (e) => {
        setSelectedDateFrom(e.target.value);
    };
    const handleDateToChange = (e) => {
        setSelectedDateTo(e.target.value);
    };

    return (
        <>
            <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3} lg={2} container justifyContent="center" alignItems={'center'}>
                        <Typography variant="subtitle1">Date From</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2} container justifyContent="center" alignItems={'center'}>
                        <TextField
                            type='date'
                            id="per-day-input-from"
                            variant="outlined"
                            fullWidth
                            value={selectedDateFrom}
                            onChange={handleDateFromChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2} container justifyContent="center" alignItems={'center'}>
                        <Typography variant="subtitle1">Date To</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2} container justifyContent="center" alignItems={'center'}>
                        <TextField
                            type='date'
                            id="per-day-input-to"
                            variant="outlined"
                            fullWidth
                            value={selectedDateTo}
                            onChange={handleDateToChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2} container justifyContent="center" alignItems={'center'}>
                        <Button variant="contained">View</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2} container justifyContent="center" alignItems={'center'}>
                        <Button variant="contained">View Due</Button>
                    </Grid>
                </Grid>
            </Container>
            <div className='view_container'>
                <div className='view_subcontainer'>
                    <span className='view_headerText'>View Warranty Dues</span>
                </div>
                <div className='view_tableContainer'>
                    <table id="customers">
                        <tr>
                            <th>Department</th>
                            <th>Machine</th>
                            <th>Warranty start date</th>
                            <th>Warranty end date</th>
                            <th>Run Hours</th>
                            <th>Action</th>
                        </tr>
                        {rows.map((item) =>
                            <tr>
                                <td>{item.Department}</td>
                                <td>{item.Machine}</td>
                                <td>{item.WarrantystartDate}</td>
                                <td>{item.WarrantyendDate}</td>
                                <td>{item.runHours}</td>
                                <td>{item.Action}</td>
                            </tr>)}
                    </table>
                </div>
            </div >
        </>
    )
}
export default WarrantyDues;
