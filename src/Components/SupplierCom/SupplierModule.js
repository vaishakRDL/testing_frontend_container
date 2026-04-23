import {
    Button, Box, Dialog, DialogContent, Tooltip, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, ListItemText, OutlinedInput, CircularProgress
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import MultiAddressModule from './MultiAddress/MultiAddressModule';
import MultiContactPersonModule from './MultiContactPerson/MultiContactPersonModule';
import FileUploadModule from './FileUpload/FileUploadModule';
import SearchIcon from "@mui/icons-material/Search";
import { CheckBox } from '@mui/icons-material';
import { ContactPersonsDataShow, FileDataShow, GetCurreny, GetGSTINUINID, GetPlaceOfSupply, GetSupplierGetId, GetSupplierType, SupplierDataAdd, SupplierDataUpdate, supplierUploadDelet, supplierUploadDeletCancle, supplierMultiAddressDeletCancle, supplierContactPersonDeletCancle, GetSupplierGroup, HandleSearchCity, GetSuppVsItemAllSuppList, PreviewSupplierData, SupplierButtonActions } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { DownloadPDFFile } from '../../ApiService/DownloadCsvReportsService';
import PDFViiewer from '../../Utility/PDFViiewer';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SupplierTitle from './SupplierTitle';
import SupplierSearch from './SupplierSearch';
import { useModuleLocks } from '../context/ModuleLockContext';

const SupplierModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    console.log("ddwdwdedefeditData", editData)

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Supplier List")?.lockStatus === "locked";

    const [supplierCode, setSupplierCode] = useState('');
    const [GSTNumber, setGSTNumber] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [tallyAlias, setTallyAlias] = useState('');
    const [supplierGroup, setSupplierGroup] = useState('');
    const [SupplierAddress1, setSupplierAddress1] = useState('')
    const [SupplierAddress2, setSupplierAddress2] = useState('')
    const [SupplierAddress3, setSupplierAddress3] = useState('')
    const [SupplierAddress4, setSupplierAddress4] = useState('')
    const [inActive, setInActive] = useState(false);
    const [Suppsearch, setSuppsearch] = useState(false);
    const [cityList, setCityList] = useState([]);
    const [suplierid, setSupplierId] = useState([]);
    const [city, setCity] = useState('')
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [partyNotes, setPartyNotes] = useState('');
    const [errorObject, setErrorObject] = useState({});
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [multiOpen, setMultiOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [attention, setAttention] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [PANNo, setPANNo] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [email, setEmail] = useState('');
    const [globleId, setGlobleId] = useState('');
    const [currencyList, setCurrencyList] = useState([]);
    const [supplierTypeList, setSupplierTypeList] = useState([]);
    const [gstinOrUinList, setGstinOrUinList] = useState([]);
    const [placeOfSupplyList, setPlaceOfSupplyList] = useState([]);
    const [fileDataList, setFileDataList] = useState([]);
    const [currency, setCurrency] = useState('');
    // const [supplier, setSupplierType] = useState([]);
    const [supplier, setSupplierType] = useState('');
    const [gstinOrUin, setGstinOrUin] = useState();
    const [placeOfSupply, setPlaceOfSupply] = useState('');
    const [dataRefresh, setDataRefresh] = useState(true);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [fileUploadOpen, setFileUploadOpen] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [fileTypeForView, setFileTypeForView] = useState('');
    const [contactPersonList, setContactPersonList] = useState([]);
    const [supplierGroupList, setSupplierGroupList] = useState([]);
    const [contactPerson, setContactPerson] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shippingPinCode, setShippingPinCode] = useState('');
    const [actualToState, setActualToState] = useState('');
    const [distance, setDistance] = useState('');
    const [toStateCode, setToStateCode] = useState('');
    const [Supplierdetail, setSupplierdetail] = useState('');
    const [supplierList, setSupplierList] = useState([]);
    const [rowId, setRowId] = useState('')
    const [opeAllView, setOpenAllView] = useState(false);
    const [loading, setLoading] = useState(false);

    // const [isEdit, setIsEdit] = useState(true);
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mainId, setMainId] = useState('');

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    useEffect(() => {
        LoadingData();
        FileDataShow({
            id: globleId
        }, handleSuccessShowFile, handleException);
        FileDataShow({
            id: editData?.sId
        }, handleSuccessShowFile, handleException);
        ContactPersonsDataShow({
            id: editData?.sId || globleId
        }, handleShowSuccess, handleShowException);
        handleForwardReverse('last', '')
        console.log("dataid--------->>>>>>>", mainId)
    }, [editData, dataRefresh]);


    const handleShowSuccess = (dataObject) => {
        setContactPersonList(dataObject?.data || []);
    }

    const handleShowException = () => {

    }


    const LoadingData = () => {
        if (isAddButton) {
            GetSupplierGetId(handleGetSupplierGetIdSuccess, handleException)
        }

        if (open) {
            FileDataShow({
                id: globleId
            }, handleSuccessShowFile, handleException);

            GetCurreny(handleCurrencySucess, handleException);
            GetSupplierGroup(handleSupplierGroupSucess, handleException);
            GetSupplierType(handleCGetSupplierTypeSucess, handleException);
            GetGSTINUINID(handleGetGSTINUINIDSucess, handleException);
            GetPlaceOfSupply(handleGetPlaceOfSupplySucess, handleException);
        }
        setGlobleId(editData?.sId || '');
        setSupplierCode(editData?.spCode || '');
        setGSTNumber(editData?.gstNo || '');
        setSupplierName(editData?.spName || '');
        setTallyAlias(editData?.tallyAlias || '');
        setSupplierGroup(editData?.spGroup || '');
        setSupplierAddress1(editData?.spAdd1 || '')
        setSupplierAddress2(editData?.spAdd2 || '')
        setSupplierAddress3(editData?.spAdd3 || '')
        setSupplierAddress4(editData?.spAdd3 || '')
        setCity(editData?.city || '');
        setPincode(editData?.pincode || '');
        setState(editData?.state || '');
        setCountry(editData?.country || '');
        setPartyNotes(editData?.partyNotes || '');
        setAttention(editData?.attention || '');
        setPaymentTerms(editData?.paymentTerms || '');
        setPANNo(editData?.panNo || '');
        setStateCode(editData?.stateCode || '');
        setCurrency(editData?.currency || '');
        setGstinOrUin(editData?.gstinAndUin || '');
        setPlaceOfSupply(editData?.spPlace || '');
        setInActive(editData?.inactiveStatus || false);
        setEmail(editData?.email || '');
        if (editData?.spType) {
            const str = editData?.spType;
            const arr = str.split(",");
            setSupplierType(arr || []);
        }
        // NEW CODE
        setContactPerson(editData?.contactPerson || '');
        setPhoneNumber(editData?.phoneNo || '');
        setShippingPinCode(editData?.shippingPinCode || '');
        setActualToState(editData?.actToState || '');
        setDistance(editData?.distance || '');
        setToStateCode(editData?.toStateCode || '');

    }

    const handleSuccessShowFile = (dataObject) => {
        setFileDataList(dataObject?.data || []);

    }

    const handleGetSupplierGetIdSuccess = (dataObject) => {
        setGlobleId(dataObject?.id || '');

    }

    const handleCurrencySucess = (dataObject) => {
        setCurrencyList(dataObject?.data || []);
    }

    const handleSupplierGroupSucess = (dataObject) => {
        setSupplierGroupList(dataObject?.data || []);
    }

    const handleCGetSupplierTypeSucess = (dataObject) => {
        setSupplierTypeList(dataObject?.data || []);
    }
    const handleGetGSTINUINIDSucess = (dataObject) => {
        console.log('setGstinOrUinList--->', dataObject?.data)
        setGstinOrUinList(dataObject?.data || []);
    }
    const handleGetPlaceOfSupplySucess = (dataObject) => {
        setPlaceOfSupplyList(dataObject?.data || []);
    }

    const handleException = (errorObject, errorMessage) => {
        console.log('error', errorMessage)
    }

    const handleSuccess = (dataObject) => {
        setRefreshData((oldvalue) => !oldvalue);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpen(false);
        }, 5000);
    };

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        if (isEdit) {
            SupplierDataUpdate({
                // id: editData?.id || rowId,
                id: Suppsearch ? suplierid : (editData?.id || rowId),

                // id: editData?.id || suplierid,
                // id:rowId,
                sId: globleId,
                spCode: supplierCode,
                gstNo: GSTNumber,
                spName: supplierName,
                tallyAlias: tallyAlias,
                spGroup: supplierGroup,
                spAdd1: SupplierAddress1,
                spAdd2: SupplierAddress2,
                spAdd3: SupplierAddress3,
                spAdd4: SupplierAddress4,
                inactiveStatus: inActive,
                city: city,
                pincode: pincode,
                state: state,
                country: country,
                currency: currency,
                attention: attention,
                spType: supplier.toString(),
                paymentTerms: paymentTerms,
                gstinAndUin: gstinOrUin,
                panNo: PANNo,
                spPlace: placeOfSupply,
                stateCode: stateCode,
                email: email,
                partyNotes: partyNotes,
                contactPerson: contactPerson,
                phoneNo: phoneNumber,
                shippingPinCode: shippingPinCode,
                actToState: actualToState,
                distance: distance,
                toStateCode: toStateCode
            }, handleSupplierUpdateSuccess, handleSupplierDataAddException);
        } else {
            SupplierDataAdd({
                sId: globleId,
                spCode: supplierCode,
                gstNo: GSTNumber,
                spName: supplierName,
                tallyAlias: tallyAlias,
                spGroup: supplierGroup,
                spAdd1: SupplierAddress1,
                spAdd2: SupplierAddress2,
                spAdd3: SupplierAddress3,
                spAdd4: SupplierAddress4,
                inactiveStatus: inActive,
                city: city,
                pincode: pincode,
                state: state,
                country: country,
                currency: currency,
                attention: attention,
                spType: supplier.toString(),
                paymentTerms: paymentTerms,
                gstinAndUin: gstinOrUin,
                panNo: PANNo,
                spPlace: placeOfSupply,
                stateCode: stateCode,
                email: email,
                partyNotes: partyNotes,
                contactPerson: contactPerson,
                phoneNo: phoneNumber,
                shippingPinCode: shippingPinCode,
                actToState: actualToState,
                distance: distance,
                toStateCode: toStateCode
            }, handleSupplierDataAddSuccess, handleSupplierDataAddException);
        }

        // if (isAddButton) {
        //     SupplierDataAdd({
        //         sId: globleId,
        //         spCode: supplierCode,
        //         gstNo: GSTNumber,
        //         spName: supplierName,
        //         tallyAlias: tallyAlias,
        //         spGroup: supplierGroup,
        //         spAdd1: SupplierAddress1,
        //         spAdd2: SupplierAddress2,
        //         spAdd3: SupplierAddress3,
        //         spAdd4: SupplierAddress4,
        //         inactiveStatus: inActive,
        //         city: city,
        //         pincode: pincode,
        //         state: state,
        //         country: country,
        //         currency: currency,
        //         attention: attention,
        //         spType: supplier.toString(),
        //         paymentTerms: paymentTerms,
        //         gstinAndUin: gstinOrUin,
        //         panNo: PANNo,
        //         spPlace: placeOfSupply,
        //         stateCode: stateCode,
        //         email: email,
        //         partyNotes: partyNotes,
        //         contactPerson: contactPerson,
        //         phoneNo: phoneNumber,
        //         shippingPinCode: shippingPinCode,
        //         actToState: actualToState,
        //         distance: distance,
        //         toStateCode: toStateCode
        //     }, handleSupplierDataAddSuccess, handleSupplierDataAddException);
        // } else {
        //     SupplierDataUpdate({
        //         id: editData.id,
        //         sId: globleId,
        //         spCode: supplierCode,
        //         gstNo: GSTNumber,
        //         spName: supplierName,
        //         tallyAlias: tallyAlias,
        //         spGroup: supplierGroup,
        //         spAdd1: SupplierAddress1,
        //         spAdd2: SupplierAddress2,
        //         spAdd3: SupplierAddress3,
        //         spAdd4: SupplierAddress4,
        //         inactiveStatus: inActive,
        //         city: city,
        //         pincode: pincode,
        //         state: state,
        //         country: country,
        //         currency: currency,
        //         attention: attention,
        //         spType: supplier.toString(),
        //         paymentTerms: paymentTerms,
        //         gstinAndUin: gstinOrUin,
        //         panNo: PANNo,
        //         spPlace: placeOfSupply,
        //         stateCode: stateCode,
        //         email: email,
        //         partyNotes: partyNotes,
        //         contactPerson: contactPerson,
        //         phoneNo: phoneNumber,
        //         shippingPinCode: shippingPinCode,
        //         actToState: actualToState,
        //         distance: distance,
        //         toStateCode: toStateCode
        //     }, handleSupplierUpdateSuccess, handleSupplierDataAddException);

        // }

    };

    const handleSupplierUpdateSuccess = (dataObject) => {
        // PreviewSupplierData({ id: suplierid }, handleGetSuppDataSucessShow, handleGetSuppDataExceptionShow)
        setIsView(true);

        setSuppsearch(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            // ClearData();
            handleClose();
            setLoading(false);
        }, 2000);
    }

    const handleSupplierDataAddSuccess = (dataObject) => {
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

    const handleSupplierDataAddException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setLoading(false);
        }, 2000);
    }

    const ClearData = () => {
        // setSupplierNameValue('');
        setSupplierCode('');
        setGSTNumber('');
        setSupplierName('');
        setTallyAlias('');
        setSupplierGroup('');
        setSupplierAddress1('')
        setSupplierAddress2('')
        setSupplierAddress3('')
        setSupplierAddress4('')
        setCity('')
        setPincode('');
        setState('');
        setCountry('');
        setPartyNotes('');
        setErrorObject({});
        setMultiOpen(false);
        setContactOpen(false);
        setAttention('');
        setPaymentTerms('');
        setPANNo('');
        setStateCode('');
        setGlobleId('');
        setCurrencyList([]);
        setSupplierTypeList([]);
        setGstinOrUinList([]);
        setPlaceOfSupplyList([]);
        setFileDataList([]);
        setCurrency('');
        setSupplierType([]);
        setGstinOrUin();
        setPlaceOfSupply();
        setInActive(false);
        setDeleteDailogOpen(false);
        setDeleteId('');
        setFileUploadOpen(false);
        setIsEdit(true);
        // setOpen(false);
        // setRefreshData(oldvalue => !oldvalue);
    }
    const validateForNullValue = (value, type) => {

    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'contactPerson',
            headerName: 'Contact Person Name',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'department',
            headerName: 'Department',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'designation',
            headerName: 'Designation',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'mobNo',
            headerName: 'Mobile No',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'telNo',
            headerName: 'Tel No',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'email',
            headerName: 'Email',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'fax',
            headerName: 'Fax',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerName: 'Remaks',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                // <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    const columns2 = [
        {
            field: 'headerName',
            headerName: 'Header Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'value',
            headerName: 'Values',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => [
                <FieldsAction selectedRow={params.row} />,
            ],
        },


    ];

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSupplierType(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    function FieldsAction(props) {
        return (
            <>
                {

                    props.selectedRow.headerName === 'Currency' ? (
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currency}
                                disabled={isEdit}
                                label="Age"
                                onChange={(e) => {
                                    setCurrency(e.target.value);
                                }}
                            >
                                {currencyList.map((data) => (

                                    <MenuItem key={data.id} value={data.id}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : props.selectedRow.headerName === 'Place of Supply' ? (

                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={placeOfSupply}
                                label="Age"
                                disabled={isEdit}
                                onChange={(e) => {
                                    setPlaceOfSupply(e.target.value);
                                }}
                            >
                                {placeOfSupplyList.map((data) => (

                                    <MenuItem key={data.id} value={data.id}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) :
                        props.selectedRow.headerName === 'Supplier Type' ? (
                            <>
                                <FormControl
                                    fullWidth
                                >
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={supplier}
                                        onChange={handleChange}
                                        disabled={isEdit}
                                        input={<OutlinedInput />
                                        }

                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {supplierTypeList.map((data,) => (
                                            <MenuItem key={data.id} value={data.name}>

                                                <Checkbox checked={supplier.indexOf(data.name) > -1} />
                                                <ListItemText primary={data.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )
                            // : props.selectedRow.headerName === 'GSTIN/UIN ID' ? (
                            //     <>
                            //         <FormControl fullWidth>
                            //             <Select
                            //                 labelId="demo-simple-select-label"
                            //                 id="demo-simple-select"
                            //                 value={gstinOrUin}
                            //                 disabled={isEdit}
                            //                 onChange={(e) => {
                            //                     setGstinOrUin(e.target.value);
                            //                 }}
                            //             >
                            //                 {gstinOrUinList.map((data) => (
                            //                     <MenuItem key={data.id} value={data.id}>
                            //                         {data.name}
                            //                     </MenuItem>
                            //                 ))}
                            //             </Select>
                            //         </FormControl>
                            //     </>
                            // )
                            : props.selectedRow.headerName === 'Attention' ? (
                                <>
                                    <TextField
                                        id="filled-basic"
                                        fullWidth
                                        disabled={isEdit}
                                        value={attention}
                                        onChange={(e) => setAttention(e.target.value)}
                                    />
                                </>
                            ) : props.selectedRow.headerName === 'Payment Terms' ? (
                                <>
                                    <TextField
                                        id="filled-basic"
                                        fullWidth
                                        disabled={isEdit}
                                        value={paymentTerms}
                                        onChange={(e) => setPaymentTerms(e.target.value)}
                                    />
                                </>
                            ) :
                                props.selectedRow.headerName === 'PAN No' ? (
                                    <>
                                        <TextField
                                            id="filled-basic"
                                            fullWidth
                                            disabled={isEdit}
                                            value={PANNo}
                                            onChange={(e) => setPANNo(e.target.value)}
                                        />
                                    </>
                                ) :
                                    props.selectedRow.headerName === 'State Code' ? (
                                        <>
                                            <TextField
                                                id="filled-basic"
                                                fullWidth
                                                disabled
                                                value={stateCode}
                                                onChange={(e) => setStateCode(e.target.value)}
                                            />

                                        </>
                                    ) :

                                        (
                                            <>
                                            </>
                                        )
                }
            </>
        );

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setContactOpen(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <Tooltip title="Download" arrow>
                <DeleteIcon
                    onClick={() => {

                    }}
                    style={{ color: '#002D68' }}
                />
            </Tooltip>
        );
    }


    function DownloadData(props) {
        return (
            <Tooltip title="Download" arrow>
                <DownloadIcon
                    onClick={() => {
                        DownloadPDFFile({ id: props.selectedRow.id, fileType: props.selectedRow.filePath }, hadleDownloadSuccess, handleDownloadEcxeption);
                    }}
                    style={{ color: '#002D68' }}
                />
            </Tooltip>
        );
    }

    const hadleDownloadSuccess = () => {

    }

    const handleDownloadEcxeption = () => {

    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
            setDataRefresh((oldvalue) => !oldvalue);
        }, 3000);
    };

    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    const HeaderRows = [
        {
            id: 1, headerName: 'Currency',
            value:
                <spacing>
                    <FormControl fullWidth
                        size='small'
                        variant="standard"
                    >
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currency}
                            disabled={isView ? true : false}
                            onChange={(e) => {
                                setCurrency(e.target.value);
                            }}
                        >
                            {currencyList.map((data) => (

                                <MenuItem key={data.id} value={data.id}>
                                    {data.code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </spacing>,
            isDropDown: false

        },

        {
            id: 3,
            headerName: 'Attention',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={attention}
                        size='small'
                        variant="standard"
                        onChange={(e) => setAttention(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },

        {
            id: 7,
            headerName: 'Supplier Type',
            value:
                // <span>
                //     <FormControl
                //         fullWidth

                //     >
                //         <Select
                //             labelId="demo-multiple-checkbox-label"
                //             id="demo-multiple-checkbox"
                //             multiple
                //             value={supplier}
                //             onChange={handleChange}
                //             disabled={isEdit}
                //             size='small'
                //             variant="standard"
                //             input={<OutlinedInput />
                //             }

                //             renderValue={(selected) => selected.join(', ')}
                //             MenuProps={MenuProps}
                //         >
                //             {supplierTypeList.map((data,) => (
                //                 <MenuItem key={data.id} value={data.name}>

                //                     <Checkbox checked={supplier.indexOf(data.name) > -1} />
                //                     <ListItemText primary={data.name} />
                //                 </MenuItem>
                //             ))}
                //         </Select>
                //     </FormControl>
                // </span>
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={supplier}
                        size='small'
                        variant="standard"
                        onChange={(e) => setSupplierType(e.target.value)}
                    />
                </span>
            ,
            isDropDown: true
        },
        {
            id: 8,
            headerName: 'Payment Terms',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={paymentTerms}
                        size='small'
                        variant="standard"
                        onChange={(e) => setPaymentTerms(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },
        // {
        //     id: 9,
        //     headerName: 'GSTIN/UIN ID',
        //     value: '',
        //     isDropDown: false
        // },
        {
            id: 10,
            headerName: 'PAN No',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={PANNo}
                        size='small'
                        variant="standard"
                        onChange={(e) => setPANNo(e.target.value)}
                    />
                </span>
            ,
            isDropDown: true
        },
        {
            id: 11,
            headerName: 'Place of Supply',
            value:
                // <span>
                //     <FormControl fullWidth size='small'
                //         variant="standard">
                //         <Select
                //             labelId="demo-simple-select-label"
                //             id="demo-simple-select"
                //             value={placeOfSupply}
                //             label="Age"
                //             disabled={isEdit}
                //             onChange={(e) => {
                //                 setPlaceOfSupply(e.target.value);
                //             }}
                //         >
                //             {placeOfSupplyList.map((data) => (

                //                 <MenuItem key={data.id} value={data.id}>
                //                     {data.name}
                //                 </MenuItem>
                //             ))}
                //         </Select>
                //     </FormControl>
                // </span>,
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={placeOfSupply}
                        size='small'
                        variant="standard"
                        onChange={(e) => setPlaceOfSupply(e.target.value)}
                    />
                </span>,
            isDropDown: false
        },
        {
            id: 12,
            headerName: 'State Code',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled
                        value={stateCode}
                        size='small'
                        variant="standard"
                        onChange={(e) => setStateCode(e.target.value)}
                    />
                </span>,
            isDropDown: false
        },
        {
            id: 13,
            headerName: 'Email',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={email}
                        multiline
                        size='small'
                        variant="standard"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </span>,
            isDropDown: false
        },
        {
            id: 14,
            headerName: 'Contact Person',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={contactPerson}
                        size='small'
                        variant="standard"
                        onChange={(e) => setContactPerson(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },
        {
            id: 15,
            headerName: 'Phone No',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={phoneNumber}
                        size='small'
                        variant="standard"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },
        {
            id: 16,
            headerName: 'Shipping Pincode',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={shippingPinCode}
                        size='small'
                        variant="standard"
                        onChange={(e) => setShippingPinCode(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },
        {
            id: 17,
            headerName: 'To StateCode',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={toStateCode}
                        size='small'
                        variant="standard"
                        onChange={(e) => setToStateCode(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },
        {
            id: 18,
            headerName: 'Actual To State',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={actualToState}
                        size='small'
                        variant="standard"
                        onChange={(e) => setActualToState(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },
        {
            id: 19,
            headerName: 'Distance KMS',
            value:
                <span>
                    <TextField
                        id="filled-basic"
                        fullWidth
                        disabled={isView ? true : false}
                        value={distance}
                        size='small'
                        variant="standard"
                        onChange={(e) => setDistance(e.target.value)}
                    />
                </span>
            ,
            isDropDown: false
        },

    ]

    function ViewdData(props) {
        return (
            <Tooltip title="View" arrow>
                <RemoveRedEyeIcon
                    onClick={() => {
                        setPdfOpen(true);
                        setFileTypeForView(props.selectedRow.filePath);

                    }}
                    style={{ color: '#002D68' }}
                />
            </Tooltip>
        );
    }

    const fileColumns = [
        {
            field: 'fileType',
            headerName: 'File Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DownloadData selectedRow={params.row} />,
                <ViewdData selectedRow={params.row} />,
                <DeleteDataFiles selectedRow={params.row} />,
            ],
        },
    ];

    function DeleteDataFiles(props) {
        return (
            <Tooltip title="Download" arrow>
                <DeleteIcon
                    onClick={() => {
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                    }}
                    style={{ color: '#002D68' }}
                />
            </Tooltip>
        );
    }
    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },

    ];

    ////////////////////////////////////////
    const handleItemChange = (e) => {
        HandleSearchCity({ code: e.target.value }, handlePoItemSuccess, handlePoItemException);
    }
    const handlePoItemSuccess = (dataObject) => {
        setCityList(dataObject?.data || []);
    }
    const handlePoItemException = () => { }

    // ADD ITEMS
    const handleSupplierItemChange = (value) => {
        if (value !== null) {
            setCity(value?.name || '');
            // setPincode(value?.pinCode || '');
            setState(value?.state || '');
            setCountry(value?.country || '')
            setStateCode(value?.stateCode || '')
        }
    };

    // SUPPLIER SEARCH
    // const handleSupSearchChange = (e) => {
    //     GetSuppVsItemAllSuppList({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    // }
    const handleSupSearchChange = (value) => {
        GetSuppVsItemAllSuppList(
            { code: value },
            handleItemVsProcessItemSucessShow,
            handleItemVsProcessItemExceptionShow
        );
    };
    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    // const handleSupplierSearchItemChange = (value) => {
    //     // setSupplierNameValue(value);
    //     setSupplierId(value.id)
    //     if (value !== null) {
    //         PreviewSupplierData({ id: value.id }, handleGetSuppDataSucessShow, handleGetSuppDataExceptionShow)
    //     }
    // };
    const handleSupplierSearchItemChange = (value) => {
        if (value) {
            setSupplierdetail(value);
            setSupplierId(value.id);
            PreviewSupplierData({ id: value.id }, handleGetSuppDataSucessShow, handleGetSuppDataExceptionShow);
        } else {
            setSupplierdetail('');
            setSupplierId('');
        }
    };

    const handleGetSuppDataSucessShow = (dataObject) => {
        setSuppsearch(true)
        const data = dataObject?.data[0] || [];
        setGlobleId(data?.sId || '');
        setSupplierCode(data?.spCode || '');
        setGSTNumber(data?.gstNo || '');
        setSupplierName(data?.spName || '');
        setTallyAlias(data?.tallyAlias || '');
        setSupplierGroup(data?.spGroup || '');
        setSupplierAddress1(data?.spAdd1 || '')
        setSupplierAddress2(data?.spAdd2 || '')
        setSupplierAddress3(data?.spAdd3 || '')
        setSupplierAddress4(data?.spAdd3 || '')
        setCity(data?.city || '');
        setPincode(data?.pincode || '');
        setState(data?.state || '');
        setCountry(data?.country || '');
        setPartyNotes(data?.partyNotes || '');
        setAttention(data?.attention || '');
        setPaymentTerms(data?.paymentTerms || '');
        setPANNo(data?.panNo || '');
        setStateCode(data?.stateCode || '');
        setCurrency(data?.currency || '');
        setGstinOrUin(data?.gstinAndUin || '');
        setPlaceOfSupply(data?.spPlace || '');
        setInActive(data?.inactiveStatus || false);
        setEmail(data?.email || '');
        if (data?.spType) {
            const str = data?.spType;
            const arr = str.split(",");
            setSupplierType(arr || []);
        }
        // NEW CODE
        setContactPerson(data?.contactPerson || '');
        setPhoneNumber(data?.phoneNo || '');
        setShippingPinCode(data?.shippingPinCode || '');
        setActualToState(data?.actToState || '');
        setDistance(data?.distance || '');
        setToStateCode(data?.toStateCode || '');
    }
    const handleGetSuppDataExceptionShow = () => { }

    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        // setSupplierList([]);
        setSupplierdetail('');
        // setSupplierId('');
        FileDataShow({
            id: globleId
        }, handleSuccessShowFile, handleException);

        GetCurreny(handleCurrencySucess, handleException);
        GetSupplierGroup(handleSupplierGroupSucess, handleException);
        GetSupplierType(handleCGetSupplierTypeSucess, handleException);
        GetGSTINUINID(handleGetGSTINUINIDSucess, handleException);
        GetPlaceOfSupply(handleGetPlaceOfSupplySucess, handleException);
        SupplierButtonActions({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    console.log("88888888888888888888888888888888888888888888888888888888888", currency)

    const handleActionSuccess = (dataObject) => {
        setIsView(true);
        const data = dataObject?.data[0] || [];
        setRowId(data?.id || '')
        setGlobleId(data?.sId || '');
        setSupplierCode(data?.spCode || '');
        setGSTNumber(data?.gstNo || '');
        setSupplierName(data?.spName || '');
        setTallyAlias(data?.tallyAlias || '');
        setSupplierGroup(data?.spGroup || '');
        setSupplierAddress1(data?.spAdd1 || '')
        setSupplierAddress2(data?.spAdd2 || '')
        setSupplierAddress3(data?.spAdd3 || '')
        setSupplierAddress4(data?.spAdd3 || '')
        setCity(data?.city || '');
        setPincode(data?.pincode || '');
        setState(data?.state || '');
        setCountry(data?.country || '');
        setPartyNotes(data?.partyNotes || '');
        setAttention(data?.attention || '');
        setPaymentTerms(data?.paymentTerms || '');
        setPANNo(data?.panNo || '');
        setStateCode(data?.stateCode || '');
        setCurrency(data?.currency || '');
        setGstinOrUin(data?.gstinAndUin || '');
        setPlaceOfSupply(data?.spPlace || '');
        setInActive(data?.inactiveStatus || false);
        setEmail(data?.email || '');
        if (data?.spType) {
            const str = data?.spType;
            const arr = str.split(",");
            setSupplierType(arr || []);
        }
        // NEW CODE
        setContactPerson(data?.contactPerson || '');
        setPhoneNumber(data?.phoneNo || '');
        setShippingPinCode(data?.shippingPinCode || '');
        setActualToState(data?.actToState || '');
        setDistance(data?.distance || '');
        setToStateCode(data?.toStateCode || '');
        setMainId(data?.id || '');
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setSuppsearch(false)
        setSupplierList([]);
        setIsView(false);
        setIsEdit(false);
        setRowId('');
        setGlobleId('');
        setSupplierCode('');
        setGSTNumber('');
        setSupplierName('');
        setTallyAlias('');
        setSupplierGroup('');
        setSupplierAddress1('')
        setSupplierAddress2('')
        setSupplierAddress3('')
        setSupplierAddress4('')
        setCity('');
        setPincode('');
        setState('');
        setCountry('');
        setPartyNotes('');
        setAttention('');
        setPaymentTerms('');
        setPANNo('');
        setStateCode('');
        setCurrency('');
        setGstinOrUin('');
        setPlaceOfSupply('');
        setInActive(false);
        setEmail('');
        setSupplierType('');
        // NEW CODE
        setContactPerson('');
        setPhoneNumber('');
        setShippingPinCode('');
        setActualToState('');
        setDistance('');
        setToStateCode('');
        setMainId('');
        FileDataShow({
            id: globleId
        }, handleSuccessShowFile, handleException);

        GetCurreny(handleCurrencySucess, handleException);
        GetSupplierGroup(handleSupplierGroupSucess, handleException);
        GetSupplierType(handleCGetSupplierTypeSucess, handleException);
        GetGSTINUINID(handleGetGSTINUINIDSucess, handleException);
        GetPlaceOfSupply(handleGetPlaceOfSupplySucess, handleException);
    }

    return (
        <div style={{ margin: '30px' }}>
            <SupplierTitle />
            {/* <Dialog
        //     fullScreen
        //     maxWidth="xl"
        //     open={open}
        // > */}
            {/* <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Supplier / Supplier' : 'Edit Supplier / Supplier '} */}
            {/* <Grid item xs={12} md={8} lg={12} sm={12}>
                    <Card style={{ borderRadius: '8px', height: '85px' }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={top100Films}
                                sx={{ width: 300 }}
                                size='small'
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start">
                                                        <SearchIcon color="action" />
                                                    </InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid> */}
            {/* </DialogTitle> */}
            {/* <DialogContent> */}
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="Supplier Code"
                                    variant="filled"

                                    margin="dense"
                                    fullWidth
                                    required
                                    size='small'
                                    value={supplierCode}
                                    placeholder="Supplier Code"
                                    onChange={(e) => setSupplierCode(e.target.value)}
                                    onBlur={() => validateForNullValue(supplierCode, 'supplierCode')}
                                    autoComplete="off"
                                    error={errorObject?.supplierCode?.errorStatus}
                                    helperText={errorObject?.supplierCode?.helperText}
                                    // disabled={isView ? true : false}
                                    disabled={isView || isEdit}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1
                                    }}

                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="GST Number"
                                    variant="filled"

                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    value={GSTNumber}
                                    placeholder="GST Number"
                                    onChange={(e) => setGSTNumber(e.target.value)}
                                    disabled={isView ? true : false}
                                    // onBlur={() => validateForNullValue(setGSTNumber, 'GST Number')}
                                    // autoComplete="off"
                                    // error={errorObject?.setGSTNumber?.errorStatus}
                                    // helperText={errorObject?.setGSTNumber?.helperText}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="Supplier Name"
                                    variant="filled"
                                    type="text"
                                    margin="dense"
                                    fullWidth
                                    size='small'
                                    value={supplierName}
                                    required
                                    placeholder="Supplier Name"
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    onBlur={() => validateForNullValue(supplierName, 'supplierName')}
                                    autoComplete="off"
                                    error={errorObject?.supplierName?.errorStatus}
                                    helperText={errorObject?.supplierName?.helperText}
                                    disabled={isView ? true : false}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1, marginTop: '8px'
                                    }}
                                />

                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"

                                    label="Tally Alias"
                                    variant="filled"
                                    margin="dense"
                                    type="text"
                                    fullWidth
                                    size='small'
                                    value={tallyAlias}
                                    placeholder="Tally Alias"
                                    required
                                    onChange={(e) => { setTallyAlias(e.target.value); }}
                                    onBlur={() => validateForNullValue(tallyAlias, 'tallyAlias')}
                                    autoComplete="off"
                                    error={errorObject?.tallyAlias?.errorStatus}
                                    helperText={errorObject?.tallyAlias?.helperText}
                                    disabled={isView ? true : false}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1
                                    }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                {/* <TextField
                                        
                                        label="Supplier Group"
                                        type="text"
                                        fullWidth
                                        value={supplierGroup}
                                        variant="filled"
                                        margin="dense"
                                        placeholder="Supplier Group"
                                        required
                                        onChange={(e) => setSupplierGroup(e.target.value)}
                                        onBlur={() => validateForNullValue(supplierGroup, 'supplierGroup')}
                                        autoComplete="off"
                                        error={errorObject?.supplierGroup?.errorStatus}
                                        helperText={errorObject?.supplierGroup?.helperText}
                                    /> */}
                                <FormControl fullWidth style={{ marginTop: "8px" }}>
                                    <InputLabel id="demo-simple-select-label">Supplier Group</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Supplier Group"
                                        placeholder='Supplier Group'
                                        variant="filled"
                                        size='small'
                                        required
                                        value={supplierGroup}
                                        onChange={(e) => setSupplierGroup(e.target.value)}
                                        disabled={isView ? true : false}
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: "#424141ff", // strong visible text
                                            }, mb: 1
                                        }}
                                    >

                                        {supplierGroupList.map((data) => (
                                            <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField

                                    label="Supplier Address 1"
                                    type="text"
                                    fullWidth
                                    value={SupplierAddress1}
                                    variant="filled"
                                    placeholder="Supplier Address 1"
                                    multiline
                                    required
                                    size='small'
                                    margin="dense"
                                    onChange={(e) => { setSupplierAddress1(e.target.value); }}
                                    onBlur={() => validateForNullValue(SupplierAddress1, 'SupplierAddress1')}
                                    autoComplete="off"
                                    error={errorObject?.SupplierAddress1?.errorStatus}
                                    helperText={errorObject?.SupplierAddress1?.helperText}
                                    disabled={isView ? true : false}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1
                                    }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField

                                    label="Supplier Address 2"
                                    type="text"
                                    fullWidth
                                    value={SupplierAddress2}
                                    variant="filled"
                                    placeholder="Supplier Address 2"
                                    multiline
                                    required
                                    size='small'
                                    margin="dense"
                                    onChange={(e) => { setSupplierAddress2(e.target.value); }}
                                    onBlur={() => validateForNullValue(SupplierAddress2, 'SupplierAddress2')}
                                    autoComplete="off"
                                    error={errorObject?.SupplierAddress2?.errorStatus}
                                    helperText={errorObject?.SupplierAddress2?.helperText}
                                    disabled={isView ? true : false}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1
                                    }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField

                                    label="Supplier Address 3"
                                    type="text"
                                    fullWidth
                                    value={SupplierAddress3}
                                    variant="filled"
                                    placeholder="Supplier Address 3"
                                    multiline
                                    required
                                    size='small'
                                    margin="dense"
                                    onChange={(e) => { setSupplierAddress3(e.target.value); }}
                                    onBlur={() => validateForNullValue(SupplierAddress3, 'SupplierAddress3')}
                                    autoComplete="off"
                                    error={errorObject?.SupplierAddress3?.errorStatus}
                                    helperText={errorObject?.SupplierAddress3?.helperText}
                                    disabled={isView ? true : false}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1
                                    }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField

                                    label="Supplier Address 4"
                                    type="text"
                                    fullWidth
                                    value={SupplierAddress4}
                                    variant="filled"
                                    placeholder="Supplier Address 4"
                                    multiline
                                    required
                                    size='small'
                                    margin="dense"
                                    onChange={(e) => { setSupplierAddress4(e.target.value); }}
                                    onBlur={() => validateForNullValue(SupplierAddress4, 'SupplierAddress4')}
                                    autoComplete="off"
                                    error={errorObject?.SupplierAddress4?.errorStatus}
                                    helperText={errorObject?.SupplierAddress4?.helperText}
                                    disabled={isView ? true : false}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#424141ff", // strong visible text
                                        }, mb: 1
                                    }}
                                />

                            </Grid>

                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#002D68'
                                }}

                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={inActive}
                                            onClick={(e) => {
                                                setInActive(!inActive); // Toggle the value
                                            }}
                                            disabled={isView ? true : false}
                                        />
                                    }
                                    label="In Active"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                {/* <TextField
                                        sx={{ mb: 1 }}
                                        label="City"
                                        type="text"
                                        fullWidth
                                        value={city}
                                        variant="filled"
                                        placeholder="City"
                                        size='small'
                                        multiline
                                        required
                                        margin="dense"
                                        onChange={(e) => { setCity(e.target.value); }}
                                        onBlur={() => validateForNullValue(city, 'city')}
                                        autoComplete="off"
                                        error={errorObject?.city?.errorStatus}
                                        helperText={errorObject?.city?.helperText}
                                    /> */}
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={cityList}
                                    disabled={isView ? true : false}
                                    value={city}
                                    style={{ marginTop: '8px' }}
                                    getOptionLabel={(option) => option.name || city}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="filled"
                                            {...params}
                                            label="City"
                                            onChange={handleItemChange}
                                        />
                                    )}
                                    onChange={(event, value) => handleSupplierItemChange(value)}
                                    size='small'
                                // disabled={isPOView}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    sx={{ mb: 1 }}
                                    label="Pincode"
                                    type="text"
                                    // disabled={true}
                                    fullWidth
                                    value={pincode}
                                    variant="filled"
                                    placeholder="Pincode"
                                    multiline
                                    size='small'
                                    required
                                    margin="dense"
                                    onChange={(e) => { setPincode(e.target.value); }}
                                    onBlur={() => validateForNullValue(pincode, 'pincode')}
                                    autoComplete="off"
                                    error={errorObject?.pincode?.errorStatus}
                                    helperText={errorObject?.pincode?.helperText}
                                    disabled={isView ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    sx={{ mb: 1 }}
                                    label="State"
                                    type="text"
                                    disabled={true}
                                    fullWidth
                                    value={state}
                                    variant="filled"
                                    placeholder="State"
                                    size='small'
                                    multiline
                                    required
                                    margin="dense"
                                    onChange={(e) => { setState(e.target.value); }}
                                    onBlur={() => validateForNullValue(state, 'state')}
                                    autoComplete="off"
                                    error={errorObject?.state?.errorStatus}
                                    helperText={errorObject?.state?.helperText}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    sx={{ mb: 1 }}
                                    label="Country"
                                    type="text"
                                    disabled={true}
                                    fullWidth
                                    value={country}
                                    variant="filled"
                                    placeholder="Country"
                                    size='small'
                                    multiline
                                    required
                                    margin="dense"
                                    onChange={(e) => { setCountry(e.target.value); }}
                                    onBlur={() => validateForNullValue(country, 'country')}
                                    autoComplete="off"
                                    error={errorObject?.country?.errorStatus}
                                    helperText={errorObject?.country?.helperText}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '21vh' }}>
                                    <CardContent>
                                        <DataGrid
                                            rows={contactPersonList}
                                            columns={columns}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                height: '18vh',
                                                // minHeight: '480px',
                                                width: '100%',
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',

                                                },
                                                '& .MuiDataGrid-cell': {
                                                    border: '1px solid #969696',
                                                },
                                                '& .MuiDataGrid-columnHeader': {
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}

                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    sx={{ mb: 1 }}
                                    label="Party Notes"
                                    type="text"
                                    multiline
                                    fullWidth
                                    value={partyNotes}
                                    variant="filled"
                                    size='small'
                                    margin="dense"
                                    placeholder="Party Notes"
                                    onChange={(e) => { setPartyNotes(e.target.value); }}
                                    onBlur={() => validateForNullValue(partyNotes, 'partyNotes')}
                                    autoComplete="off"
                                    error={errorObject?.partyNotes?.errorStatus}
                                    helperText={errorObject?.partyNotes?.helperText}
                                    disabled={isView ? true : false}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '100%', height: '21vh' }}>
                                    <CardContent>
                                        <DataGrid
                                            rows={fileDataList}
                                            columns={fileColumns}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                height: '18vh',
                                                // minHeight: '480px',
                                                width: '100%',
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',

                                                },
                                                '& .MuiDataGrid-cell': {
                                                    border: '1px solid #969696',
                                                },
                                                '& .MuiDataGrid-columnHeader': {
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}

                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography style={{ fontWeight: 'bold', flex: 1 }}>
                                            Header Info
                                        </Typography>
                                        {/* <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            value={Supplierdetail}
                                            options={supplierList}
                                            fullWidth
                                            getOptionLabel={(option) => option.spCode || ''}
                                            renderInput={(params) => <TextField {...params} label="Supplier" onChange={handleSupSearchChange} />}
                                            onChange={(event, value) => handleSupplierSearchItemChange(value)}
                                            size="small"
                                            style={{ backgroundColor: '#ffffff', borderRadius: '5px', flex: 1 }}
                                        /> */}
                                        <Autocomplete
                                            disablePortal
                                            id="supplier-autocomplete"
                                            value={Supplierdetail}
                                            options={supplierList}
                                            fullWidth
                                            size="small"
                                            getOptionLabel={(option) =>
                                                option ? `${option.spCode} | ${option.spName}` : ""
                                            }
                                            onInputChange={(event, value) => {
                                                handleSupSearchChange(value);
                                            }}
                                            onChange={(event, value) =>
                                                handleSupplierSearchItemChange(value)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Supplier"
                                                />
                                            )}
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "5px",
                                                flex: 1,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* <DataGrid
                                                rows={HeaderRows}
                                                columns={columns2}
                                                pageSize={8}
                                                // loading={isLoading}
                                                rowsPerPageOptions={[8]}
                                                disableSelectionOnClick
                                                style={{ border: 'none', }}
                                                sx={{
                                                    height: '600px',
                                                    // minHeight: '520px',
                                                    width: '100%',
                                                    '& .super-app-theme--header': {
                                                        WebkitTextStrokeWidth: '0.6px',

                                                    },
                                                }}
                                            /> */}
                                        <div style={{ height: '60vh', overflow: 'auto' }}>
                                            <table style={{ overflow: 'auto', borderCollapse: 'collapse', border: '1px solid #ddd', width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ border: '2px solid #ddd' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                Header Name
                                                            </div>
                                                        </th>
                                                        <th style={{ border: '2px solid #ddd' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                Value
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ height: '300px', width: '400px', border: '1px solid #ddd' }}>
                                                    {HeaderRows.map((row, index) => (
                                                        <tr key={index} style={{ border: '1px solid #ddd' }}>
                                                            <td style={{ width: '200px', border: '1px solid #ddd' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    {row.headerName}
                                                                </div>
                                                            </td>
                                                            <td style={{ maxWidth: '250px', width: '250px', border: '1px solid #ddd', overflow: 'auto', height: '20px' }}>{row.value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>

                                    </Grid>
                                    <Button variant="outlined" onClick={() => setIsEdit(!isEdit)} sx={{ position: 'absolute', bottom: 10, margin: '10px' }}>{isEdit ? "Edit" : "Cancel"}</Button>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
                <DialogActions style={{ zoom: '80%', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1,
                            background: isModuleLocked ? 'gray' : "#002D68",
                            color: "white",
                            height: '35px',
                        }}
                        onClick={handleClearPage}
                        disabled={isModuleLocked}
                    >
                        New
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1,
                            background: isModuleLocked ? 'gray' : "#002D68",
                            color: "white",
                            height: '35px',
                        }}
                        onClick={() => {
                            setIsView(false)
                            setIsEdit(true)
                        }}
                        disabled={isModuleLocked}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1,
                            background: isModuleLocked ? 'gray' : "#002D68",
                            color: "white",
                            height: '35px',
                        }}
                        onClick={() => setDeleteDailogOpen(true)}
                        disabled={isModuleLocked}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1,
                            background: isModuleLocked ? 'gray' : "#002D68",
                            color: "white",
                            height: '35px',
                        }}
                        onClick={handleClearPage}
                        disabled={isModuleLocked}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1, background: "#002D68", color: "white", height: '35px',
                        }}
                        onClick={() => handleForwardReverse('first', '')}

                    >
                        <FastRewindIcon />
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1, background: "#002D68", color: "white", height: '35px',
                        }}
                        onClick={() => handleForwardReverse('reverse', mainId)}

                    >
                        <SkipPreviousIcon />
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1, width: "100%", background: "#002D68", color: "white", height: '35px',
                        }}
                        onClick={() => {
                            setOpenAllView(true);
                        }}

                    >
                        <SearchIcon />
                    </Button>
                    <Button
                        variant="contained"
                        style={{ display: 'flex', flex: 1, background: "#002D68", color: "white", height: '35px', }}
                        onClick={() => handleForwardReverse('forward', mainId)}

                    >
                        <SkipNextIcon />
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1, background: "#002D68", color: "white", height: '35px',
                        }}
                        onClick={() => handleForwardReverse('last', '')}

                    >
                        <FastForwardIcon />
                    </Button>
                    {!isView ?
                        <>
                            <Button
                                variant="contained"
                                style={{
                                    display: 'flex',
                                    flex: 1, whiteSpace: 'nowrap', background: isModuleLocked ? 'gray' : '#002D68', color: 'white'
                                }}
                                onClick={(e) => {

                                    setFileUploadOpen(true);
                                }}
                                disabled={isModuleLocked}
                            >
                                file Upload
                            </Button>

                            <Button
                                variant="contained"
                                style={{
                                    display: 'flex',
                                    flex: 1, whiteSpace: 'nowrap', background: isModuleLocked ? 'gray' : '#002D68', color: 'white'
                                }}
                                onClick={(e) => {

                                    setMultiOpen(true);
                                }}
                                disabled={isModuleLocked}
                            >
                                Multi Address
                            </Button>

                            <Button
                                variant="contained"
                                style={{
                                    display: 'flex',
                                    flex: 1, whiteSpace: 'nowrap', background: isModuleLocked ? 'gray' : '#002D68', color: 'white'
                                }}
                                onClick={(e) => {

                                    setContactOpen(true);
                                }}
                                disabled={isModuleLocked}
                            >
                                Contact Person
                            </Button>

                            <Button
                                variant="contained"
                                style={{
                                    display: 'flex',
                                    flex: 1, whiteSpace: 'nowrap', background: isModuleLocked ? 'gray' : '#002D68', color: 'white'
                                }}
                                disabled={
                                    errorObject?.customerId?.errorStatus
                                    || errorObject?.GSTNumber?.errorStatus
                                    || errorObject?.customerName?.errorStatus
                                    || errorObject?.billingAddress?.errorStatus
                                    || errorObject?.address?.errorStatus
                                    || errorObject?.shippingAddress?.errorStatus
                                    || errorObject?.contactPersonName?.errorStatus
                                    || errorObject?.primaryContactnumber?.errorStatus
                                    || errorObject?.phoneNumber?.errorStatus
                                    || errorObject?.email?.errorStatus
                                    || loading === true
                                    || isModuleLocked
                                }
                                type="submit"

                            >
                                {/* {isAddButton ? 'Add' : 'Update'} */}
                                {/* {isEdit ? 'Update' : 'Add'} */}
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : (isEdit ? 'Update' : 'Add')}
                            </Button>
                        </>
                        :
                        null
                    }
                    {/* <Button
                        variant="contained"
                        style={{
                            display: 'flex',
                            flex: 1, whiteSpace: 'nowrap', background: '#002D68', color: 'white'
                        }}
                        onClick={(e) => {
                            setOpen(false);
                            ClearData();
                            if (isAddButton) {
                                supplierUploadDeletCancle({
                                    globalId: globleId
                                }, deletehandleSuccess, deletehandleException);

                                supplierMultiAddressDeletCancle({
                                    globalId: globleId
                                }, deletehandleSuccess, deletehandleException);

                                supplierContactPersonDeletCancle({
                                    globalId: globleId
                                }, deletehandleSuccess, deletehandleException);
                            }
                        }}
                    >
                        Cancel
                    </Button> */}
                </DialogActions>
            </form>
            {/* </DialogContent> */}
            <SupplierSearch opeAllView={opeAllView} setOpenAllView={setOpenAllView} />
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <MultiAddressModule
                multiOpen={multiOpen}
                setMultiOpen={setMultiOpen}
                globleId={globleId}
            />
            <MultiContactPersonModule
                contactOpen={contactOpen}
                setContactOpen={setContactOpen}
                globleId={globleId}
            />

            <FileUploadModule
                fileUploadOpen={fileUploadOpen}
                globleId={globleId}
                setFileUploadOpen={setFileUploadOpen}
                setDataRefresh={setDataRefresh}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={rowId}
                deleteService={supplierUploadDelet}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            <PDFViiewer
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                fileTypeForView={fileTypeForView}
            />

            {/* // </Dialog> */}
        </div>
    )
}

export default SupplierModule