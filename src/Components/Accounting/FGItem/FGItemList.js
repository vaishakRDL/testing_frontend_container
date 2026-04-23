import { Autocomplete, Button, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { CustDcFgPartNoSelect, CustFgDcLists, CustFgPartNoSelectDc, FgItemSave, ListAllFgItems, PoFgPartNoDcShow, PoNoSelectPurchase } from '../../../ApiService/LoginPageService';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Link } from 'react-router-dom';
import { useModuleLocks } from '../../context/ModuleLockContext';

const FGItemList = () => {
    const [variant, setVariant] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [custDcPoNo, setCustDcPoNo] = useState([]);
    const [custDcId, setCustDcID] = useState('');
    const [custDcLabel, setCustDcLabel] = useState('');
    const [rows, setRows] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [poNumberLists, setPoNumberLists] = useState([]);
    const [selectedPoNo, setSelectedPoNo] = useState('');
    const [custPartNoList, setCustPartNoList] = useState([]);
    const [custPartNo, setCustPartNo] = useState('');
    const [poItemId, setPoItemId] = useState('');
    const [custPartNoLabel, setCustPartNoLabel] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Map Customer PO DC")?.lockStatus === "locked";


    const optionsPartNoList = custPartNoList.map(item => ({
        value: item?.id,
        label: item?.label,
        poItmId: item?.poItmId
    }));

    // PO NUMBER CHANGE
    const handleChangePO = (e) => {
        PoNoSelectPurchase({ code: e.target.value }, handlePoNumberSuccess, handlePoNumberException);
    }
    const handlePoNumberSuccess = (dataObject) => {
        setPoNumberLists(dataObject?.data || []);
    }
    const handlePoNumberException = (error, errorMessage) => {
        console.log(errorMessage);
    }
    const onPoNumberSelect = (selectedValue, event) => {
        setSelectedPoNo(selectedValue?.id || '');
    }

    // PART NUMBER CHANGE
    const handleChangePartNumber = (e) => {
        CustFgPartNoSelectDc({ code: e.target.value, id: selectedPoNo }, handlePartNumberSuccess, handlePartNumberException);
    }
    const handlePartNumberSuccess = (dataObject) => {
        setCustPartNoList(dataObject?.data || [])
    }
    const handlePartNumberException = (error, errorMessage) => {
        console.log(errorMessage);
    }
    function onPartNoSelectChange(selectedValue, event) {
        setCustPartNo(selectedValue?.id || '');
        setCustPartNoLabel(selectedValue?.label || '');
        setPoItemId(selectedValue?.poItmId || '')
    }

    const onVariantChange = (e) => {
        setVariant(e.target.value);
    }

    const handleEdit = (cellNam, newValue, id, rowData) => {
        let updatedItems;

        switch (cellNam) {
            case "QtyRequest":
                updatedItems = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'QtyRequest'
                        ? { ...supp, QtyRequest: Number(newValue), maxProdQty: rowData.dcQty / Number(newValue) }
                        : supp
                );
                break;

        }
        setSelectedItems(updatedItems);
    };

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);

    }

    function onCustDcPartNoSelectChange(selectedValue, event) {
        setCustDcID(selectedValue?.id);
        setCustDcLabel(selectedValue?.label);
        // PoFgPartNoDcShow({
        //     id: selectedValue?.label
        // }, handleDataShowSuccess, handleDataException);
        const clonedSelectedItems = [...selectedItems];
        const lastObj = clonedSelectedItems.pop();
        clonedSelectedItems.push(selectedValue, lastObj);
        setSelectedItems(clonedSelectedItems);
    }

    const handleDataShowSuccess = (dataObject) => {
        const clonedSelectedItems = [...selectedItems];
        const lastObj = clonedSelectedItems.pop();
        clonedSelectedItems.push(...dataObject.data, lastObj);
        setSelectedItems(clonedSelectedItems);
    }

    const handleDataException = (error, errorMessage) => {
        console.log(errorMessage);
    }

    const handleCustDcPoChange = (e) => {
        CustDcFgPartNoSelect({
            code: e.target.value/*, id: selectedPoNo*/
        }, handlePartNoShowSuccess, handlePartNoSelectException);
    }
    const handlePartNoShowSuccess = (dataObject) => {
        setCustDcPoNo(dataObject.data || []);

    }

    const handlePartNoSelectException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage
        });
        setTimeout(() => {

        }, 2000);
        setRows([]);
    }

    const onSubmitData = (e) => {
        e.preventDefault();
        setLoading(true);
        const updatedArray = selectedItems.map(obj => (
            {
                // ...obj,
                // fgitemCode: custPartNoLabel,
                poId: selectedPoNo,
                poItmId: poItemId,
                fgitemCode: custPartNoLabel,
                dcItemId: obj.id,
                dcItemCode: obj.itemCode,
                uom: obj.uom,
                qty: obj.maxProdQty,
                dcQty: obj.dcQty,
                qtyPerPart: obj.QtyRequest
            }
        ))
        // const updatedSelectedArray = updatedArray.slice(0, -1);
        FgItemSave(updatedArray, handleSucess, handleException);
    }

    const ClearData = () => {

    }

    const handleSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setLoading(false);
        }, 2000);
    }

    const handleException = (errorObject, errorMessage) => {
        console.log(errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleListAllClick = () => {
        ListAllFgItems({ id: selectedPoNo }, handleListAllSuccess, handleListAllException)
    }
    const handleListAllSuccess = (dataObject) => {
        // const clonedSelectedItems = [...selectedItems];
        // const lastObj = clonedSelectedItems.pop();
        // clonedSelectedItems.push(...dataObject?.data, lastObj);
        // setSelectedItems(clonedSelectedItems);

        setSelectedItems(
            dataObject.data.map(item => ({
                ...item,
                QtyRequest: "",
                maxProdQty: ""
            }))
        );

    }
    const handleListAllException = () => { }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Link to='/FGItemViewResult' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`Back>>`}
                    </Typography>
                </Link>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Map Customer DC & PO
                </Typography>
            </div>
            <form className="mt-2 space-y-6" onSubmit={onSubmitData}>
                <Grid container padding={2}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    // value={selectedCustomerName} 
                                    options={poNumberLists}
                                    getOptionLabel={(option) => option.poNo}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            variant="filled"
                                            label="Search PO No"
                                            onChange={handleChangePO}
                                        />}
                                    onChange={(event, value) => onPoNumberSelect(value, event)}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    // value={selectedCustomerName} 
                                    options={optionsPartNoList}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            variant="filled"
                                            label="Search Part No"
                                            onChange={handleChangePartNumber}
                                        />}
                                    onChange={(event, value) => onPartNoSelectChange(value, event)}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                                {/* <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size="small"
                                    options={optionsPartNoList}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Search Part No " onChange={handleChangePO} />}
                                    onChange={(event, value) => onPartNoSelectChange(value, event)}
                                /> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <Button
                                                variant="contained"
                                                style={{ height: '30px', backgroundColor: '#002d68' }}
                                                onClick={handleListAllClick}
                                            >
                                                List All
                                            </Button>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                style={{ height: '30px', backgroundColor: isModuleLocked ? "gray" : '#002d68' }}
                                                disabled={loading === true || isModuleLocked}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                                ) : 'SAVE'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th>Customer DC Part No</th>
                                            <th>Part Name</th>
                                            <th>UOM</th>
                                            <th>DC QTY</th>
                                            <th>Total SO Qty Part</th>
                                            <th>Per Part Qty</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td contentEditable={true} >
                                                    {item.itemCode ? (
                                                        <span>{item.itemCode}</span>
                                                    ) : (
                                                        <Autocomplete
                                                            fullWidth
                                                            disablePortal
                                                            id={`combo-box-${index}`}
                                                            size="small"
                                                            // disabled={isPOView ? true : false}
                                                            options={custDcPoNo}
                                                            getOptionLabel={(option) => option.label}
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Search Part No" onChange={handleCustDcPoChange} />
                                                            )}
                                                            onChange={(event, value) => onCustDcPartNoSelectChange(value, event)}
                                                        />
                                                    )}
                                                </td>
                                                <td contentEditable={true}>{item.itemName}</td>
                                                <td contentEditable={true}>{item.uom}</td>
                                                <td >{item.dcQty}</td>
                                                <td contentEditable={true} onBlur={(e) => handleEdit('QtyRequest', e.target.textContent, item.id, item)}>{item.QtyRequest}</td>
                                                <td contentEditable={true} >{item.maxProdQty}</td>
                                                <td contentEditable={true} style={{ textAlign: 'center' }}>
                                                    {item.id === 'RDL1' ?
                                                        null
                                                        :
                                                        <DeleteIcon
                                                            onClick={() => {
                                                                handleDeleteRow(item.id)
                                                            }}
                                                            style={{ color: 'black', cursor: 'pointer' }}
                                                        />
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    )
}

export default FGItemList
