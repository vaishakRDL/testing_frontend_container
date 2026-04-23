import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Box, Button, Card, CardContent, FormControl, Grid, TextField } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';

import PartMasterTitle from './PartMasterTitle';
import PartMasterModule from './PartMasterModule';
import { ItemDataDelete, ItemSearchNAAJ, ItemsDataShow } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import PartMinMaxModule from './PartMinMaxModule';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CopyFrom from './CopyFrom';
import '../../App.css';

const PartMasterResult = () => {
    const [typeId, setTypeId] = useState("");
    const [isPMView, setIsPmView] = useState(false);
    const [open, setOpen] = useState(false);
    const [itemInfoOpen, setItemInfoOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [isView, setIsView] = useState(false);
    const [itemShowList, setItemShowList] = useState([]);
    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [copyFromOpen, setCopyFromOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isCopyFrom, setIsCopyFrom] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectedPart, setSelectedPart] = useState('');
    const [selectedPartId, setSelectedPartId] = useState(null);
    const [rowCountState, setRowCountState] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [itemSelected, setItemSelected] = useState('');
    const [selectedName, setSelectedName] = useState('');


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
            minWidth: 80,
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
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
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
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'tallyOrErp',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Tally / ERP Alias
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
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
            minWidth: 50,
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
            minWidth: 80, align: 'center', headerAlign: 'center'
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
            minWidth: 80, align: 'center', headerAlign: 'center'
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
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
                <ViewItem selectedRow={params.row} />,
            ],
        },
    ];


    useEffect(() => {

        ItemsDataShow({
            itemId: itemSelected || '',
            page: 0
        }, handleItemsDataShowSuccess, handleItemsDataShowException);

    }, [refreshData, itemSelected]);

    const handleItemsDataShowSuccess = (dataObject) => {
        setItemShowList(dataObject?.data || []);
        setRowCountState(dataObject?.totRows || 0);

    }

    const handleItemsDataShowException = (errorObject, errorMessage) => {
        console.log('error', errorMessage);
    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setOpen(true);
                    setEditeData(props.selectedRow);
                    setIsAddButton(false);
                    setIsView(false);
                }}
            />
        );
    }

    function ViewItem(props) {
        return (
            <RemoveRedEyeIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setOpen(true);
                    setEditeData(props.selectedRow);
                    // setIsAddButton(true);
                    setIsView(true);
                }}
            />
        );
    }


    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteDailogOpen(true);
                    setDeleteId(props.selectedRow.id);
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
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

    const options = itemShowListSeach.map(item => ({
        id: item?.id,
        label: item?.label
    }));


    const handleAutocompleteChange = (selectedValue) => {
        const selectedItem = itemShowList.find(item => item.id === selectedValue?.id);
        setItemShowList(selectedItem ? [selectedItem] : []);
        setItemSelected(selectedValue?.id)

    };

    const onPageChange = (newPage) => {
        setPage(newPage);
    };

    const textEntery = (e) => {

        ItemSearchNAAJ({
            text: e.target.value
        }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }

    const handleItemSearchNAAJSucees = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
    }

    const handleItemSearchNAAJException = () => {

    }

    const handlePageChange = (newPage) => {
        // console.log('New page:', newPage);
        // setPage(newPage);
        ItemsDataShow({
            itemId: '',
            page: newPage?.page
        }, handleItemsDataShowSuccess, handleItemsDataShowException);
    };


    const onPageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
    };

    return (
        <div style={{ height: '100%', width: '98%', marginLeft: '2%' }}>
            <PartMasterTitle style={{ marginTop: '5px', }}
                setIsAddButton={setIsAddButton}
                setEditeData={setEditeData}
                setOpen={setOpen}
                setCopyFromOpen={setCopyFromOpen}
                refreshData={refreshData}
                isCopyFrom={isCopyFrom}
                setIsCopyFrom={setIsCopyFrom}
                selectedName={selectedName}
                setSelectedName={setSelectedName}
                setIsPmView={setIsPmView}
                typeId={typeId}
                setTypeId={setTypeId}
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
                selectedPartId={selectedPartId}
                setSelectedPartId={setSelectedPartId}
            />

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '5px' }}>
                <PartMasterModule
                    isAddButton={isAddButton}
                    editData={editeData}
                    setEditeData={setEditeData}
                    open={open}
                    setOpen={setOpen}
                    setRefreshData={setRefreshData}
                    refreshData={refreshData}
                    isView={isView}
                    setIsView={setIsView}
                    setIsAddButton={setIsAddButton}
                    setIsCopyFrom={setIsCopyFrom}
                    isCopyFrom={isCopyFrom}
                    selectedName={selectedName}
                    setSelectedName={setSelectedName}
                    setIsPmView={setIsPmView}
                    isPMView={isPMView}
                    typeId={typeId}
                    setTypeId={setTypeId}
                    selectedPart={selectedPart}
                    setSelectedPart={setSelectedPart}
                    selectedPartId={selectedPartId}
                    setSelectedPartId={setSelectedPartId}
                />
            </div>

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
                deleteService={ItemDataDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

        </div >
    )
}

export default PartMasterResult