import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Fab,
  FormControl,
  Grid,
  TextField,
  CircularProgress
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import SupervisorTitle from "./SupervisorTitle";
import AddIcon from "@mui/icons-material/Add";
import NestingModuleTitle from "./NestingModuleTitle";
import MatrialModule from "./MatrialModule";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  MachineShowData,
  ScrapMstGetMaterial,
  ScrapMstGetThickness,
  SupervisorJcGetMachine,
  SupervisorJcGetMaterial,
  SupervisorJcNestShow,
  SupervisorJcNestShowData,
  SupervisorJcRqstMaterialData,
} from "../../ApiService/LoginPageService";
import NestingViewData from "./NestingViewData";
import Checkbox from "@mui/material/Checkbox";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import PDFViewer from "../../Utility/PDFViiewer";
import { useNavigate } from "react-router-dom";

const NestingModule = ({ setisNesting }) => {
  const [open, setOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [machinList, setMachineList] = useState([]);
  const [showDataList, setShowDataList] = useState([]);
  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [thicknessList, setthicknessList] = useState([]);
  const [selectedList, setSelected] = useState([]);
  const [arrayList, setArrayList] = useState([]);
  const [submitloading, setsubmitLoading] = useState(false);
  const [requestloading, setRequestloading] = useState(false);

  const [rawMaterial, setRawMaterial] = useState("");
  const [thickness, setThickness] = useState("");
  const [machineName, setMachineName] = useState("");

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const [nestList, setNetList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [fromDate, setFromdate] = useState("");
  const [toDate, setTodate] = useState("");

  const [materialList, setMaterialList] = useState([]);
  const [nestedId, setNestedId] = useState("");

  const [pdfOpen, setPdfOpen] = useState(false);
  const [fileTypeForView, setFileTypeForView] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);


  const navigate = useNavigate();



  const handleClickOpen = (fileUrl) => {
    setFileTypeForView(fileUrl);
    setPdfOpen(true);
  };

  useEffect(() => {
    SupervisorJcGetMaterial(
      handleMachineShowDataSuccess,
      handleMachineShowDataExceprion
    );
    // ScrapMstGetCategory(handleScrapMstGetCategorySuccess, handleScrapMstGetCategoryException);
    SupervisorJcGetMachine(
      handleScrapMstGetMaterialSuccess,
      handleScrapMstGetMaterialException
    );
    ScrapMstGetThickness(
      handleScrapMstGetThicknessSuccess,
      handleScrapMstGetThicknessException
    );
  }, []);

  // const handleSupervisorJcNestShowData = (dataObject) => {
  //   setShowDataList(dataObject?.data || []);
  //   setsubmitLoading(false)
  // };

  const handleSupervisorJcNestShowData = (dataObject) => {
    // Safely get data array
    const apiData = dataObject?.data || [];
  
    // ⭐ FIX: Add unique ID to each row
    const rowsWithId = apiData.map((item, index) => ({
      ...item,
      id: item.id ?? item.sNo ?? index + 1,   // important
    }));
  
    // Set data to DataGrid
    setShowDataList(rowsWithId);
  
    setsubmitLoading(false);
  };
  

  const handleSupervisorJcNestShowDataException = () => {
    setsubmitLoading(false)

  };

  const handleMachineShowDataSuccess = (dataObject) => {
    setMachineList(dataObject?.data || []);
  };

  const handleMachineShowDataExceprion = () => { };

  const handleScrapMstGetMaterialSuccess = (dataObject) => {
    setRawMaterialList(dataObject?.data || []);
  };

  const handleScrapMstGetMaterialException = () => { };

  const handleScrapMstGetThicknessSuccess = (dataObject) => {
    setthicknessList(dataObject?.data || []);
  };

  const handleScrapMstGetThicknessException = () => { };

  const options = machinList.map((item) => ({
    id: item?.id,
    label: item?.Material_Name,
  }));

  console.log("options==>", machinList);
  // const options1 = categoryList.map(item => ({
  //     id: item?.id,
  //     label: item?.category
  // }));

  const options3 = rawMaterialList.map((item) => ({
    id: item?.id,
    label: item?.Machine_name,
  }));
  console.log("options3==>", rawMaterialList);

  const options2 = thicknessList.map((item) => ({
    id: item?.id,
    label: item?.thickness,
  }));

  const selectAllData = (checked) => {
    if (checked) {
      setSelectedItems(showDataList); // select all rows
    } else {
      setSelectedItems([]); // deselect all rows
    }
  };
  
  
  const columns = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),

      type: "string",
      sortable: true,
      width: 150,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Date</span>
      ),

      type: "string",
      sortable: true,
      width: 150,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Nesting_no",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Nesting No</span>
      ),
      type: "string",
      sortable: true,
      width: 190,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "mrpMstId",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>MRP ID</span>
      ),
      type: "string",
      sortable: true,
      width: 150,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Kanbandate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Kanban Date</span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Machine_name",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Machine Name
        </span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Thickness",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Thickness</span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Material_Name",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Material Name
        </span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Qty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Sheet Qty</span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Dimension",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Sheet Size</span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "netWeight",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Net Weight</span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalQuantity",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Total Weight</span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "GRN_No",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>GRN No</span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "file",
    //   headerClassName: "super-app-theme--header",
    //   headerName: (
    //     <span style={{ fontWeight: "bold", fontSize: "16px" }}>File</span>
    //   ),
    //   type: "string",
    //   sortable: true,
    //   width: 100,
    // flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     const fileUrl = params.value;
    //     const fileExtension = fileUrl.split(".").pop().toLowerCase();

    //     let icon;
    //     switch (fileExtension) {
    //       case "pdf":
    //         icon = <PictureAsPdfIcon />;
    //         break;
    //       case "jpg":
    //       case "jpeg":
    //       case "png":
    //       case "gif":
    //         icon = <ImageIcon />;
    //         break;
    //       default:
    //         icon = <DescriptionIcon />;
    //         break;
    //     }

    //     return (
    //       <div
    //         onClick={() => handleClickOpen(fileUrl)}
    //         style={{ cursor: "pointer" }}
    //       >
    //         {icon}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   field: "file",
    //   headerClassName: "super-app-theme--header",
    //   headerName: (
    //     <span style={{ fontWeight: "bold", fontSize: "16px" }}>File</span>
    //   ),
    //   type: "string",
    //   sortable: true,
    //   width: 100,
    // flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     const fileUrl = params.value;

    //     if (fileUrl && typeof fileUrl === "string") {
    //       const fileExtension = fileUrl.split(".").pop().toLowerCase(); 
    //       let icon;
    //       switch (fileExtension) {
    //         case "pdf":
    //           icon = <PictureAsPdfIcon />;
    //           break;
    //         case "jpg":
    //         case "jpeg":
    //         case "png":
    //         case "gif":
    //           icon = <ImageIcon />;
    //           break;
    //         default:
    //           icon = <DescriptionIcon />;
    //           break;
    //       }

    //       return (
    //         <div
    //           onClick={() => handleClickOpen(fileUrl)} 
    //           style={{ cursor: "pointer" }} 
    //         >
    //           {icon} 
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <div style={{ cursor: "not-allowed", color: "#ccc" }}>
    //           <DescriptionIcon /> 
    //         </div>
    //       );
    //     }
    //   },
    // },
    {
      field: "actions",
      type: "actions",
      // flex: 1,
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      cellClassName: "actions",
      width: 200,
      disableClickEventBubbling: true,
      getActions: (params) => [
        <ViewData selectedRow={params.row} />,
        // <MaterialRequest selectedRow={params.row} />,
      ],
    },
    {
      field: "select",
      headerClassName: "super-app-theme--header",
      headerName: (
        <Checkbox
  checked={selectedItems.length === showDataList.length} // check if all selected
  onChange={(e) => selectAllData(e.target.checked)}
/>
      ),
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const isChecked = selectedItems.some(item => item.id === params.row.id);
    
        return (
          <Checkbox
            checked={isChecked}
            onChange={(e) =>
              handleRowSelect(params.row, e.target.checked)
            }
          />
        );
      }
    }
  ];


  const handleRowSelect = (row, isChecked) => {
    if (isChecked) {
      setSelectedItems(prev => {
        const exists = prev.some(item => item.id === row.id);
        if (!exists) return [...prev, row];
        return prev;
      });
    } else {
      setSelectedItems(prev =>
        prev.filter(item => item.id !== row.id)
      );
    }
  };
  
  



  function SelectAction(props) {
    const onSelectedItem = () => {
      if (arrayList.some((item) => item.id === props.selectedRow.id)) {
        setArrayList(
          arrayList.filter((item) => item.id !== props.selectedRow.id)
        );
      } else {
        setArrayList([...arrayList, props.selectedRow]);
      }
    };
    return (
      <div style={{ display: "flex" }}>
        <Checkbox
          checked={arrayList.some((item) => item.id === props.selectedRow.id)}
          onClick={onSelectedItem}
        />
      </div>
    );
  }

  useEffect(() => { }, [refreshData]);

  function ViewData(props) {
    return (
      <Button
        // variant="contained"
        style={{
          width: "50ox",
          // background: '#002D68', color: 'white'
        }}
        onClick={(e) => {
          setViewDetails(true);
          setNestedId(props.selectedRow?.Nesting_no);
        }}
      >
        <VisibilityIcon style={{ color: "black" }} />
      </Button>
    );
  }
  // <Fab
  //     style={{ background: '#002D68', color: 'white' }}
  //     variant="extended" size="medium" color="primary" aria-label="add"
  //     onChange={()=>{
  //         setOpen(true);
  //         console.log('trueeeeeeeeee')
  //     }}
  //     >
  //     <AddIcon sx={{ mr: 1 }} />
  //     Material Request
  // </Fab>

  function MaterialRequest(props) {
    return (
      <Button
        // variant="contained"
        style={{
          width: "250px",
          //  background: '#002D68', color: 'white'
        }}
        onClick={(e) => {
          setOpen(true);
          setMaterialList(props.selectedRow);
        }}
      >
        Material Request
      </Button>
    );
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleSupervisorJcNestShowSuccess = (dataObject) => {
    setNetList(dataObject?.data || []);
  };

  const handleSupervisorJcNestShowException = () => { };

  const options1 = [].map((item) => ({
    id: item?.id,
    label: item?.category,
  }));

  const handleMachineChange = (selectedValue) => {
    setMachineName(selectedValue?.label || "");
  };

  const handleThicknessChange = (selectedValue) => {
    setThickness(selectedValue?.label || "");
  };

  const handleMaterialChange = (selectedValue) => {
    setRawMaterial(selectedValue?.label || "");
  };

  // const onSubmit = () => {
  //   setRequestloading(true)
  //   SupervisorJcRqstMaterialData(
  //     {
  //       nestData: arrayList,
  //     },
  //     handleNpdExlReportDataSuccess,
  //     handleNpdExlReportDataException
  //   );
  // };

  const onSubmit = () => {
    console.log("Sending items --->", selectedItems);
  
    navigate("/NestingTransaction", {
      state: {
        selectedItems: selectedItems,
        fromSubmitButton: true,   // <---- ADD THIS FLAG
      },
    });
  };
  

  const handleNpdExlReportDataSuccess = (dataObject) => {
    setRequestloading(false)

    setArrayList([]);
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
    }, 3000);
    SupervisorJcNestShowData(
      {
        machine: machineName,
        material: rawMaterial,
        thickness: thickness,
        from: fromDate,
        to: toDate,
      },
      handleSupervisorJcNestShowData,
      handleSupervisorJcNestShowDataException
    );
  };

  const handleNpdExlReportDataException = (errorObject, errorMessage) => {
    setRequestloading(false)

    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
    }, 3000);
  };

  return (
    <div style={{ height: "60vh", width: "100%" }}>
      <NestingModuleTitle
      // setIsAddButton={setIsAddButton}
      // setEditData={setEditData}
      // setOpen={setOpen}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginLeft: "25px",
          marginTop: "-20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={2}>
            <TextField
              fullWidth
              label="From Date"
              placeholder="From Date"
              variant="filled"
              size="small"
              value={fromDate}
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
              onChange={(e) => {
                setFromdate(e.target.value || "");
              }}
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              fullWidth
              label="To Date"
              placeholder="To Date"
              variant="filled"
              size="small"
              value={toDate}
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
              onChange={(e) => {
                setTodate(e.target.value || "");
              }}
            />
          </Grid>
          <Grid item md={2}>
            {/* <TextField
                            fullWidth
                            label="Machine Name"
                            placeholder='Machine Name'
                            variant="filled"
                            size='small'
                            // required
                            InputLabelProps={{
                                shrink: true
                            }}
                            
                            onChange={(e) => {
                                setSelectedDate(e.target.value || '');
                            }}
                        /> */}
            <FormControl style={{ width: "100%" }}>
              <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-demo"
                size="small"
                options={options}
                renderInput={(params) => (
                  <TextField {...params} label="Search By Material Name" />
                )}
                onChange={(event, value) => handleMaterialChange(value)}
              />
            </FormControl>
          </Grid>
          <Grid item md={2}>
            {/* <TextField
                            fullWidth
                            label="Thickness"
                            placeholder='Thickness'
                            variant="filled"
                            size='small'
                            // required
                            InputLabelProps={{
                                shrink: true
                            }}

                            onChange={(e) => {
                                setSelectedDate(e.target.value || '');
                            }}
                        /> */}

            <FormControl style={{ width: "100%" }}>
              <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-demo"
                size="small"
                options={options2}
                // sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Search By Thickness" />
                )}
                onChange={(event, value) => handleThicknessChange(value)}
              />
            </FormControl>
          </Grid>
          <Grid item md={2}>
            {/* <TextField
                            fullWidth
                            label="Material Name"
                            placeholder='Material Name'
                            variant="filled"
                            size='small'
                            // required
                            InputLabelProps={{
                                shrink: true
                            }}

                            onChange={(e) => {
                                setSelectedDate(e.target.value || '');
                            }}
                        /> */}

            <FormControl style={{ width: "100%" }}>
              <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-demo"
                size="small"
                options={options3}
                // sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Search By Machine Name" />
                )}
                onChange={(event, value) => handleMachineChange(value)}
              />
            </FormControl>
          </Grid>

          <Grid
            item
            md={2}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              disabled={submitloading}
              onClick={(e) => {
                setsubmitLoading(true)
                SupervisorJcNestShowData(
                  {
                    machine: machineName,
                    material: rawMaterial,
                    thickness: thickness,
                    from: fromDate,
                    to: toDate,
                  },
                  handleSupervisorJcNestShowData,
                  handleSupervisorJcNestShowDataException
                );
              }}
            >
              {submitloading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : (
                "Load"
              )}
            </Button>
          </Grid>

          <Grid item md={12}>
            <Card
              style={{
                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                marginTop: "-10px",
                borderRadius: "10px",
                width: "98%",
                height: "100%",
                overflow: 'auto'
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <DataGrid
                      rows={showDataList}
                      columns={columns}
                      pageSize={8}
                      // loading={isLoading}
                      rowsPerPageOptions={[8]}
                      disableSelectionOnClick
                      style={{
                        border: "none",
                        fontWeight: "bold",
                        // minWidth: '50%',
                        height: "50vh",
                        width: '100%',
                        fontFamily: "Arial", // Set the font family to Arial
                      }}
                      sx={{
                        "& .super-app-theme--header": {
                          WebkitTextStrokeWidth: "0.6px",
                        },
                        "& .MuiDataGrid-cell": {
                          border: "1px solid #969696",
                        },
                        "& .MuiDataGrid-columnHeader": {
                          border: "1px solid #969696", // Add border to column headers
                        },
                        "& .super-app-theme--header": {
                          backgroundColor: "#93bce6",
                          color: "#1c1919",
                        },
                      }}
                      getRowClassName={(params) => {
                        // Find the index of the row within the rows array
                        const rowIndex = showDataList.findIndex(
                          (row) => row.id === params.row.id
                        );
                        // Check if the index is valid
                        if (rowIndex !== -1) {
                          console.log(" ");
                          return rowIndex % 2 === 0
                            ? "Mui-evenRow"
                            : "Mui-oddRow";
                        }
                        return ""; // Return default class if index is not found
                      }}
                      rowHeight={40}
                      columnHeaderHeight={40}
                    />
                  </Grid>
                  <PDFViewer
                    pdfOpen={pdfOpen}
                    setPdfOpen={setPdfOpen}
                    fileTypeForView={fileTypeForView}
                  />
                  <Grid
                    item
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        width: "150px",
                        background: "#002D68",
                        color: "white",
                        margin: "10px",
                      }}
                      disabled={requestloading}
                      onClick={onSubmit}
                    >
                      {requestloading ? (
                        <CircularProgress size={24} style={{ color: 'white' }} />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        width: "150px",
                        background: "#002D68",
                        color: "white",
                        margin: "10px",
                      }}
                      onClick={() => {
                        navigate("/NestingTransaction"); // 👈 navigate to module
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <MatrialModule
        materialList={materialList}
        open={open}
        setOpen={setOpen}
      />

      <NestingViewData
        open={viewDetails}
        setOpen={setViewDetails}
        nestedId={nestedId}
      />

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default NestingModule;
