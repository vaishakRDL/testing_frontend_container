import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Button, Card, CardContent, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { COPQDelete, PriceMapChangeDelete, PriceMapChangeShowList, QualityInsMstDelete } from '../../ApiService/LoginPageService';
import ApplicationStore from '../../Utility/localStorageUtil';
import PriceMapTitle from './PriceMapTitle';
import PriceMapModel from './PriceMapModel';
import { useModuleLocks } from '../context/ModuleLockContext';

const PriceMapList = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "COPQ")?.lockStatus === "locked";

  const [rows, setRows] = useState([]);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editPriceMap, setEditPriceMap] = useState([]);
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
  const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "instrumentlist");

  useEffect(() => {
    PriceMapChangeShowList(handlePriceMapShow, handePriceMapException);
  }, [refreshData]);

  const handlePriceMapShow = (dataObject) => {
    setGridLoading(false);
    setRows(dataObject?.data || []);
  }

  const handePriceMapException = (errorStatus, errorMessage) => {
    console.log(errorMessage);
  }

  const generateRowsWithIndex = (rows) => {
    return rows.map((row, index) => ({ sNo: index + 1, ...row }));
  };

  const rowData = generateRowsWithIndex(rows);
  console.log("rowDatarowDatarowData", rowData);


  const columns = [
    {
      field: 'sNo',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Sl No
        </span>
      ),
      sortable: false,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',

    },
    {
      field: 'process',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Process

        </span>
      ),

      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'priceFrom',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Price From
        </span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'priceTo',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Price To
        </span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'rate',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Rate
        </span>
      ),
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



  function EditData(props) {
    return (
      <Tooltip title="Edit">
        <EditIcon
          style={{ color: userPermission[0]?.updateData === 0 || isModuleLocked ? 'gray' : '#000000' }}
          onClick={(event) => {
            if (userPermission[0]?.updateData === 1 && !isModuleLocked) {
              event.stopPropagation();
              setIsAddButton(false);
              setEditPriceMap(props.selectedRow);
              setOpen(true);
            }
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
            if (userPermission[0]?.deleteData === 1 && !isModuleLocked) {
              setDeleteId(props.selectedRow.id);
              setDeleteDailogOpen(true);
            }
          }}
        />
      </Tooltip>
    );
  }




  const handleDeleteSuccess = (dataObject) => {
    console.log(dataObject);
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
      <PriceMapTitle
        setIsAddButton={setIsAddButton}
        setEditPriceMap={setEditPriceMap}
        setOpen={setOpen}
      />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '98%', height: '100%' }}>
          <CardContent>
            <DataGrid
              rows={rowData}
              columns={columns}
              pageSize={8}
              loading={isLoading}
              rowsPerPageOptions={[8]}
              disableSelectionOnClick
              style={{ border: 'none', }}
              sx={{
                overflow: 'auto',
                height: '65vh',
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
                const rowIndex = rowData.findIndex(row => row.id === params.row.id);
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
          </CardContent>
        </Card>

      </div>
      <PriceMapModel
        isAddButton={isAddButton}
        editPriceMap={editPriceMap}
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
        deleteService={PriceMapChangeDelete}
        handleSuccess={handleDeleteSuccess}
        handleException={handleDeleteException}
      />
    </div>
  )
}

export default PriceMapList

