
import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, Card, CardActions, CardContent, Checkbox, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import SvgIcon from '@mui/material/SvgIcon';

import Collapse from '@mui/material/Collapse';
import { alpha, styled } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
// import BomUploadData from './BomUploadData';
import SearchIcon from "@mui/icons-material/Search";
import SupplierLoadModal from './SupplierLoadModal/SupplierLoadModal';
import ImportExcelModal from './ImportExcelModal/ImportExcelModal';
import CopyFromModal from './CopyFromModal/CopyFromModal';
import { GetSuppVsItemSuppItemListWithCode, SupplierVsItemEditCell, SupplierVsItemDelete, SupplierVsItemDeleteRow, GetWithoutPoItemLists, AddSupplierVsItem, SearchSuppVsItemSuppItemListWithCode, GetSuppVsItemSuppItemList } from '../../ApiService/LoginPageService'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import * as XLSX from 'xlsx';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { DownloadSuppVsItemList } from '../../ApiService/DownloadCsvReportsService';
import PriceRevisionHistoryReport from '../Reports/PriceRevisionHistoryReport/PriceRevisionHistoryReport';
import { PriceRevision } from './PriceRevision';
import { darken, lighten } from '@mui/material/styles';
import { useModuleLocks } from '../context/ModuleLockContext';

