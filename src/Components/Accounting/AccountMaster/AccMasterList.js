import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button, Card, CardContent, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AccMasterTools from './AccMasterTools';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import AccMasterModel from './AccMasterModel';
import { MstTransporterDelete, MstTransporterShowData } from '../../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import ApplicationStore from '../../../Utility/localStorageUtil';
import { useModuleLocks } from '../../context/ModuleLockContext';

const AccMasterList = () => {

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Transporter Master")?.lockStatus === "locked";

  const [rows, setRows] = useState([]);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editTransporter, setEditTransporter] = useState([]);
  const [open, setOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [isLoading, setGridLoading] = useState(true);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  const { userDetails } = ApplicationStore().getStorage('userDetails');
  const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "transporterlist");

  const columns = [
    {
      field: 'transportName',
      headerClassName: 'super-app-theme--header',
      headerName: 'Transporter',
      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'gstin',
      headerClassName: 'super-app-theme--header',
      headerName: 'GSTIN',
      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'discription',
      headerClassName: 'super-app-theme--header',
      headerName: 'Description',
      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerClassName: 'super-app-theme--header',
      type: 'actions',
      flex: 1,
      headerName: 'Actions',
      cellClassName: 'actions',
      disableClickEventBubbling: true,
      getActions: (params) => [
        <EditData selectedRow={params.row} />,
        <DeleteData selectedRow={params.row} />,
      ],
    },
  ];

  useEffect(() => {
    MstTransporterShowData(handleTransporterShow, handeTransporterException);
  }, [refreshData]);

  const handleTransporterShow = (dataObject) => {
    setGridLoading(false);
    setRows(dataObject?.data || []);
  }

  const handeTransporterException = (errorStatus, errorMessage) => {
    console.log(errorMessage);
  }

  function EditData(props) {
    return (
      <Tooltip title="Edit">
        <EditIcon
          style={{ color: userPermission[0]?.updateData === 0 || isModuleLocked ? 'gray' : '#000000' }}
          onClick={(event) => {
            if (isModuleLocked) return
            event.stopPropagation();
            setIsAddButton(false);
            setEditTransporter(props.selectedRow);
            setOpen(true);

          }}
        />
      </Tooltip>
    );
  }

  function DeleteData(props) {
    return (
      <Tooltip title="Delete">
        <DeleteIcon
          style={{ color: userPermission[0]?.deleteData === 0 || isModuleLocked ? 'gray' : '#000000' }}
          onClick={() => {
            if (isModuleLocked) return
            setDeleteId(props.selectedRow.id);
            setDeleteDailogOpen(true);

          }}
        />
      </Tooltip>
    );
  }

  const DeleteFunction = () => {
    MstTransporterDelete(handleDeleteSuccess, handleDeleteException);
  }

  const handleDeleteSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      setDeleteDailogOpen(false);
    }, 2000);
    setRefreshData(oldValue => !oldValue);
  }

  const handleDeleteException = (errorObject, message) => {
    console.log(message);
    setNotification({
      status: true,
      type: 'error',
      message: message,
    });
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  return (
    <div style={{ height: '60vh', width: '100%' }}>
      <AccMasterTools
        setIsAddButton={setIsAddButton}
        setEditTransporter={setEditTransporter}
        setOpen={setOpen}
      />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '98%', height: '100%' }}>
          <CardContent>
            <Box
              sx={{
                height: '150%',
                width: '100%',
                '& .super-app-theme--header': {
                  backgroundColor: '#93bce6',
                  color: '#1c1919'
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={8}
                loading={isLoading}
                rowsPerPageOptions={[8]}
                disableSelectionOnClick
                style={{ border: 'none', }}
                sx={{
                  overflow: 'auto',
                  height: '68vh',
                  // minHeight: '500px',
                  width: '100%',
                  '& .super-app-theme--header': {
                    WebkitTextStrokeWidth: '0.6px',

                  },
                  '& .MuiDataGrid-cell': {
                    border: '1px solid #969696',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    border: '1px solid #969696',
                  },
                }}
                getRowClassName={(params) => {
                  const rowIndex = rows.findIndex(row => row.id === params.row.id);
                  if (rowIndex !== -1) {
                    console.log(' ');
                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                  }
                  return '';
                }}
                rowHeight={40}
                columnHeaderHeight={40}
              />
            </Box>
          </CardContent>
        </Card>
      </div>
      <AccMasterModel
        isAddButton={isAddButton}
        editTransporter={editTransporter}
        open={open}
        setOpen={setOpen}
        setRefreshData={setRefreshData}
        handleClose={handleClose}
        openNotification={openNotification}
        setNotification={setNotification}
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
        deleteService={MstTransporterDelete}
        handleSuccess={handleDeleteSuccess}
        handleException={handleDeleteException}
      />
    </div>
  )
}

export default AccMasterList

