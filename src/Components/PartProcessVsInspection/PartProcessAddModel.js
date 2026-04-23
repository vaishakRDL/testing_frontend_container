import { Button, Dialog, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Addinspection, QualityInsMstShowData, Qualityuom } from '../../ApiService/LoginPageService';

const PartProcessAddModel = ({ isModalOpen, setIsModalOpen, isAddButton, setRefreshData, setNotification, proceesId, tempId }) => {
    const [qualityParameter, setQualityParameter] = useState('');
    const [expectedValue, setExpectedValue] = useState('');
    const [minTolerance, setMinTolerance] = useState('');
    const [maxTolerance, setMaxTolerance] = useState('');
    const [uom, setUom] = useState('');
    const [uomList, setUomList] = useState([]);
    const [expectedVInsp, setExpectedVInspection] = useState('');
    const [expectedMethodList, setExpectedVInspectionList] = useState([]);
    const [evaluationMethod, setEvaluationMethod] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        Qualityuom(handleUomServicesSuccess, handleUomServicesExceptoin);
        QualityInsMstShowData(handleQualityInsMstShow, handeQualityInsMstException);
    }, []);

    const handleQualityInsMstShow = (dataObject) => {
        setExpectedVInspectionList(dataObject?.data || []);
    };

    const handeQualityInsMstException = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    };


    const handleUomServicesSuccess = (dataObject) => {
        setUomList(dataObject?.data || []);
    };

    const handleUomServicesExceptoin = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    };


    const onUOMChange = (e) => {
        setUom(e.target.value);
    }

    const onEvaluationChange = (e) => {
        setEvaluationMethod(e.target.value);
    }

    const handleButtonClick = () => {

    }

    const onSubmit = (e) => {
        setLoading(true)
        e.preventDefault();
        isAddButton === true ?
            (
                Addinspection({
                    tempId: tempId,
                    processId: proceesId,
                    qltyParam: qualityParameter,
                    uomId: uom,
                    inspectionId: evaluationMethod,
                    expVal: expectedValue,
                    maxTolerance: maxTolerance,
                    minTolerance: minTolerance,
                    expVisInspec: expectedVInsp,
                    evalMethod: evaluationMethod,
                }, handleSuccess, handleException)
            ) : (
                <>

                    {/* QualityInsMstUpdate({
                    id: editQuality.id,
                    inspectionType: quality,
                    description: description,
                }, handleUpdateSuccess, handleException) */}
                </>
            );
    }

    const handleSuccess = (dataObject) => {
        setLoading(false)
        // console.log(dataObject);
        // setNotification({
        //     status: true,
        //     type: 'success',
        //     message: dataObject.message,
        // });
        // setTimeout(() => {
        //     // ClearData();
        //     handleClose();
        //     setRefreshData(oldValue => !oldValue);
        // }, 2000);
    }

    const handleException = (errorObject, errorMessage) => {
        setLoading(false)
        console.log(errorMessage);
        // setNotification({
        //     status: true,
        //     type: 'error',
        //     message: errorMessage,
        // });
        // setTimeout(() => {
        //     // ClearData();
        //     handleClose();
        //     setRefreshData(oldValue => !oldValue);
        // }, 2000);
    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '45%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={isModalOpen}  // Change prop name to "open"
            >
                <form onSubmit={onSubmit}>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isAddButton ? 'Part Process Vs Inspection' : 'Part Process Vs Inspection '}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    label="Quality Parameter"
                                    placeholder='Quality Parameter'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setQualityParameter(e.target.value) }}
                                    value={qualityParameter}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    label="Expected Value"
                                    placeholder='Expected Value'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setExpectedValue(e.target.value) }}
                                    value={expectedValue}

                                />
                            </Grid>
                            {/* <Grid item  xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    label="Expected Value"
                                    placeholder='Expected Value'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setExpectedValue(e.target.value) }}
                                    value={expectedValue}
                                    
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    label="Min Tolerance"
                                    placeholder='Min Tolerance'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setMinTolerance(e.target.value) }}
                                    value={minTolerance}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    label="Max Tolerance"
                                    placeholder='Max Tolerance'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setMaxTolerance(e.target.value) }}
                                    value={maxTolerance}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">UOM</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="UOM"
                                        placeholder='UOM'
                                        value={uom}
                                        onChange={(e) => onUOMChange(e)}>
                                        {
                                            uomList?.map((data, index) => {
                                                return (
                                                    <MenuItem value={data.id} key={index}>{data.name}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    label="Expected Visual Inspection"
                                    placeholder='Expected Visual Inspection'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setExpectedVInspection(e.target.value) }}
                                    value={expectedVInsp}

                                />

                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Evaluation Method</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Evaluation Method"
                                        placeholder="Evaluation Method"
                                        value={evaluationMethod}
                                        onChange={(e) => onEvaluationChange(e)}>
                                        {
                                            expectedMethodList?.map((data, index) => {
                                                return (
                                                    <MenuItem value={data.id} key={index}>{data.inspectionType}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                {/* <TextField
                                    fullWidth
                                    label="Evaluation Method"
                                    placeholder='Evaluation Method'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setEvaluationMethod(e.target.value) }}
                                    value={evaluationMethod}
                                /> */}
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            disabled={loading}
                            type="submit">
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                isAddButton ? "Add" : "Update"

                            )}
                        </Button>
                        <Button variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}>
                            Cancel
                        </Button>
                    </DialogActions>

                </form>
            </Dialog>

        </div>
    )
}

export default PartProcessAddModel