const SupplierVsItemMaster = React.memo(() => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Supplier vs Item")?.lockStatus === "locked";

    const [open, setOpen] = useState(false)
    const [openprice, setOpenprice] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [excelModal, setExcelModal] = useState(false);
    const [copyFromModal, setCopyFromModal] = useState(false)
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectedSuppId, setSelectedSuppId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [supplierItemList, setSupplierItemList] = useState([{ id: 'RDL1' }])
    const [searchItemList, setSearchItemList] = useState([]);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [totalPages, setTotalPages] = useState(1);
    const [suppCode, setSuppCode] = useState('');
    const [suppName, setSuppName] = useState('');
    const [suppId, setSuppId] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('');
    const [isDeleteAll, setIsDeleteAll] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isTableEditable, setIsTableEditable] = useState(true);
    const [editedRowData, setEditedRowData] = useState([]);
    const [newInsertFlag, setNewInsertFlag] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const getBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));
    const getHoverBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5));

    const updateScreenHeight = () => {
        setScreenHeight(window.innerHeight);
    };

    // Set up an effect to handle resize events
    useEffect(() => {
        // Update screen height on initial render
        updateScreenHeight();

        // Add event listener for window resize
        window.addEventListener('resize', updateScreenHeight);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateScreenHeight);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    const columns = [
        {
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rate</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true,

        },
        {
            field: 'sob',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SOB%</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'suppDesc',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supp Desc</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'jwdcRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWDC Rate</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'leadTime',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Lead Time In Days</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {

            field: 'IsFcItem',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Is FC Item</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'productFamily',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Product Family</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'netWeight',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Product Weight</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'productFinish',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Product Finish</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true,
        },

        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const handleModalOpenClick = () => {
        setModalOpen(true);
    }

    const handleCopyFromModalClick = () => {
        setCopyFromModal(true);
    }


    const handlePriceRevision = () => {
        setOpenprice(true)
    }

    const handleExcelModelOpen = () => {
        setExcelModal(true);
    }

    // useEffect(() => {
    //     setSuppCode(supplierItemList[0]?.spCode || '');
    //     setSuppName(supplierItemList[0]?.suppName || '');
    //     setSuppId(supplierItemList[0]?.supId || '');
    // }, [supplierItemList]);

    const handleLoadButtonClick = () => {
        GetSuppVsItemSuppItemListWithCode({ supCode: suppCode, page }, handleGetSuppItemListSucessShow, handleGetSuppItemListExceptionShow);
    }

    const handleGetSuppItemListSucessShow = (dataObject) => {
        const filteredItems = (dataObject?.data || []).filter(item => item.id !== null);
        // Add { id: 'RDL1' } if it doesn't already exist
        if (!filteredItems.some(item => item.id === 'RDL1')) {
            filteredItems.push({ id: 'RDL1' });
        }
        setSupplierItemList(filteredItems);

        setSearchItemList([]);
        setIsTableEditable(false);
        setSuppId(dataObject?.data[0]?.supId || '');

        setIsLoaded(true)

    }
    let currency = supplierItemList.length > 0 ? supplierItemList[0].currency : " ";
    const handleGetSuppItemListExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    //DELETE ROW
    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        // setRefreshData((oldvalue) => !oldvalue);
        handleLoadButtonClick();
        setTimeout(() => {
            handleClose();
            setIsDeleteAll(false);
            setDeleteDailogOpen(false);
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

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //EDIT CELL
    const handleCellEdit = (params) => {
        // console.log('enter');
        // console.log(params);
        // const updatedRows = [...supplierItemList];
        // const index = updatedRows.findIndex((row) => row.id === params.id);
        // updatedRows[index][params.field] = params.value;
        // console.log(updatedRows[index].id);
        // SupplierVsItemEditCell({
        //     id: updatedRows[index].id,
        //     rate: updatedRows[index].rate,
        //     sob: updatedRows[index].sob,
        //     suppDesc: updatedRows[index].suppDesc,
        //     jwdcRate: updatedRows[index].jwdcRate,
        //     leadTime: updatedRows[index].leadTime,
        //     remarks: updatedRows[index].remarks,
        //     IsFcItem: updatedRows[index].IsFcItem,
        // }, handleItemkUpdate, handleItemUpdateException)
        // call your API here to update the data in your backend
        // const updatedData = { id: params.id, [params.field]: params.value };
        // console.log(params);
        // const updatedRows = [...supplierItemList];
        // const index = updatedRows.findIndex((row) => row.id === params.id);
        // updatedRows[index][params.field] = params.value;
        // console.log(updatedRows[index].id);
        SupplierVsItemEditCell({
            id: params.id,
            rate: params.rate,
            sob: params.sob,
            suppDesc: params.suppDesc,
            jwdcRate: params.jwdcRate,
            leadTime: params.leadTime,
            remarks: params.remarks,
            IsFcItem: params.IsFcItem,
        }, handleItemkUpdate, handleItemUpdateException)
    };

    const handleItemkUpdate = (dataObject) => {
        handleLoadButtonClick()
        setSupplierItemList(dataObject?.data || []);
        setRefreshKey((prevKey) => prevKey + 1);
        setEditedRowData([]);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
    }
    const handleItemUpdateException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    //DELETE ALL ROW
    const handleAllDeleteRow = () => {
        console.log("Delete All Row", suppId);
        // SupplierVsItemDelete({ id: suppId }, handleSuccessDelete, handleDeleteException)
        setDeleteId(suppId);
        setDeleteDailogOpen(true);
        setIsDeleteAll(true);
    }

    const handleSuccessDelete = (dataObject) => {
        handleLoadButtonClick()
        setSupplierItemList(dataObject?.data || []);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
    }
    const handleDeleteException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }


    const handleDownload = () => {
        // const worksheet = arrayToWorksheet(data);
        // downloadExcelFile(worksheet, 'SUPP_data.xlsx');
        DownloadSuppVsItemList({ id: suppId }, handleDownloadSuccess, handleDownloadException)
    };

    const handleDownloadSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
    }
    const handleDownloadException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }
    ///////////////////////////////////////

    // ITEM AND ITEM CODE SEARCH

    const handleItemChange = (e) => {
        GetWithoutPoItemLists({ code: e.target.value }, handlePoItemSuccess, handlePoItemException);
    }
    const handlePoItemSuccess = (dataObject) => {
        setSearchItemList(dataObject?.data || []);
    }
    const handlePoItemException = () => { }

    // ADD ITEMS
    // const handleSupplierItemChange = (value) => {
    //      console.log("Selected ID:", value);
    //     if (value !== null) {
    //         // Clone the selectedItems array
    //         const clonedSelectedItems = [...supplierItemList];

    //         // Remove the last item from the cloned array
    //         const lastObj = clonedSelectedItems.pop();

    //         // Add the new value at the end and the removed item back
    //         clonedSelectedItems.push(value, lastObj);

    //         // Set the state with the modified array
    //         setSupplierItemList(clonedSelectedItems);
    //         // setSearchedItemValue();
    //     }
    // };
    // const handleSupplierItemChange = (value) => {
    //     console.log("Selected ID:", value);
    //     if (value !== null) {
    //         const newItem = {
    //             ...value,
    //             id: value.itemId,              // use itemId for consistent row-level id
    //             itemId: value.itemId,          // required by backend
    //             rate: value.rate || 0,
    //             sob: 0,
    //             suppDesc: '',
    //             jwdcRate: 0,
    //             leadTime: 0,
    //             remarks: '',
    //             IsFcItem: false,
    //             productFamily: value.productFamily || '',
    //             productFinish: value.productFinish || '',
    //             netWeight: value.netWeight || 0,
    //         };

    //         // Replace the dummy row (id === 'RDL1') in your list
    //         setSupplierItemList(prev =>
    //             prev.map(item => item.id === 'RDL1' ? newItem : item)
    //         );

    //         // Also update the edited row list
    //         setEditedRowData(prev => [
    //             ...prev.filter(item => item.id !== 'RDL1'),
    //             newItem
    //         ]);
    //     }
    // };


    // // suppDesc,jwdcRate,leadTime,IsFcItem,productFamily,netWeight,productFinish,remarks
    // const handleEdit = (cellNam, newValue, id, rowData) => {
    //     // Rate,SOB,SupDesc,JWDC,LeadTime,IsFc,ProdFamily,ProdWeight,ProdFinish,Remarks
    //     switch (cellNam) {
    //         case "Rate":
    //             const updatedRate = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'Rate' ?
    //                     { ...item, rate: Number(newValue) }
    //                     : item
    //             )
    //             setSupplierItemList(updatedRate);

    //             const editedRate = updatedRate.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedRate]);
    //             break;
    //         case "SOB":
    //             const updatedSOB = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'SOB' ?
    //                     { ...item, sob: Number(newValue) }
    //                     : item
    //             )
    //             setSupplierItemList(updatedSOB);

    //             const editedSOB = updatedSOB.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedSOB]);
    //             break;
    //         case "SupDesc":
    //             const updatedSupDesc = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'SupDesc' ?
    //                     { ...item, suppDesc: newValue }
    //                     : item
    //             )
    //             setSupplierItemList(updatedSupDesc);

    //             const editedSupDesc = updatedSupDesc.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedSupDesc]);
    //             break;
    //         case "JWDC":
    //             const updatedJWDC = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'JWDC' ?
    //                     { ...item, jwdcRate: Number(newValue) }
    //                     : item
    //             )
    //             setSupplierItemList(updatedJWDC);

    //             const editedJWDC = updatedJWDC.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedJWDC]);
    //             break;
    //         case "LeadTime":
    //             const updatedLeadTime = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'LeadTime' ?
    //                     { ...item, leadTime: Number(newValue) }
    //                     : item
    //             )
    //             setSupplierItemList(updatedLeadTime);

    //             const editedLeadTime = updatedLeadTime.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedLeadTime]);
    //             break;
    //         case "IsFc":
    //             const updatedIsFc = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'IsFc' ?
    //                     { ...item, IsFcItem: newValue }
    //                     : item
    //             )
    //             setSupplierItemList(updatedIsFc);

    //             const editedIsFc = updatedIsFc.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedIsFc]);
    //             break;
    //         case "ProdFamily":
    //             const updatedProdFamily = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'ProdFamily' ?
    //                     { ...item, productFamily: newValue }
    //                     : item
    //             )
    //             setSupplierItemList(updatedProdFamily);

    //             const editedProdFamily = updatedProdFamily.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedProdFamily]);
    //             break;
    //         case "ProdWeight":
    //             const updatedProdWeight = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'ProdWeight' ?
    //                     { ...item, netWeight: Number(newValue) }
    //                     : item
    //             )
    //             setSupplierItemList(updatedProdWeight);

    //             const editedProdWeight = updatedProdWeight.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedProdWeight]);
    //             break;
    //         case "ProdFinish":
    //             const updatedProdFinish = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'ProdFinish' ?
    //                     { ...item, productFinish: newValue }
    //                     : item
    //             )
    //             setSupplierItemList(updatedProdFinish);

    //             const editedProdFinish = updatedProdFinish.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedProdFinish]);
    //             break;
    //         case "Remarks":
    //             const updatedRemarks = supplierItemList.map((item) =>
    //                 item.id === id && cellNam === 'Remarks' ?
    //                     { ...item, remarks: Number(newValue) }
    //                     : item
    //             )
    //             setSupplierItemList(updatedRemarks);

    //             const editedRemarks = updatedRemarks.find(item => item.id === id);
    //             setEditedRowData(prev => [...prev.filter(item => item.id !== id), editedRemarks]);
    //             break;
    //         default:
    //         // code block
    //     }
    // }

    // console.log('editedRowDataeditedRowDataeditedRowData', editedRowData)
    // const handleUpdate = () => {
    //     setLoading(true);
    //     // const filteredItems = supplierItemList.filter(item => item.id !== 'RDL1');
    //     const filteredItems = editedRowData.filter(item => item.id !== 'RDL1');
    //     const transformedData = filteredItems.map(item => ({
    //         itemId: item.itemId,
    //         rate: item.rate,
    //         sob: item.sob,
    //         suppDesc: item.suppDesc,
    //         jwdcRate: item.jwdcRate,
    //         leadTime: item.leadTime,
    //         remarks: item.remarks,
    //         IsFcItem: item.IsFcItem,
    //     }));
    //     console.log("transformedData-------->>>>>>>>>>>>", transformedData);
    //     AddSupplierVsItem({ spCode: suppCode, items: transformedData }, handleAddSucess, handleAddException)
    // }


    // =====================
    // Autocomplete handler
    // =====================
    // =====================
    // Autocomplete handler
    // =====================
    // =====================
    // Autocomplete handler
    // =====================
    const handleSupplierItemChange = (value) => {
        if (value !== null) {
            const newItem = {
                ...value,
                id: `row-${value.itemId}`,    // 👈 unique row id for frontend
                itemId: value.itemId,         // 👈 backend id
                rate: value.rate || "",
                sob: "",
                suppDesc: '',
                jwdcRate: '',
                leadTime: "",
                remarks: '',
                IsFcItem: false,
                productFamily: value.productFamily || '',
                productFinish: value.productFinish || '',
                netWeight: value.netWeight || 0,
            };

            // setSupplierItemList(prev =>
            //     prev.map(item => item.id === 'RDL1' ? newItem : item)
            // );

            // setEditedRowData(prev => [
            //     ...prev.filter(item => item.id !== 'RDL1'),
            //     newItem
            // ]);
            setSupplierItemList(prev =>
                [...prev.map(item => item.id === 'RDL1' ? newItem : item), { id: 'RDL1' }]
            );

            // Also update the edited row list
            setEditedRowData(prev => [
                ...prev.filter(item => item.id !== 'RDL1'),
                newItem,
                {
                    id: 'RDL1'
                }
            ]);
        }
    };

    // =====================
    // Helper: Safe Row Update
    // =====================
    const updateRow = (rowId, updates) => {
        setSupplierItemList(prev => {
            const updated = prev.map(item =>
                item.id === rowId
                    ? {
                        ...item,
                        ...updates,
                        id: item.id,          // keep row identity
                        itemId: item.itemId,  // ✅ always preserve backend ID
                    }
                    : item
            );

            const edited = updated.find(item => item.id === rowId);

            setEditedRowData(p => [
                ...p.filter(i => i.id !== rowId),
                edited
            ]);

            return updated;
        });
    };

    // =====================
    // Edit Handler (uses updateRow)
    // =====================
    const handleEdit = (cellNam, newValue, id) => {
        switch (cellNam) {
            case "Rate":
                updateRow(id, { rate: Number(newValue) });
                break;
            case "SOB":
                updateRow(id, { sob: Number(newValue) });
                break;
            case "SupDesc":
                updateRow(id, { suppDesc: newValue });
                break;
            case "JWDC":
                updateRow(id, { jwdcRate: Number(newValue) });
                break;
            case "LeadTime":
                updateRow(id, { leadTime: Number(newValue) });
                break;
            case "IsFc":
                updateRow(id, { IsFcItem: newValue });
                break;
            case "ProdFamily":
                updateRow(id, { productFamily: newValue });
                break;
            case "ProdWeight":
                updateRow(id, { netWeight: Number(newValue) });
                break;
            case "ProdFinish":
                updateRow(id, { productFinish: newValue });
                break;
            case "Remarks":
                updateRow(id, { remarks: newValue });
                break;
            default:
                break;
        }
    };

    // =====================
    // Submit to API
    // =====================
    const handleUpdate = () => {
        setLoading(true);

        const filteredItems = supplierItemList.filter(item => item.id !== 'RDL1');

        const transformedData = filteredItems.map(item => ({
            itemId: item.itemId,      // ✅ always backend id
            rate: item.rate,
            sob: item.sob,
            suppDesc: item.suppDesc,
            jwdcRate: item.jwdcRate,
            leadTime: item.leadTime,
            remarks: item.remarks,
            IsFcItem: item.IsFcItem,
        }));


        AddSupplierVsItem(
            { spCode: suppCode, items: transformedData },
            handleAddSucess,
            handleAddException
        );
    };




    const handleAddSucess = (dataObject) => {
        handleLoadButtonClick()
        // setSupplierItemList(dataObject?.data || []);
        // setRefreshKey((prevKey) => prevKey + 1);
        setEditedRowData([]);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }
    const handleAddException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }

    const handleDeleteRow = (id) => {
        const newArray = supplierItemList.filter((item) => item.id !== id)
        setSupplierItemList(newArray);
    }

    ///////////////////
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleUpdateData = () => {
        // editedRowData.map  
        const filteredItems = editedRowData.filter(item => item.id !== 'RDL1');
        const transformedData = filteredItems.map(item => ({
            id: item.id,
            rate: item.rate,
            sob: item.sob,
            suppDesc: item.suppDesc,
            jwdcRate: item.jwdcRate,
            leadTime: item.leadTime,
            remarks: item.remarks,
            IsFcItem: item.IsFcItem,
        }));
        SupplierVsItemEditCell({ items: transformedData }, handleItemkUpdate, handleItemUpdateException)
    }

    // useEffect(() => {
    //     if (!selectedSuppId || page < 1) return;  // guard

    //     GetSuppVsItemSuppItemList(
    //         { id: selectedSuppId, supCode: '', page },
    //         (dataObject) => {
    //             const filteredItems = (dataObject?.data || []).filter(
    //                 (item) => item.id !== null
    //             );
    //             setSupplierItemList(filteredItems);
    //         },
    useEffect(() => {
        if (!selectedSuppId || page < 1) return; // guard

        GetSuppVsItemSuppItemList(
            { id: selectedSuppId, supCode: '', page },
            (dataObject) => {
                // Build from server (without dummy row) to decide pagination
                const serverItems = (dataObject?.data || []).filter(
                    (item) => item.id !== null
                );
                // Update pagination capability: disable Next if server returned no items
                setHasMore(serverItems.length > 0);

                // Then prepare list to render (append dummy row on first page only)
                const filteredItems = [...serverItems];
                if (page === 1 && !filteredItems.some((it) => it.id === 'RDL1')) {
                    filteredItems.push({ id: 'RDL1' });
                }
                setSupplierItemList(filteredItems);
            },
            (err) => console.error(err)
        );
        setIsLoaded(false);

    }, [selectedSuppId, page]);

    const handleSupplierSelect = (id, code, name) => {
        setSelectedSuppId(id);
        setSuppCode(code);
        setSuppName(name);
        setPage(1); // reset to first page on supplier change
        setHasMore(true); // re-enable Next at start of a new supplier
        setIsTableEditable(false);

    };
    return (
        // <div style={{ height: '100%', width: '100%', padding: '10px' }}>
        <>
            <Grid container spacing={2} alignItems={'center'}>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '10px'
                    }}
                >
                    <TextField
                        fullWidth
                        label="SUPP Name"
                        placeholder='SUPP Name  '
                        variant="filled"
                        required
                        disabled={true}
                        value={suppName}
                        onChange={(e) => setSuppName(e.target.value)}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '10px'
                    }}
                >
                    <TextField
                        fullWidth
                        label="SUPP Code"
                        placeholder='SUPP Code'
                        variant="filled"
                        required
                        value={suppCode}
                        onChange={(e) => setSuppCode(e.target.value)}
                        size="small"
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={1} lg={1} xl={1} >
                    <Button variant="contained" onClick={handleModalOpenClick} style={{ background: '#002D68', color: 'white' }}>
                        .....
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12} md={1} lg={1} xl={1} >
                    <Button variant="contained" onClick={handleLoadButtonClick} style={{ background: '#002D68', color: 'white' }}>
                        Load
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5} style={{ display: 'flex', flexDirection: 'row' }} >
                    <Typography style={{ color: '#002D68', fontWeight: 'bold' }}>Currency: </Typography>
                    <Typography style={{ color: '#002D68' }}> {currency}</Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <Button variant="contained" onClick={handleCopyFromModalClick} style={{ background: '#002D68', color: 'white' }}>
                        Copy from
                    </Button>
                </Grid>
                {/* <Grid item xs={12} sm={12} md={1} lg={2} xl={2} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <Button variant="contained" onClick={handlePriceRevision} style={{ background: '#002D68', color: 'white', width: '230px' }}>
                        Price Revision History
                    </Button>
                </Grid> */}
                {/* <Grid item xs={12} sm={12} md={2} lg={2} xl={2}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '10px'
                    }}
                >
                    <TextField
                        fullWidth
                        label="SUPP Name"
                        placeholder='SUPP Name  '
                        variant="filled"
                        required
                        value={suppName}
                        onChange={(e) => setSuppName(e.target.value)}
                    />
                </Grid> */}
            </Grid>

            <Grid container spacing={2} alignItems={'center'} marginTop={1}>

            </Grid>


            <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>

                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '97%', height: '550px' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={supplierItemList}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '500px',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',

                                            },
                                        }}
                                        processRowUpdate={handleCellEdit}
                                    />
                                </CardContent>

                            </Card>

                        </Grid> */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{
                    display: 'flex',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                }}>
                    <Box
                        sx={{
                            '& .super-app-theme--0': {
                                color: '#000000',
                                // bgcolor: (theme) => getBackgroundColor('#FFFFFF', theme.palette.mode),
                                '&:hover': {
                                    // bgcolor: (theme) => getHoverBackgroundColor('#FFFFFF', theme.palette.mode),
                                },
                                ':hover': { backgroundColor: '#FFFFFF' },
                            },
                            '& .super-app-theme--1': {
                                color: '#2F4F4F',
                                backgroundColor: '#FFFACD',
                                fontWeight: 'bold',
                                // bgcolor: (theme) => getBackgroundColor('#919191', theme.palette.mode),
                                '&:hover': {
                                    // bgcolor: (theme) => getHoverBackgroundColor(
                                    //     '#919191',
                                    //     theme.palette.mode,
                                    // ),
                                },
                            },
                            width: '100%',

                        }}
                    >
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', border: '1px solid #A9A9A9', margin: '10px' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {/* {searchItemList.length > 0 &&
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button variant="contained" onClick={handleUpdate} style={{ background: '#002D68', color: 'white', width: '200px' }}>
                                                Update
                                            </Button>
                                        </Grid>
                                    } */}
                                    {/* <Grid item md={12} lg={12} xl={12} overflow={'auto'} height={screenHeight - 300} style={{ marginBottom: '30px', zoom: '80%' }}> */}
                                    <Grid
                                        item
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        style={{ marginBottom: '30px', zoom: '80%' }}
                                    >
                                        <TextField
                                            id="outlined-basic"
                                            label="Search by Item Code..."
                                            variant="outlined"
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value)
                                                SearchSuppVsItemSuppItemListWithCode({ supCode: suppCode, code: e.target.value }, handleGetSuppItemListSucessShow, handleGetSuppItemListExceptionShow);
                                            }}
                                            className="mb-3 w-full"
                                            size='small'
                                        />
                                        <div style={{ maxHeight: screenHeight - 300, overflowY: "auto" }}>
                                            <table id="customers" style={{ borderCollapse: "collapse", width: "100%" }}>
                                                <tr>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>SI No</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Part No</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Part Name</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>UOM</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Rate</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>SOB%</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Supp Desc</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>JWDC Rate</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Leade Time In Days</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Is Fc Item</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Product Family</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Product Weight</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Product Finish</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Remarks</th>
                                                    <th style={{ whiteSpace: 'nowrap', position: "sticky", top: 0 }}>Actions</th>
                                                </tr>
                                                {supplierItemList.map((item, index) => (
                                                    <tr key={index} style={{ backgroundColor: item.isRate === 1 && "#FFEEAD" }}>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }}>{item.sNo}</td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }}>
                                                            {item.itemCode ? <span>{item.itemCode}</span> :
                                                                <Autocomplete
                                                                    disablePortal
                                                                    id="combo-box-demo"
                                                                    options={searchItemList}
                                                                    getOptionLabel={(option) => `${option.itemCode} | ${option.itemName} | ${option.rate}` || ''}
                                                                    sx={{ width: 300 }}
                                                                    renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleItemChange} />}
                                                                    onChange={(event, value) => handleSupplierItemChange(value)}

                                                                    size='small'
                                                                    disabled={isTableEditable ? false : true}
                                                                />
                                                            }
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }}>{item.itemName}</td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }}>{item.uom}</td>
                                                        {/* <td contentEditable={isTableEditable} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }}
                                                            onBlur={(e) => {
                                                                // searchItemList.length > 0 ?
                                                                handleEdit('Rate', e.target.textContent, item.id, item)
                                                                // :
                                                                // SupplierVsItemEditCell({
                                                                //     id: item.id,
                                                                //     rate: e.target.textContent,
                                                                //     sob: item.sob,
                                                                //     suppDesc: item.suppDesc,
                                                                //     jwdcRate: item.jwdcRate,
                                                                //     leadTime: item.leadTime,
                                                                //     remarks: item.remarks,
                                                                //     IsFcItem: item.IsFcItem,
                                                                // }, handleItemkUpdate, handleItemUpdateException)
                                                            }}
                                                        >  {item.rate}
                                                        </td> */}
                                                        <td
                                                            contentEditable={isTableEditable}
                                                            suppressContentEditableWarning={true}
                                                            style={{ whiteSpace: "nowrap", fontWeight: item.isRate === 1 ? "bold" : "normal" }}
                                                            onBlur={(e) => handleEdit("Rate", e.target.textContent, item.id, item)}
                                                            dangerouslySetInnerHTML={{ __html: item.rate ?? "" }}
                                                        ></td>
                                                        <td contentEditable={isTableEditable} suppressContentEditableWarning={true} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('SOB', e.target.textContent, item.id, item)} >{item.sob}</td>
                                                        <td contentEditable={isTableEditable} suppressContentEditableWarning={true} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('SupDesc', e.target.textContent, item.id, item)}>{item.suppDesc}</td>
                                                        <td contentEditable={isTableEditable} suppressContentEditableWarning={true} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('JWDC', e.target.textContent, item.id, item)}>{item.jwdcRate}</td>
                                                        <td contentEditable={isTableEditable} suppressContentEditableWarning={true} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('LeadTime', e.target.textContent, item.id, item)}>{item.leadTime}</td>
                                                        {/* <td contentEditable={true} onBlur={(e) => handleEdit('IsFc', e.target.textContent, item.id, item)}>{item.IsFcItem}</td> */}
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }}>
                                                            {item.id === 'RDL1' ?
                                                                null
                                                                :
                                                                <select id="fruits" value={item.IsFcItem} onChange={(event) => handleEdit('IsFc', event.target.value, item.id, item)} disabled={!isTableEditable} >
                                                                    <option value="">--Please choose an option--</option>
                                                                    <option value="Y">Y</option>
                                                                    <option value="N">N</option>
                                                                </select>
                                                            }
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('ProdFamily', e.target.textContent, item.id, item)}>{item.productFamily}</td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('ProdWeight', e.target.textContent, item.id, item)}>{item.netWeight}</td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('ProdFinish', e.target.textContent, item.id, item)}>{item.productFinish}</td>
                                                        <td contentEditable={isTableEditable} suppressContentEditableWarning={true} style={{ whiteSpace: 'nowrap', fontWeight: item.isRate === 1 && "bold" }} onBlur={(e) => handleEdit('Remarks', e.target.textContent, item.id, item)}>{item.remarks}</td>
                                                        {/* <td contentEditable={true} onBlur={(e) => handleEdit('POQTY', e.target.textContent, item.id, item)}>{item.poQty}</td> */}
                                                        {/* <td contentEditable={false}>
                                                        {item.id === 'RDL1' ?
                                                            null
                                                            :
                                                            <TextField
                                                                value={item.schDate}
                                                                type='date'
                                                                placeholder='Sch Date'
                                                                size='small'
                                                                onChange={(e) => handleEdit('SCHDATE', e.target.value, item.id, item)}
                                                            />
                                                        }
                                                    </td> */}
                                                        {/* <td contentEditable={true} onDoubleClick={() => handleCellClick("rate", item)}>{item.rate}</td> */}
                                                        <td contentEditable={isTableEditable} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                            {item.id === 'RDL1' ?
                                                                null
                                                                :
                                                                searchItemList.length > 0 ?
                                                                    <DeleteIcon
                                                                        onClick={() => {
                                                                            handleDeleteRow(item.id)
                                                                        }}
                                                                        style={{ color: 'black', cursor: 'pointer' }}
                                                                    />
                                                                    :
                                                                    <DeleteIcon
                                                                        onClick={() => {
                                                                            setDeleteId(item.id);
                                                                            setDeleteDailogOpen(true);
                                                                        }}
                                                                        style={{ color: 'black' }}
                                                                    />
                                                            }
                                                        </td>
                                                        {/* <td contentEditable={false} style={{ textAlign: 'center' }}>
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
                                                    </td> */}
                                                    </tr>))}
                                            </table>
                                        </div>
                                    </Grid>
                                    <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: "flex", justifyContent: "flex-end", columnGap: 3, margin: '0px 0' }}>
                                            <button style={{ fontSize: "0.8rem" }} onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                                                ⬅ Previous
                                            </button>
                                            <span>Page {page}</span>
                                            <button
                                                style={{ fontSize: "0.8rem" }}
                                                onClick={() => { if (hasMore) setPage((p) => p + 1) }}
                                                disabled={!hasMore}
                                            >
                                                Next ➡
                                            </button>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: "flex", justifyContent: "center" }}>
                                            <Button variant="contained" disabled={isModuleLocked} onClick={handleExcelModelOpen} style={{ background: isModuleLocked ? "gray" : "#002D68", color: 'white', width: '200px' }}>
                                                Import from XL
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: "flex", justifyContent: "center" }}>
                                            <Button variant="contained" disabled={!isLoaded || isModuleLocked} onClick={handleDownload} style={{ background: !isLoaded || isModuleLocked ? "gray" : "#002D68", color: 'white', width: '200px' }}>
                                                Save as xl
                                            </Button>
                                        </Grid>

                                        {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                            <Button variant="contained">
                                Close
                            </Button>
                        </Grid> */}
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: "flex", justifyContent: "center" }} >
                                            <Button variant="contained" disabled={isModuleLocked || supplierItemList.length === 0}

                                                onClick={handleAllDeleteRow} style={{ background: isModuleLocked ? "gray" : "#002D68", color: 'white', width: '200px' }}>
                                                Delete All Row
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: "flex", justifyContent: "center" }}>
                                            <Button variant="contained" disabled={isModuleLocked} onClick={handlePriceRevision} style={{ background: isModuleLocked ? "gray" : "#002D68", color: 'white', width: '220px' }}>
                                                Price Revision History
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: "flex", justifyContent: "center" }}>
                                            <Button variant="contained" disabled={isModuleLocked} onClick={() => setIsTableEditable(true)} style={{ background: isModuleLocked ? "gray" : "#002D68", color: 'white', width: '180px' }}>
                                                Edit
                                            </Button>
                                        </Grid>
                                        {isTableEditable &&
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: "flex", justifyContent: "center" }} >
                                                {/* <Button variant="contained" onClick={handleUpdateData} style={{ background: '#002D68', color: 'white', width: '180px' }}> */}
                                                <Button disabled={loading === true || isModuleLocked} variant="contained" onClick={handleUpdate} style={{ background: isModuleLocked ? "gray" : "#002D68", color: 'white', width: '180px' }}>
                                                    {/* Update */}
                                                    {loading ? (
                                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                                    ) : 'Update'}
                                                </Button>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            </CardContent>

                        </Card>
                    </Box>
                </Grid>
            </Grid>


            <CardActions
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginTop: '20px',
                    marginLeft: '15px',
                    marginBottom: '18px'
                }}
            >



                {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                            <Button variant="contained"
                                onClick={() => {
                                    setOpen(true)
                                }}
                            >
                                Option
                            </Button>
                        </Grid> */}

            </CardActions>


            <SupplierLoadModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                setSupplierItemList={setSupplierItemList}
                supplierItemList={supplierItemList}
                setIsTableEditable={setIsTableEditable}
                setSuppCode={setSuppCode}
                setSuppName={setSuppName}
                setSuppId={setSuppId}
                onSupplierSelect={handleSupplierSelect}

            />

            <ImportExcelModal
                excelModal={excelModal}
                setExcelModal={setExcelModal}
                suppCode={suppCode}
                handleLoadButtonClick={handleLoadButtonClick}
                setSupplierItemList={setSupplierItemList}

            />

            <CopyFromModal
                copyFromModal={copyFromModal}
                setCopyFromModal={setCopyFromModal}
                suppId={suppId}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // selectedMaster={selectedMaster}
                deleteService={!isDeleteAll ? SupplierVsItemDeleteRow : SupplierVsItemDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            <PriceRevision
                open={openprice}
                setOpen={setOpenprice} />

        </>
    )
})

export default SupplierVsItemMaster