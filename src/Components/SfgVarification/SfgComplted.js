import { Card, CardContent, Box, Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { CompletedGetGeneratedSFG, CompletedReverseVreified, GetDelNoteForwardReverse, GetGeneratedSFG } from '../../ApiService/LoginPageService';

const SfgComplted = () => {
    const [selectedSFGNo, setSelectedSFGNo] = useState('');
    const [generatedJwLists, setGeneratedJWLists] = useState([]);

    const [invoiceDate, setinvoiceDate] = useState(new Date());
    const [customerPoNo, setCustomerPoNo] = useState("");
    const [autogen, setAutoGen] = useState("");
    const [vehicalNo, setVehicalNo] = useState("");
    const [dispatchaddedBy, dispatchAddedBy] = useState("");
    const [invoiveNo, setInvoiceNo] = useState("");
    const [mainId, setMainId] = useState("");
    const [selectedItems, setSelectedItems] = useState([{ id: "RDL1" }]);
    console.log("1111111111selectedItems", selectedItems);

    useEffect(() => {
        handleForwardReverse("last", "");
    },
        []);


    const handleForwardReverse = (type, id) => {
        CompletedGetGeneratedSFG(
            { type: type, id: id },
            handleActionSuccess,
            handleActionException
        );
    };

    const handleActionSuccess = (dataObject) => {
        // setIsPoView(true);
        const data = dataObject.sfgDetails;
        setAutoGen(data?.digit || "");
        setCustomerPoNo(data?.custPoNo || "");
        dispatchAddedBy(data?.addedBy || "");
        setinvoiceDate(data?.sfgDate || "");
        setSelectedItems(dataObject?.sfgItems || []);
        setInvoiceNo(data?.sfgNo || "");
        setVehicalNo(data?.verifiedBy || "");
        setMainId(data?.id || "");

    };
    const handleActionException = () => { };


    const handleSFGChange = (e) => {
        GetGeneratedSFG({ code: e.target.value }, handleGeneratedSFGSucessShow, handleGeneratedSFGExceptionShow);
    }

    const handleGeneratedSFGSucessShow = (dataObject) => {
        setGeneratedJWLists(dataObject?.data || []);
    }
    const handleGeneratedSFGExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedSFGSelect = (selectedValue) => {
        if (selectedValue !== null) {
            setSelectedSFGNo(selectedValue?.sfgNo);
            CompletedGetGeneratedSFG({ type: 'view', id: selectedValue.id }, handleActionSuccess, handleActionException)
        }
    }
    return (
        <div style={{ width: '100%', padding: 8 }}>

            <form /*onSubmit={handleSubmit}*/>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="SFG No"
                                    readOnly={true}
                                    disabled={true}
                                    value={invoiveNo}

                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    // disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>


                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="SFG Date"
                                    readOnly={true}
                                    disabled={true}

                                    value={invoiceDate}

                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    label="Created By"                                    // disabled={true}
                                    readOnly={true}
                                    required
                                    value={dispatchaddedBy}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={true}

                                />
                            </Grid> */}

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Sfg Verified By"
                                    value={vehicalNo}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={true}

                                // disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                />
                            </Grid>



                            {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="PoNo"
                                    value={customerPoNo}
                                    readOnly={true}
                                    disabled={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid> */}

                        </Grid>

                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={5} xl={5} style={{ fontSize: '75%', display: 'flex', justifyContent: 'flex-end' }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={generatedJwLists}
                            fullWidth
                            value={selectedSFGNo}
                            getOptionLabel={(option) => option.sfgNo || selectedSFGNo}
                            renderInput={(params) => <TextField {...params} label="Search SFG No" onChange={handleSFGChange} />}
                            onChange={(event, value) => handleGeneratedSFGSelect(value)}
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px', zIndex: 10000, width: '70%', }}
                        />
                    </Grid>





                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid #000000' }}>
                            <CardContent>
                                {/* {uploadLoader && */}
                                <Box sx={{ width: '100%', marginBottom: '15px' }}>
                                    {/* <LinearProgress /> */}
                                </Box>
                                {/* } */}
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>

                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px' }}>


                                        {/* {isView || isEdit ? <Button variant="contained" style={{ height: '35px', backgroundColor: '#002D68', marginRight: '10px' }} onClick={handlePrintClick}>Print</Button> : null} */}
                                        {/* /////////////////////////// */}
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>

                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('first', '')}
                                            >
                                                <FastRewindIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('reverse', mainId)}
                                            >
                                                <SkipPreviousIcon />
                                            </Button>

                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('forward', mainId)}
                                            >
                                                <SkipNextIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse("last", "")}
                                            >
                                                <FastForwardIcon />
                                            </Button>
                                        </div>
                                        {/* ////////////////////////////// */}
                                    </div>


                                </div>



                                <div style={{ overflowX: 'scroll' }}>
                                    <table id="customers">
                                        <tr>
                                            <th style={{ whiteSpace: 'nowrap' }}>S.No
                                            </th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Item Code </th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>SFG Qty</th>

                                        </tr>
                                        {selectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.sNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemCode}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemName}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.uom}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.sfgQty}</td>
                                                {/* <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.stop}</td> */}
                                            </tr>
                                        ))}
                                    </table>
                                </div>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid >

            </form>

            {/* MODALS */}

        </div>
    )
}

export default SfgComplted