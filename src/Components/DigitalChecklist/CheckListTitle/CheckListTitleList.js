import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useModuleLocks } from "../../context/ModuleLockContext";

const CheckListTitleList = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Checklist Title")?.lockStatus === "locked";

  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [checkListTitle, setCheckListTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);

  const onDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const columns = [
    {
      field: "department",
      headerClassName: "super-app-theme--header",
      headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Department</span>,
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "checkListTitle",
      headerClassName: "super-app-theme--header",
      headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>CheckList Title</span>,
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerClassName: "super-app-theme--header",
      headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Description</span>,
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Typography sx={{ fontFamily: "Roboto Slab", fontWeight: "bold", marginBottom: "20px" }} variant="h5">
        Checklist Title
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <FormControl fullWidth>
              <InputLabel id="department-select-label">Department</InputLabel>
              <Select
                labelId="department-select-label"
                id="department-select"
                value={department}
                label="Department"
                size="small"
                style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                onChange={onDepartmentChange}
              >
                {departmentList.map((data, index) => (
                  <MenuItem value={data.id} key={index}>
                    {data.slNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <TextField
              fullWidth
              label="CheckList Title"
              placeholder="CheckList Title"
              variant="outlined"
              required
              size="small"
              style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
              onChange={(e) => setCheckListTitle(e.target.value)}
              value={checkListTitle}
            />
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <TextField
              fullWidth
              label="Description"
              placeholder="Description"
              variant="outlined"
              required
              size="small"
              style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <Button variant="contained" disabled={isModuleLocked} type="submit"
              style={{ height: "40px", backgroundColor: isModuleLocked ? "gray" : "#002d68" }}

            >
              Add
            </Button>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12 }>
        <Typography sx={{ fontFamily: "Roboto Slab", fontWeight: "bold", marginBottom: "20px" }} variant="h5">
                Checklist Title List
              </Typography>
        </Grid> */}
        <Grid item xs={12} marginTop={2}>
          <Card style={{ boxShadow: "0 10px 10px rgba(0, 0, 0, 0.2)", borderRadius: "10px", border: "1px solid black" }}>
            <CardContent>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={8}
                style={{ height: "400px" }}
                rowsPerPageOptions={[8]}
                disableSelectionOnClick
                rowHeight={40}
                columnHeaderHeight={40}
              />
            </CardContent>
          </Card>
        </Grid>
      </form>
    </div>
  );
};

export default CheckListTitleList;
