import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Card, CardContent, Typography } from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
// import CustomerTitle from './CustomerTitle';
// import CustomerModule from './CustomerModule';
import QualityTemplateTitle from "./QualityTemplateTitle";
import QualityTemplateModule from "./QualityTemplateModule";
// import AddMachineModule from './AddMachineModule';
// import { connect } from 'react-redux';
// import { changeUserName } from '../../Actions';
import {
  ShowMachine,
  MachineDelete,
  QualityTemplate,
} from "../../ApiService/LoginPageService";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import ApplicationStore from "../../Utility/localStorageUtil";
import { useModuleLocks } from "../context/ModuleLockContext";

const QualityTemplateResult = (props) => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Quality Template")?.lockStatus === "locked";

  const [open, setOpen] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editData, setEditData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setGridLoading] = useState(true);
  const [id, setId] = useState("");
  const [password, setConfirmPassword] = useState("");
  const [btnReset, setBtnReset] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [machineList, setMachineList] = useState([]);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [ProcessRow, setProcessrow] = useState([]);
  const [rows, setRows] = useState([]);

  const { userDetails } = ApplicationStore().getStorage('userDetails');
  const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "qualitytemplate");

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
      field: 'type',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Type
        </span>
      ),
      sortable: false,
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',

    },
    {
      field: "tempName",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Template Name
        </span>
      ),
      type: "number",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "process",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Process </span>
      ),
      type: "number",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "description",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Description{" "}
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      type: "actions",
      headerClassName: 'super-app-theme--header',
      flex: 1,
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions </span>
      ),
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        <EditData selectedRow={params.row} />,
        <NextPage selectedRow={params.row} />,
        // <Link to='/QualityResults'><Typography>View QC field</Typography></Link>
        // <Link >Template</Link>
        // <DeleteData selectedRow={params.row} />,
      ],
    },
  ];

  // useEffect(() => {
  //     ShowMachine(handleSucessShow, handleExceptionShow)
  // }, [refreshData]);

  const handleSucessShow = (dataObject) => {
    setMachineList(dataObject?.data || []);
    // setGridLoading(false);
    console.log("dataObject", dataObject);
  };
  const handleExceptionShow = (errorObject, errorMessage) => { };

  useEffect(() => {
    QualityTemplate(
      handlePOGenerateServicesSuccess,
      handlePOGenerateServicesExceptoin
    );
  }, [refreshData]);

  const handlePOGenerateServicesSuccess = (dataObject) => {
    setRows(dataObject?.data || []);
  };

  const handlePOGenerateServicesExceptoin = (errorObject, errorMessage) => {
    console.log("error Msg", errorMessage);
  };

  function EditData(props) {
    return (
      <EditIcon
        style={{ color: userPermission[0]?.updateData === 0 || isModuleLocked ? 'gray' : '#000000' }}
        onClick={() => {
          if (userPermission[0]?.updateData === 1 && !isModuleLocked) {
            setIsAddButton(false);
            setEditData(props.selectedRow);
            setOpen(true);
          }
        }}
      />
    );
  }

  // function NextPage(props) {
  //   return (
  //     <Link to={`/QualityResults?id=${props?.selectedRow?.id}&&processId=${props?.selectedRow?.processId}`}>
  //       <Typography>View QC field</Typography>
  //     </Link>
  //   );
  // }
  function NextPage(props) {
    if (isModuleLocked) {
      return (
        <Typography color="gray">View QC field</Typography>
      );
    }

    return (
      <Link
        to={`/QualityResults?id=${props?.selectedRow?.id}&processId=${props?.selectedRow?.processId}`}
      >
        <Typography>View QC field</Typography>
      </Link>
    );
  }


  function DeleteData(props) {
    return (
      <DeleteIcon
        onClick={() => {
          if (userPermission[0]?.deleteData === 1 && !isModuleLocked)
            setDeleteId(props.selectedRow.id);
          setDeleteDailogOpen(true);
        }}
        style={{ color: "black" }}
      />
    );
  }

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
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
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const generateRowsWithIndex = (rows) => {
    return rows.map((row, index) => ({ sNo: index + 1, ...row }));
  };

  const rowData = generateRowsWithIndex(rows);
  console.log("rowDatarowDatarowData", rowData);



  return (
    <div style={{ height: "60vh", width: "100%" }}>
      {/* <h2>{props.name}</h2>
            <button onClick={()=>props.changeUserName()}>Click me</button> */}
      <QualityTemplateTitle
        setIsAddButton={setIsAddButton}
        setEditData={setEditData}
        setOpen={setOpen}
      />
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: '-30px' }}>
        <Card
          style={{
            boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
            marginTop: "20px",
            borderRadius: "10px",
            width: "98%",
            height: "100%",
          }}
        >
          <CardContent>
            <DataGrid
              rows={rowData}
              columns={columns}
              pageSize={8}
              // loading={isLoading}
              rowsPerPageOptions={[8]}
              disableSelectionOnClick
              style={{ border: "none" }}
              sx={{
                overflow: "auto",
                height: "65vh",
                // minHeight: '500px',
                width: "100%",
                "& .super-app-theme--header": {
                  WebkitTextStrokeWidth: "0.6px",
                  backgroundColor: '#93bce6',
                  color: '#1c1919'

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

      <QualityTemplateModule
        isAddButton={isAddButton}
        editData={editData}
        open={open}
        setOpen={setOpen}
        setRefreshData={setRefreshData}
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
        deleteService={MachineDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
    </div>
  );
};

export default QualityTemplateResult;
// const mapStateToProps = ({ config }) => {
//     const { name } = config;
//     return { name }
// }
// export default connect(mapStateToProps, { })(CustomerResult);
