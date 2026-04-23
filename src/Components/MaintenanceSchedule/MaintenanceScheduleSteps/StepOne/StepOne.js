import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// import {
//   DepartmentShowdata,
//   FetchAssetTypeSec,
//   FetchAsstTypeAsset,
//   MaintenanceShudeleName,
//   ShowChecklistDropDown,
//   viewwarrentyStatus,
//   FetchErpToolsService
// } from "../../../../Services/NodeJsApiServices";

const columns = [
  { field: "AMCStatus", headerName: "AMC Status", flex: 1, headerAlign: "center" },
  { field: "WarrantyStatus", headerName: "Warranty Status", flex: 1, headerAlign: "center" },
  { field: "WarrantyType", headerName: "Warranty Type", flex: 1, headerAlign: "center" }
];

const StepOne = ({
  Machine,
  setMachine,
  setSelectedMachineName,
  machineId,
  Rowsection,
  RowassetType,
  Department,
  setCheckList,
  setToolNo,   // <<< ADD THIS PROP FROM PARENT
  assetType,
  setAssetType,
  setAssetTypeName
}) => {

  const [machineOptions, setMachineOptions] = useState([]);
  const [rows, setRows] = useState([]);

  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);

  const [section, setSection] = useState("");
  const [sectionList, setSectionList] = useState([]);


  const [assetTypeList, setAssetTypeList] = useState([]);

  const [isToolMode, setIsToolMode] = useState(false);

  // ---------------- Department ----------------
  useEffect(() => {
    // DepartmentShowdata(handleDepartmentshow, () => { });
  }, []);

  const handleDepartmentshow = (dataObject) => {
    setDepartmentList(dataObject?.data);
  };

  const onDepartmentChange = (e) => {
    setDepartment(e.target.value);
    // FetchAssetTypeSec({ id: e.target.value }, handleSectionSuccess, () => { });
  };

  const handleSectionSuccess = (dataObject) => {
    setSectionList(dataObject.data);
  };

  // ---------------- Section ----------------
  const onSectionChange = (e) => {
    setSection(e.target.value);
    // FetchAsstTypeAsset({ id: e.target.value }, handleAssetTypeSuccess, () => { });
  };

  const handleAssetTypeSuccess = (dataObject) => {
    setAssetTypeList(dataObject.data);
  };

  // ---------------- Asset Type (MAIN LOGIC) ----------------
  const onAssetTypeChange = (e) => {
    const selectedId = e.target.value;
    setAssetType(selectedId);

    const selectedTypeObj = assetTypeList.find(a => a.id === selectedId);

    // ⭐ SEND STRING TO PARENT
    setAssetTypeName(selectedTypeObj?.AssetTypeView || "");





    // TOOL ASSET SELECTED
    if (selectedTypeObj?.AssetTypeView?.toLowerCase().includes("tool")) {

      setIsToolMode(true);
      setRows([]);
      setSelectedMachineName(null);

      // fetch ERP tools
      // FetchErpToolsService(handleToolSuccess, handleToolException);

    } else {

      // NORMAL MACHINE / ASSET
      setIsToolMode(false);

      // MaintenanceShudeleName(
      //   { assetTypeId: selectedId },
      //   handleMachineSuccess,
      //   () => setMachineOptions([])
      // );
    }
  };

  // ---------------- ERP TOOL SUCCESS ----------------
  const handleToolSuccess = (dataObject) => {

    const tools = dataObject.data.map(tool => ({
      id: tool.id,
      name: `${tool.toolNo} - ${tool.toolName}`,
      toolNo: tool.toolNo,
      type: "tool"
    }));

    setMachineOptions(tools);
  };

  const handleToolException = () => {
    setMachineOptions([]);
  };

  // ---------------- MACHINE SUCCESS ----------------
  const handleMachineSuccess = (dataObject) => {

    const newOptions = dataObject.data.map(item => {
      if (item.machine_name) {
        return {
          id: item.id,
          name: item.machine_name,
          type: "machine",
          machine_tag: item.machine_tag
        };
      } else {
        return {
          id: item.id,
          name: item.assetName,
          type: "asset"
        };
      }
    });

    setMachineOptions(newOptions);
  };

  // ---------------- SELECT DROPDOWN ----------------
  const handleSelectChange = (event) => {

    const selectedId = event.target.value;
    setMachine(selectedId);

    const selectedOption = machineOptions.find(
      option => option.id === selectedId
    );

    if (!selectedOption) return;

    // TOOL SELECTED
    if (selectedOption.type === "tool") {

      setSelectedMachineName(null);
      setRows([]);
      setToolNo(selectedOption.toolNo); // <<< SAVE TOOL NUMBER
      return;
    }

    // MACHINE OR ASSET
    setToolNo(null);
    setSelectedMachineName(selectedOption.name);

    // viewwarrentyStatus(
    //   { id: selectedId, MachineName: selectedOption.name },
    //   (dataObject) => setRows([dataObject.data]),
    //   () => { }
    // );

    if (selectedOption.machine_tag) {
      // ShowChecklistDropDown(
      //   { machineTag: selectedOption.machine_tag },
      //   (d) => setCheckList(d.data),
      //   () => { }
      // );
    }
  };

  // ---------------- UI ----------------
  return (
    <Card sx={{ marginTop: "15px" }}>
      <CardContent>

        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Status
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>

          {/* Department */}
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select value={department} label="Department" onChange={onDepartmentChange}>
                {departmentList?.map(d =>
                  <MenuItem key={d.id} value={d.id}>{d.departmentName}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Section */}
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Section</InputLabel>
              <Select value={section} label="Section" onChange={onSectionChange}>
                {sectionList?.map(s =>
                  <MenuItem key={s.id} value={s.id}>{s.Section}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* AssetType */}
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Asset Type</InputLabel>
              <Select value={assetType} label="Asset Type" onChange={onAssetTypeChange}>
                {assetTypeList?.map(a =>
                  <MenuItem key={a.id} value={a.id}>{a.AssetTypeView}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Machine / Tool Dropdown */}
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{isToolMode ? "Tool Number" : "Machine Name"}</InputLabel>
              <Select value={Machine} label="Machine" onChange={handleSelectChange}>
                {machineOptions?.map(opt =>
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

        </Grid>

        {/* Warranty Grid */}
        {!isToolMode && (
          <Box sx={{ height: 300 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Box>
        )}

      </CardContent>
    </Card>
  );
};

export default StepOne;
