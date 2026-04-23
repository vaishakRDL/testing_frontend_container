import { Autocomplete, Button, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetSupplierPendingPo, GetSupplierPendingDC } from '../../../ApiService/LoginPageService';

const LoadPendingPO = ({ pendingPOModalOpen, setPendingPOModalOpen, setBillingAddress, supplierSid, globleId, setSupplierItemList, supplierId, setSelectedItems, selectedItems, pruchaseOrderDigit, genPoBillFlag, poType }) => {
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });
  const [suppAllAddressList, setSuppAllAddressList] = useState([]);
  const [supplierPendingPoList, setSupplierPendingPoList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPendingPo, setSelectedPendingPo] = useState([]);
  const [visibleRows, setVisibleRows] = useState(supplierPendingPoList);
  console.log("selectedPendingPo", selectedPendingPo);
  const apiRef = useGridApiRef();
  // PENDING PO COLUMN
  const pendingPoColumns = [
    {
      field: 'spCode',
      headerClassName: 'super-app-theme--header',
      headerName: 'SUPP Code',
      type: 'string',
      sortable: true,
      // minWidth: 40,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'suppName',
      headerClassName: 'super-app-theme--header',
      headerName: 'SUPPName',
      type: 'string',
      sortable: true,
      // minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'mainPoNo',
      headerClassName: 'super-app-theme--header',
      headerName: 'PO No',
      type: 'string',
      sortable: true,
      // minWidth: 60,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'date',
      headerClassName: 'super-app-theme--header',
      headerName: 'PO Date',
      type: 'string',
      sortable: true,
      // minWidth: 60,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'schDate',
      headerClassName: 'super-app-theme--header',
      headerName: 'Sch Date',
      type: 'string',
      sortable: true,
      // minWidth: 60,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'pendingPo',
      headerClassName: 'super-app-theme--header',
      headerName: 'Pending PO',
      type: 'string',
      sortable: true,
      // minWidth: 60,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'itemCode',
      headerClassName: 'super-app-theme--header',
      headerName: 'SITEMCode',
      type: 'string',
      sortable: true,
      // minWidth: 140,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'itemName',
      headerClassName: 'super-app-theme--header',
      headerName: 'SITEM Name',
      type: 'string',
      sortable: true,
      // minWidth: 140,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'itemGroup',
      headerClassName: 'super-app-theme--header',
      headerName: 'Item Group Code',
      type: 'string',
      sortable: true,
      // minWidth: 110,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'uom',
      headerClassName: 'super-app-theme--header',
      headerName: 'UOM Code',
      type: 'string',
      sortable: true,
      // minWidth: 40,
      align: 'center',
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: 'poQty',
      headerClassName: 'super-app-theme--header',
      headerName: 'PO QTY',
      type: 'string',
      sortable: true,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'select',
      headerName: 'Select',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderHeader: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
          <span style={{ marginLeft: '5px', fontSize: '15px' }}>Select All</span>
        </div>
      ),
      renderCell: (params) => (
        <Checkbox
          checked={!!params.row.select}
          onChange={(e) => {
            const checked = e.target.checked;

            // Update only the clicked row
            const updatedRows = supplierPendingPoList.map((row) =>
              row.id === params.row.id ? { ...row, select: checked } : row
            );

            setSupplierPendingPoList(updatedRows);

            // Update selected list
            const selectedOnly = updatedRows.filter((row) => row.select);
            setSelectedPendingPo(selectedOnly);

            // Sync "Select All"
            const allVisibleSelected =
              visibleRows.length > 0 &&
              visibleRows.every(
                (r) => updatedRows.find((u) => u.id === r.id)?.select
              );
            setSelectAll(allVisibleSelected);
          }}
        />
      ),
    }

  ];

  // const handleSelectAllChange = (event) => {
  //     setSelectAll(event.target.checked);
  //     const updatedRows = supplierPendingPoList.map((row) => ({ ...row, select: event.target.checked }));
  //     let newArray = [...updatedRows];

  //     setSupplierPendingPoList(newArray);
  //     if (event.target.checked) {
  //         setSelectedPendingPo(newArray);
  //     } else {
  //         setSelectedPendingPo([]);
  //     }
  // };


  // Instead of using full supplierPendingPoList, filter the currently displayed rows
  // ✅ Fix Select All (only selects visible rows)
  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);

    const updatedRows = supplierPendingPoList.map((row) =>
      visibleRows.some(vr => vr.id === row.id)
        ? { ...row, select: event.target.checked }
        : row
    );

    setSupplierPendingPoList(updatedRows);

    if (event.target.checked) {
      setSelectedPendingPo(visibleRows.map(row => ({ ...row, select: true })));
    } else {
      setSelectedPendingPo([]);
    }
  };


  const handleStateChange = (params) => {
    const filteredIds = params.filter.filteredRowsLookup;
    const newVisibleRows = supplierPendingPoList.filter(
      (row) => filteredIds[row.id] !== false
    );
    setVisibleRows(newVisibleRows);
  };


  // function Selector(props) {
  //     const handleChange = (e) => {
  //         if (e.target.checked) {
  //             setSelectedPendingPo([...selectedPendingPo, props.selectedRow]);
  //         } else {
  //             const filteredArray = selectedPendingPo.filter((item) => item.id !== props.selectedRow.id);
  //             setSelectedPendingPo(filteredArray);
  //         }

  //         const updatedList = supplierPendingPoList.map((process) =>
  //             process.id === props.selectedRow.id
  //                 ? {
  //                     ...process,
  //                     select: e.target.checked
  //                 }
  //                 : process
  //         );
  //         setSupplierPendingPoList(updatedList);
  //     }

  //     return (
  //         <Checkbox
  //             checked={props.selectedRow.select}
  //             onChange={handleChange}
  //         />
  //     );
  // }


  const Selector = ({ selectedRow }) => {
    const handleChange = (e) => {
      const checked = e.target.checked;

      // update only this row
      const updatedRows = supplierPendingPoList.map((row) =>
        row.id === selectedRow.id ? { ...row, select: checked } : row
      );

      setSupplierPendingPoList(updatedRows);

      // update selected list
      const selectedOnly = updatedRows.filter(row => row.select);
      setSelectedPendingPo(selectedOnly);

      // keep "Select All" synced
      const allVisibleSelected =
        visibleRows.length > 0 &&
        visibleRows.every(r => updatedRows.find(u => u.id === r.id)?.select);
      setSelectAll(allVisibleSelected);
    };

    return (
      <Checkbox
        checked={!!selectedRow.select}
        onChange={handleChange}
      />
    );
  };


  useEffect(() => {
    if (genPoBillFlag) {
      pendingPOModalOpen && GetSupplierPendingPo({ poDigit: pruchaseOrderDigit }, handleSuppPOSucessShow, handleSuppPOExceptionShow);
    } else {
      pendingPOModalOpen && poType === 'R' && GetSupplierPendingPo({ supTabId: supplierId }, handleSuppPOSucessShow, handleSuppPOExceptionShow);
    }

    if (poType === 'J') {
      pendingPOModalOpen && GetSupplierPendingDC({ supTabId: supplierId }, handleSuppPOSucessShow, handleSuppPOExceptionShow);
    }
  }, [pendingPOModalOpen])

  // GET SUPPLIER LIST
  const handleSuppPOSucessShow = (dataObject) => {
    setSupplierPendingPoList(dataObject?.data || []);
  }
  const handleSuppPOExceptionShow = (errorObject, errorMessage) => {
  }

  const handleRowClick = (params) => {
    // console.log("handleRowClick", params.row)
    // setSelectedItems([...selectedItems, params.row]);
    // // setBillingAddress(params.row.address);
    // setPendingPOModalOpen(false);
  }

  // const handleSubmitClick = () => {
  //     setPendingPOModalOpen(false);
  //     setSelectAll(false);
  //     setSelectedItems(selectedPendingPo);
  //     setTimeout(() => {
  //         setSelectedPendingPo([])
  //     }, 1000)
  // }
  // const handleSubmitClick = () => {
  //     setPendingPOModalOpen(false);
  //     setSelectAll(false);

  //     // Merge new with old
  //     setSelectedItems((prevSelectedItems) => {
  //         const merged = [
  //             ...prevSelectedItems,
  //             ...selectedPendingPo.filter(
  //                 (newItem) => !prevSelectedItems.some((oldItem) => oldItem.id === newItem.id)
  //             )
  //         ];
  //         return merged;
  //     });

  //     setTimeout(() => {
  //         setSelectedPendingPo([]);
  //     }, 1000);
  // };

  // ✅ Fix Submit (only push selected rows, not all)
  const handleSubmitClick = () => {
    setPendingPOModalOpen(false);
    setSelectAll(false);

    // only send rows that are actually selected
    const selectedOnly = supplierPendingPoList.filter(row => row.select);

    setSelectedItems((prevSelectedItems) => {
      const merged = [
        ...prevSelectedItems,
        ...selectedOnly.filter(
          (newItem) => !prevSelectedItems.some((oldItem) => oldItem.id === newItem.id)
        )
      ];
      return merged;
    });

    setTimeout(() => {
      setSelectedPendingPo([]);
    }, 500);
  };


  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
      maxWidth="xl"
      open={pendingPOModalOpen}
    >

      <DialogTitle style={{ background: '#002D68', color: 'white' }}>
        Select Pending Purchase Order
      </DialogTitle>
      <DialogContent>
        <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
          <Grid container >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
              <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                <CardContent>
                  <DataGrid
                    apiRef={apiRef}
                    rows={supplierPendingPoList}
                    columns={pendingPoColumns}
                    pageSize={8}
                    // selectionModel={selectionModel}
                    // onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                    rowsPerPageOptions={[8]}
                    onStateChange={handleStateChange}
                    // disableSelectionOnClick
                    onRowClick={handleRowClick} // Add this line to handle row clicks
                    style={{ border: 'none' }}
                    sx={{
                      overflow: 'auto',
                      height: '43vh',
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
                    rowHeight={40}
                    columnHeaderHeight={40}
                    getRowClassName={(params) => {
                      const rowIndex = supplierPendingPoList.findIndex(row => row.id === params.row.id);
                      if (rowIndex !== -1) {
                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                      }
                      return '';
                    }}


                  />
                </CardContent>

              </Card>
            </Grid>
          </Grid>

          <DialogActions>
            <Button
              variant="contained"
              style={{ width: '150px', background: '#002D68', color: 'white' }}
              // type="submit"
              onClick={handleSubmitClick}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              style={{ width: '150px', background: '#002D68', color: 'white' }}
              onClick={(e) => {
                setPendingPOModalOpen(false);
                setSelectedPendingPo([]);
                // ClearData();
              }}
            >
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>

      <NotificationBar
        // handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Dialog>
  )
}

export default LoadPendingPO
