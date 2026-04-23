import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'

const ViewMoreModel = ({ open, onClose }) => {
    const [dcNo, setDcNo] = useState('');
    const [dcDate, setDcDate] = useState(new Date());
    const [dcDetails, setDcDetails] = useState('');
    const [modeOfDispach, setModeOfDispach] = useState('');
    const [dispatchFrom, setDispatchFrom] = useState('');
    const [dispatchList, setDispatchList] = useState([]);
    const [supplyTypeCode, setSupplyTypeCode] = useState('');
    const [vechicleNo, setVechicleNo] = useState('');
    const [transportDate, setTransportDate] = useState(new Date());
    const [transporterMst, setTransporterMst] = useState('');
    const [transporterList, setTransporterList] = useState([]);
    const [transporterGSTIN, setTransporterGSTIN] = useState('');
    const [distanceKMS, setDistanceKMS] = useState('');
    const [shippingPincode, setShippingPincode] = useState('');
    const [toStatecode, setToStatecode] = useState('');
    const [goodsOrService, setGoodsOrService] = useState('');
    const [labourCharge, setLabourCharge] = useState('');
    const [reverseCharge, setReverseCharge] = useState('');
    const [labourHeadingRequired, setLabourHeadingRequired] = useState('');
    const [totQty, setTotQty] = useState(0);
    const [taxGSTPayable, setTaxGsTPayable] = useState(0);
    const [lessDisc, setLessDisc] = useState(0);
    const [lessOther, setLessOther] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [packFrwrd, setPackFrwrd] = useState(0);
    const [trnsprtcharges, setTrnsprtCharges] = useState(0);
    const [subTotl, setSubTotl] = useState(0);
    const [insurance, setInsurane] = useState(0);
    const [custmrMeterlValue, setCustmrMeterlValue] = useState(0);
    const [ammortisanCost, setAmmortisanCost] = useState(0);
    const [amtGSTPayble, setAmtGSTPayble] = useState(0);
    const [cgst, setCGST] = useState(0);
    const [cgstPercent, setCgstPercent] = useState(0);
    const [sgst, setSGST] = useState(0);
    const [sgstPercent, setSgstPercent] = useState(0);
    const [igst, setIGST] = useState(0);
    const [igstPercent, setIgstPercent] = useState(18);
    const [utgst, setUTGST] = useState(0);
    const [utgstPercent, setUtgstPercent] = useState(18);
    const [totlGST, setTotlGST] = useState(0);
    const [tcs, setTCS] = useState(0);
    const [surChrgesTCS, setSurChrgesTCS] = useState(0);
    const [cessOnTcs, setCessOnTcs] = useState(0);
    const [totlValues, setTotlValues] = useState(0);
    const [roundOff, setRoundOff] = useState(0);
    const [invValue, setInvValue] = useState('');
    const [totalInWords, setTotalInWords] = useState('');
    const [remarks, setRemarks] = useState('');
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    
    const handleClose = () => {
        onClose(false);
    }

    const onModeDispatchChange = (e) => {
        setModeOfDispach(e.target.value);
    };

    const onDispatchFromChange = (e) => {
        setDispatchFrom(e.target.value);
    };

    const onSupplyTypeChange = (e) => {
        setSupplyTypeCode(e.target.value);
    };

    const onTransporterMstChange = (e) => {
        setTransporterMst(e.target.value);
    };

    const onGoordsOrServiceChange = (e) => {
        setGoodsOrService(e.target.value);
    };
    
    const onLabourChange = (e) => {
        setLabourCharge(e.target.value);
    };

    const onLabourHeadingChange = (e) => {
        setLabourHeadingRequired(e.target.value);
    };

    const onReverseChargeChange = (e) => {
        setReverseCharge(e.target.value);
    };
    

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': {  maxHeight: '100%' }}}
            // maxWidth="xl"
            fullScreen
            open={open} >
                <form>
                    <DialogTitle> 

                    </DialogTitle>
                    <DialogContent>
                    <Grid container spacing={2} style={{ marginTop: '5px' }} direction="row" alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px' }}>
                            <Typography style={{ textAlign: 'left' , fontWeight: 'bold'}}>
                                DC Details:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                required
                                label='Dc No'
                                placeholder='Dc No'
                                value={dcNo}
                                onChange={(e) => setDcNo(e.target.value)}
                                size="small"
                                // inputProps={{ style: { padding: '4px', fontSize: '14px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                required
                                label='Dc Details'
                                placeholder='Dc Details'
                                type="date"
                                size="small"
                                onChange={(e) => {setDcDate(e.target.value)}}
                                value={formatDate(dcDate)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Dc Details'
                                placeholder='Dc Details'
                                value={dcDetails}
                                onChange={(e) => setDcDetails(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ marginTop: '5px' }} direction="row" alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px' }}>
                            <Typography style={{ textAlign: 'left' , fontWeight: 'bold'}}>
                                Dispatch Details:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Mode of Dispatch</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={modeOfDispach}
                                    size="small"
                                    label='Mode of Dispatch'
                                    placeholder='Mode of Dispatch'
                                    onChange={(e) => onModeDispatchChange(e)}>
                                    <MenuItem value={'By Road'}>By Road</MenuItem>
                                    <MenuItem value={'By Air'}>By Air</MenuItem>
                                </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Dispatch From</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label='Dispatch From'
                                placeholder='Dispatch From'
                                value={dispatchFrom}
                                size="small"
                                onChange={(e) => onDispatchFromChange(e)}
                                >
                                {dispatchList?.map((data, index) => {
                                    return (
                                    <MenuItem value={data.id} key={index}>
                                        {data.name}
                                    </MenuItem>
                                    );
                                })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Supply Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label='Supply Type'
                                placeholder='Supply Type'
                                size="small"
                                value={supplyTypeCode}
                                onChange={(e) => onSupplyTypeChange(e)}
                                >
                              <MenuItem value={'B2B'}>B2B</MenuItem>
                              <MenuItem value={'B2C'}>B2C</MenuItem>
                              <MenuItem value={'SEZWP'}>SEZWP</MenuItem>
                              <MenuItem value={'SEZWCP'}>SEZWCP</MenuItem>
                              <MenuItem value={'EXPWP'}>EXPWP</MenuItem>
                              <MenuItem value={'EXPECP'}>EXPECP</MenuItem>
                              <MenuItem value={'DEXP'}>DEXP</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Vechile No'
                                placeholder='Vechile No'
                                value={vechicleNo}
                                onChange={(e) => setVechicleNo(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ marginTop: '5px' }} direction="row" alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px' }}>
                            <Typography style={{ textAlign: 'left' , fontWeight: 'bold'}}>
                                Transport Details:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                required
                                label='Transport Date'
                                placeholder='Transport Date'
                                type="date"
                                size="small"
                                onChange={(e) => {setTransportDate(e.target.value)}}
                                value={formatDate(transportDate)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Transporter [Mst]</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                label='Transporter [Mst]'
                                placeholder='Transporter [Mst]'
                                value={transporterMst}
                                onChange={(e) => onTransporterMstChange(e)}
                                >
                                {transporterList?.map((data, index) => {
                                    return (
                                    <MenuItem value={data.id} key={index}>
                                        {data.transportName}
                                    </MenuItem>
                                    );
                                })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Transporter GSTIN'
                                placeholder='Transporter GSTIN'
                                value={transporterGSTIN}
                                onChange={(e) =>
                                setTransporterGSTIN(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Distance KMS'
                                placeholder='Transporter GSTIN'
                                value={distanceKMS}
                                onChange={(e) => setDistanceKMS(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Shipping Pincode'
                                placeholder='Shipping Pincode'
                                value={shippingPincode}
                                onChange={(e) => setShippingPincode(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='To Statecode'
                                placeholder='To Statecode'
                                value={toStatecode}
                                onChange={(e) => setToStatecode(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ marginTop: '5px' }} direction="row" alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px' }}>
                            <Typography style={{ textAlign: 'left' , fontWeight: 'bold'}}>
                                Labour Details:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Goods or Service</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label='Goods or Service'
                                placeholder='Goods or Service'
                                size="small"
                                value={goodsOrService}
                                onChange={(e) => onGoordsOrServiceChange(e)}
                                >
                                <MenuItem value={'G'}>G</MenuItem>
                                <MenuItem value={'S'}>S</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Labour Charge</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label='Labour Charge'
                                placeholder='Labour Charge'
                                size="small"
                                value={labourCharge}
                                onChange={(e) => onLabourChange(e)}
                                >
                                <MenuItem value={'N'}>N</MenuItem>
                                <MenuItem value={'Y'}>Y</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Labour Charges Heading Required</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label='Labour Charges Heading Required'
                                placeholder='Labour Charges Heading Required'
                                size="small"
                                value={labourHeadingRequired}
                                onChange={(e) => onLabourHeadingChange(e)}
                                >
                                <MenuItem value={'N'}>N</MenuItem>
                                <MenuItem value={'Y'}>Y</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Reverse Charge</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label='Reverse Charge'
                                placeholder='Reverse Charge'
                                size="small"
                                value={reverseCharge}
                                onChange={(e) => onReverseChargeChange(e)}
                                >
                                <MenuItem value={'N'}>N</MenuItem>
                                <MenuItem value={'Y'}>Y</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container spacing={1} style={{ marginTop: '5px' }} direction="row" alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px' }}>
                            <Typography style={{ textAlign: 'left' , fontWeight: 'bold'}}>
                                Amount Details:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                label='Total Qty'
                                placeholder='Total Qty'
                                size="small"
                                value={totQty}
                                onChange={(e) => setTotQty(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Taxable Value for GST Payable'
                                placeholder='Taxable Value for GST Payable'
                                value={taxGSTPayable}
                                onChange={(e) => setTaxGsTPayable(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Less Disc'
                                placeholder='Less Disc'
                                value={lessDisc}
                                onChange={(e) => setLessDisc(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Less Other'
                                placeholder='Less Other'
                                value={lessOther}
                                onChange={(e) => setLessOther(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Sub Total After Disc'
                                placeholder='Sub Total After Disc'
                                value={subTotal}
                                onChange={(e) => setSubTotal(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Packing & Forwarding'
                                placeholder='Packing & Forwarding'
                                value={packFrwrd}
                                onChange={(e) => setPackFrwrd(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Transport Charges'
                                placeholder='Transport Charges'
                                value={trnsprtcharges}
                                onChange={(e) => setTrnsprtCharges(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Sub Total'
                                placeholder='Sub Total'
                                value={subTotl}
                                // onChange={(e) => setTrnsprtCharges(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Insurance'
                                placeholder='Insurance'
                                value={insurance}
                                onChange={(e) => setInsurane(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Customer Material Value'
                                placeholder='Customer Material Value'
                                value={custmrMeterlValue}
                                onChange={(e) =>
                                    setCustmrMeterlValue(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Ammortisation Cost'
                                placeholder='Ammortisation Cost'
                                value={ammortisanCost}
                                onChange={(e) => setAmmortisanCost(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Amount for GST Payable'
                                placeholder='Amount for GST Payable'
                                value={amtGSTPayble}
                                onChange={(e) => setAmmortisanCost(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                value={cgstPercent}
                                placeholder="%"
                                onChange={(e) => setCgstPercent(e.target.value)}
                                style={{ marginRight: "5px" }}
                                />
                            <TextField
                                fullWidth
                                size="small"
                                label='CGST'
                                placeholder='CGST'
                                value={igst}
                                onChange={(e) => setCGST(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                value={sgstPercent}
                                placeholder="%"
                                onChange={(e) => setSgstPercent(e.target.value)}
                                style={{ marginRight: "5px" }}
                                />
                            <TextField
                                fullWidth
                                size="small"
                                label='SGST'
                                placeholder='SGST'
                                value={sgst}
                                onChange={(e) => setSGST(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                value={igstPercent}
                                placeholder="%"
                                onChange={(e) => setIgstPercent(e.target.value)}
                                style={{ marginRight: "5px" }}
                                />
                            <TextField
                                fullWidth
                                size="small"
                                label='IGST'
                                placeholder='IGST'
                                value={igst}
                                onChange={(e) => setIGST(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                value={utgstPercent}
                                placeholder="%"
                                onChange={(e) =>
                                    setUtgstPercent(e.target.value)
                                  }
                                style={{ marginRight: "5px" }}
                                />
                            <TextField
                                fullWidth
                                size="small"
                                label='UTGST'
                                placeholder='UTGST'
                                value={utgst}
                                onChange={(e) => setUTGST(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                value={totlGST}
                                onChange={(e) => setTotlGST(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Tcs'
                                placeholder='Tcs'
                                value={tcs}
                                onChange={(e) => setTCS(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Surcharges on TCS'
                                placeholder='Surcharges on TCS'
                                value={surChrgesTCS}
                                onChange={(e) => setSurChrgesTCS(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Cess on TCS'
                                placeholder='Cess on TCS'
                                value={cessOnTcs}
                                onChange={(e) => setCessOnTcs(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Cess on TCS'
                                placeholder='Cess on TCS'
                                value={cessOnTcs}
                                onChange={(e) => setCessOnTcs(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Total Value'
                                placeholder='Total Value'
                                value={totlValues}
                                onChange={(e) => setTotlValues(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Round Off'
                                placeholder='Round Off'
                                value={roundOff}
                                onChange={(e) => setRoundOff(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Inv Value'
                                placeholder='Inv Value'
                                value={invValue}
                                onChange={(e) => setInvValue(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Total In Words'
                                placeholder='Total In Words'
                                value={invValue}
                                onChange={(e) => setTotalInWords(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: '5px' }} direction="row" alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '1px' }}>
                            <Typography style={{ textAlign: 'left' , fontWeight: 'bold'}}>
                                Remarks:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label='Remarks'
                                placeholder='Remarks'
                                multiline
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </Grid>
                       
                        
                    </Grid>
                        
                    </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button
                           
                            // style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit">
                                Add
                            {/* {isAddButton ? 'Add' : 'Update'} */}
                        </Button>
                        <Button
                           
                            // style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}
                            >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        
        </div>
    )
}

export default ViewMoreModel
