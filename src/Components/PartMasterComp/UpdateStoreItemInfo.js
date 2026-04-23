import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { ItemDownloadExlExport } from '../../ApiService/DownloadCsvReportsService';
import { ItemImportExcel, ItemStockDataBase, ItemStockImportlistdata, ItemStoreBulk } from '../../ApiService/LoginPageService';
import ApplicationStore from '../../Utility/localStorageUtil';
import RemoveErroneous from './BulkCreation/RemoveErroneous';

const UpdateStoreItemInfo = ({ open, setOpen }) => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [itemCount, setItemCount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [excelDataList, setExcelDataList] = useState([]);
    const [totalNumber, setTotalNumber] = useState(0);

    // const [dataReviewSet, setDataReviewSet] = useState([]);
    const [bcColor, setBcColor] = useState('#9c9c9c');
    const [cColor, setCcolor] = useState('#000000');
    // const [isError, setIsError] = useState(true);
    // const [errorOpen, setErrorOpen] = useState(false);
    const [isError, setIsError] = useState(false); // Initialize as false (button is disabled)
    const [errorOpen, setErrorOpen] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    useEffect(() => {
        // const  ErrorArrayList = ApplicationStore().getStorage2('ErrorArrayList');
        if (!isError) {
            setBcColor('#002D68');
            setCcolor('white');
        } else if (isError) {
            setBcColor('#9c9c9c');
            setCcolor('#000000');
        }

    }, [isError]);

    const handleSubmit = (e) => {
        e.preventDefault();
        ItemStoreBulk({
            items: excelDataList,
            type: 'Update'
        }, handleItemStoreBulkSuccess, handleItemStoreBulkException);
    }

    const handleItemStoreBulkSuccess = (dataObject) => {
        setExcelDataList([]);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const handleItemStoreBulkException = () => {

    }


    // const columns = [
    //     {
    //         field: 'itemCode',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Item Code
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 120,
    //         flex: 1,
    //         align: 'center',
    //         headerAlign: 'center',
    //     },
    //     {
    //         field: 'itemName',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Item Name
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'itemGroupName',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Item Group
    //             </span>,
    //         type: 'number',
    //         sortable: true,
    //         sortable: false,
    //         minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'tallyOrErp',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Tally / ERP Alias
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
    //     },

    //     {
    //         field: 'inActive',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 In Active
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         minWidth: 120,
    //         flex: 1,
    //         align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'uomName',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 UOM
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'stdRate',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Std Rate
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'gstCategory',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 GST Category
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'minStockLvl',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Min Stock Lvl
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'maxLvl',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Max Lvl
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'underLedger',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Under Ledger
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'reorder',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Reorder
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'rol',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 ROL

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'roq',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 ROQ

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'shelfLifeItem',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Shelf LifeItem
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'hsnCode',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 HSN Code

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'critical',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Critical
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'mainLocation',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Main Location
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'subLocation',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Sub Location
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'productFinish',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Product Finish
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'productFamily',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Product Family

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'category',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Category

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'fimId',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 FIM Id

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'duty',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Duty

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'grossWeight',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Gross Weight

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'netWeight',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Net Weight
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'scrapWeight',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Scrap Weight
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'rmItemCode',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 RM Item Code
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'rmThickness',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 RM Thickness

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'rmWidth',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 RM Width

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'rmLength',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 RM Length

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'stockControl',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Stock Control

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'material',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Material

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'materialThickness',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Material Thickness

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'jcPart',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 JC Part
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'partType',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Part Type

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     }, {
    //         field: 'sdCode',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 SD Code

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'delPackageType',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Del Package Type

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'delLotQty',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Del Lot Qty

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'nonStockable',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Non Stockable
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'binNo ',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Bin No
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'lotWiseItem',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 LotWise Item

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'lotType',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Lot Type
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'MOQ',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 MOQ
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },


    //     {
    //         field: 'INVTOOLSEL',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 INVTOOLSEL
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'TOOLID',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Tool ID
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'ledTime',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Led Time
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'STCOND',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 STCOND

    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },

    //     {
    //         field: 'RMItemId',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 RMItemId
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 120, align: 'center', headerAlign: 'center'
    //     },



    // ];

    // const handlItemImportExcelSucees = (dataObject) => {
    //     if (dataObject?.success === false) {
    //         ApplicationStore().setStorage2("ErrorArrayList", dataObject?.errorArray);
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: dataObject?.message,
    //         });
    //         setTimeout(() => {
    //             // handleClose();
    //             // setIsError(false);
    //         }, 3000);

    //     } else {

    //         setDataReviewSet(dataObject?.data || []);
    //     }
    // }

    // const handleItemImportExcelException = (errorObject, errorMessage) => {
    //     console.log('errorObject===>', errorMessage)
    //     setNotification({
    //         status: true,
    //         type: 'error',
    //         message: errorMessage,
    //     });
    //     setTimeout(() => {
    //         // handleClose();
    //         // setIsError(false);
    //     }, 3000);
    // }

    const columns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemGroupName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Group
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'inActive',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    In Active
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'uomName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    UOM
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'stdRate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Std Rate
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'minStockLvl',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Min Stock Lvl
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'maxLvl',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Max Lvl
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'shelfLifeItem',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Shelf LifeItem
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'hsnCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    HSN Code

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'critical',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Critical
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Category

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'mainLocation',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Main Location
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'material',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Material

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'materialThickness',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Material Thickness

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmWidth',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Width

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmLength',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Length

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'grossWeight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Gross Weight

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'netWeight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Net Weight
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'scrapWeight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Scrap Weight
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'productFinish',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Product Finish
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'coatingArea',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Coating Area
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'productFamily',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Product Family

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'fimId',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    FIM Id

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmItemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Item Code
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'reorder',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Reorder
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'rol',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ROL

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'roq',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ROQ

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'nonStockable',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Non Stockable
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'underLedger',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Under Ledger
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'gstCategory',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    GST Category
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'stockControl',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Stock Control

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'jcPart',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    JC Part
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },

    ];

    const handleItemImportExcelSuccess = (dataObject) => {
        if (dataObject?.success === false) {
            ApplicationStore().setStorage2("ErrorArrayList", dataObject?.errorArray);
            setNotification({
                status: true,
                type: 'error',
                message: dataObject?.message,
            });
            setIsError(true); // Enable button if there are errors
        } else {
            setExcelDataList(dataObject?.data || [])
            setTotalNumber(dataObject?.data.length);
            // setDataReviewSet(dataObject?.data || []);
            setIsError(false); // Disable button on success (no error)
        }
    };

    const handleItemImportExcelException = (errorObject, errorMessage) => {
        console.log('errorObject===>', errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setIsError(true); // Enable button on error
    };

    const handleItemDownloadExlExportSucess = () => {

    }

    const handleItemDownloadExlExportException = () => {

    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Update Store Item Info
            </DialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} style={{ marginTop: '10px', marginBottom: '20px' }}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TextField
                                fullWidth
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFileData(reader.result);
                                                ItemImportExcel({
                                                    file: reader.result
                                                }, handleItemImportExcelSuccess, handleItemImportExcelException);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#002D68',
                                    height: '40px',
                                    width: '400px',
                                    borderRadius: '20px',

                                }}
                                type='submit'
                            >
                                Load To Database
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button variant="contained"
                                onClick={() => {
                                    ItemDownloadExlExport(handleItemDownloadExlExportSucess, handleItemDownloadExlExportException);
                                }}
                                sx={{
                                    backgroundColor: '#002D68',
                                    height: '40px',
                                    width: '200px',
                                    borderRadius: '20px'
                                }}>
                                Template
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography>
                                Please Select a Excel file Containing Item Details
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Tatal Number of Records Loaded"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={totalNumber}
                                placeholder="Tatal Number of Records Loaded"
                                InputLabelProps={{
                                    shrink: true, style: { fontWeight: 'bold' }
                                }}
                                disabled={true}
                            />
                        </Grid>

                    </Grid>
                    <Grid container spacing={2}>
                        <DataGrid
                            rows={excelDataList}
                            columns={columns}
                            pageSize={8}
                            loading={isLoading}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none', }}
                            sx={{
                                overflow: 'auto',
                                height: '55vh',
                                // minHeight: '500px',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    WebkitTextStrokeWidth: '0.6px',
                                    backgroundColor: '#93bce6',
                                    color: '#1c1919'

                                },
                                '& .MuiDataGrid-cell': {
                                    border: '1px solid #969696',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    border: '1px solid #969696', // Add border to column headers
                                },
                            }}
                            getRowClassName={(params) => {
                                // Find the index of the row within the rows array
                                const rowIndex = excelDataList.findIndex(row => row.id === params.row.id);
                                // Check if the index is valid
                                if (rowIndex !== -1) {
                                    console.log(' ');
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                }
                                return ''; // Return default class if index is not found
                            }}
                            rowHeight={40}
                            columnHeaderHeight={40}
                        />

                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>

                {/* <Button
                variant="contained"
                style={{ width: '250px', background: '#002D68', color: 'white' }}
            >
                Import data to database
            </Button> */}

                {/* <Button
                    variant="contained"
                    style={{ width: '250px', background: bcColor, color: cColor }}
                    disabled={isError}
                    onClick={() => setErrorOpen(true)}
                >
                    Remove erroneous records
                </Button> */}

                {/* <Button
    variant="contained"
    style={{ width: '250px', background: '#002D68', color: 'white' }}
    disabled={!isError} // Disabled initially, enabled on error
    onClick={() => setErrorOpen(true)}
>
    Remove erroneous records
</Button> */}
                <Button
                    variant="contained"
                    style={{
                        width: '250px',
                        background: isError ? '#002D68' : '#666666', // Change color when disabled
                        color: 'white',
                        cursor: isError ? 'pointer' : 'not-allowed', // Make it feel more disabled
                    }}
                    disabled={!isError}
                    onClick={() => setErrorOpen(true)}
                >
                    Remove erroneous records
                </Button>


                {/* <Button
                    variant="contained"
                    style={{ width: '200px', background: '#002D68', color: 'white' }}

                    type="submit"

                >
                    Export to excel
                </Button> */}
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setOpen(false);
                        setExcelDataList([]);
                        setFileData('');
                        setTotalNumber(0)
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <RemoveErroneous
                open={errorOpen}
                setOpen={setErrorOpen}
                setIsError={setIsError}
            />


        </Dialog>
    )
}

export default UpdateStoreItemInfo