import React from 'react'
import DeptMasterTools from './DeptMasterTools'
import { useState } from 'react';
import { Card, CardContent, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeptMasterModel from './DeptMasterModel';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

const DeptMasterList = () => {
  const [rows, setRows] = useState([]);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editDepartment, setEditDepartment] = useState([]);
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

  const columns = [
    {
      field: 'department',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Department
        </span>
      ),

      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Description
        </span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: 'left',
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
        <EditIcon style={{ color: '#002D68', cursor: 'pointer' }}
          onClick={(event) => {
            event.stopPropagation();
            setIsAddButton(false);
            setEditDepartment(props.selectedRow);
            setOpen(true);
          }}
        />
      </Tooltip>
    );
  }

  function DeleteData(props) {
    return (
      <Tooltip title="Delete">
        <DeleteIcon style={{ color: '#002D68', cursor: 'pointer' }}
          onClick={() => {
            setDeleteId(props.selectedRow.id);
            console.log(props.selectedRow.id);
            setDeleteDailogOpen(true);
          }}
        />
      </Tooltip>
    );
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
      <DeptMasterTools
        setIsAddButton={setIsAddButton}
        setEditDepartment={setEditDepartment}
        setOpen={setOpen}
      />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
          <CardContent>
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
                height: '50vh',
                // minHeight: '500px',
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
      </div>
      <DeptMasterModel
        isAddButton={isAddButton}
        editDepartment={editDepartment}
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

      {/* <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={QualityInsMstDelete}
        handleSuccess={handleDeleteSuccess}
        handleException={handleDeleteException}
      /> */}
    </div>
  )
}

export default DeptMasterList
