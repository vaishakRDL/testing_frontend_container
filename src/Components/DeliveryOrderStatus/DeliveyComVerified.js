import { Card, CardContent, Box, Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { CompletedReverseVreified } from '../../ApiService/LoginPageService';

const DeliveyComVerified = () => {
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
        CompletedReverseVreified(
            { type: type, id: id },
            handleActionSuccess,
            handleActionException
        );
    };

    const handleActionSuccess = (dataObject) => {
        // setIsPoView(true);
        const data = dataObject.delDetails;
        setAutoGen(data?.digit || "");
        setCustomerPoNo(data?.custPoNo || "");
        dispatchAddedBy(data?.addedBy || "");
        setinvoiceDate(data?.invDate || "");
        setSelectedItems(dataObject?.delItems || []);
        setInvoiceNo(data?.invNo || "");
        setVehicalNo(data?.vechileNO || "");
        setMainId(data?.id || "");

    };
    const handleActionException = () => { };
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>

                {/* <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Verified
                </Typography> */}
            </div>
            <form /*onSubmit={handleSubmit}*/>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Invoive No"
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
                                    label="Invoive Date"
                                    readOnly={true}
                                    disabled={true}

                                    value={invoiceDate}

                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Vehicle No"
                                    value={vehicalNo}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={true}

                                // disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                />
                            </Grid>



                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
                            </Grid>

                        </Grid>
                    </Grid>

                    {/* <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid> */}



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
                                            <th style={{ whiteSpace: 'nowrap' }}>Contract No / Part No
                                            </th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Del_Note.Ref.No                                            </th>
                                            <th style={{ whiteSpace: 'nowrap' }}>FIM No
                                            </th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Type</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Duty</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Stop</th>

                                        </tr>
                                        {selectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.contractNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.delNoteNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.fimNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.type}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.duty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.stop}</td>
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

export default DeliveyComVerified