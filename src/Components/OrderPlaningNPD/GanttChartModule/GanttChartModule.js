import React, { useState, useEffect } from "react";
import { ViewMode, Gantt, TaskListTooltip } from "gantt-task-react";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";
import { Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Link, useNavigate } from 'react-router-dom';
import { GetPlanningMachine, GetGanttChartData } from '../../../ApiService/LoginPageService';

const emptyData = [
  {
    start: "0",
    end: "0",
    name: "No data selected",
    id: 1,
    progress: 100,
    type: "project",
    quantity: "",
    cycleTime: "",
    // hideChildren: false
  }]

const convertedData = emptyData.map(item => ({
  ...item,
  start: item.start ? new Date(item.start) : null,
  end: item.end ? new Date(item.end) : null
}));

const GanttChartModule = () => {
  const [view, setView] = React.useState(ViewMode.Day);
  const [tasks, setTasks] = React.useState(convertedData);
  const [isChecked, setIsChecked] = React.useState(true);
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machineName, setMachineName] = useState('');
  const navigate = useNavigate();
  const [machineList, setMachineList] = useState([])
  const [dataArray, setDataArray] = useState([]);
  const [isAllSelect, setIsAllSelect] = useState(true)

  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  useEffect(() => {
    GetPlanningMachine(handlePlanningMachineSuccess, handlePlanningMachineFailed)
  }, []);

  const handlePlanningMachineSuccess = (dataObject) => {
    setMachineList(dataObject?.data || []);
  }
  const handlePlanningMachineFailed = (errorObject, errorMessage) => {

  }

  const handleSubmitPress = () => {
    const newDataObject = {
      start: new Date(selectedFromDate),
      end: new Date(selectedToDate),
      name: machineName,
      machineName: machineName,
      id: 1,
      progress: 100,
      type: "project",
      quantity: "0",
      cycleTime: "0",
    };
    // Update the array of objects
    setDataArray([newDataObject]);

    GetGanttChartData({
      fromDate: selectedFromDate,
      toDate: selectedToDate,
      machineId: isAllSelect ? '' : selectedMachine
    }, showPlanningMachineSuccess, showPlanningMachineFailed)
  }

  // const showPlanningMachineSuccess = (dataObject) => {
  //   const apiData = dataObject?.data || [];
  //   // const convertedData = apiData.legth > 0 ? apiData : emptyData.map(item => ({
  //   const convertedDatas = apiData.map(item => ({
  //     ...item,
  //     start: item.start ? new Date(item.start) : null,
  //     end: item.end ? new Date(item.end) : null
  //   }));

  //   // setGanttListData(dataObject?.data || []);
  //   setTasks(convertedDatas);
  //   // console.log("dataObject?.data", dataObject?.data)
  // }

  const showPlanningMachineSuccess = (dataObject) => {
    const apiData = dataObject?.data || [];
    const convertedDatas = apiData.map(item => ({
      ...item,
      start: item.start ? new Date(item.start) : null,
      end: item.end ? new Date(item.end) : null
    }));
    setTasks(convertedDatas);
  }

  const showPlanningMachineFailed = (errorObject, errorMessage) => {
  }

  const handleExpanderClick = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  const taskTooltip = ({ task }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
    }}>
      {task?.machineName && <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ fontWeight: 'bold', marginRight: '4px', fontFamily: 'Roboto Slab' }}>Machine Name:</div>
        <div>{task.machineName}</div>
      </div>}
      {task?.jcName && <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ fontWeight: 'bold', marginRight: '4px', fontFamily: 'Roboto Slab' }}>JobCard No:</div>
        <div>{task.jcName}</div>
      </div>}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ fontWeight: 'bold', marginRight: '4px', fontFamily: 'Roboto Slab' }}>Quantity:</div>
        <div>{task.quantity}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ fontWeight: 'bold', marginRight: '4px', fontFamily: 'Roboto Slab' }}>Cycle Time:</div>
        <div>{task.cycleTime}</div>
      </div>
    </div>
  );

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <Grid container spacing={2} style={{ backgroundColor: '#ffffff', paddingLeft: '20px' }}>

        <Grid item xs={12} sm={12} md={1} lg={1} xl={1} style={{ marginBottom: '20px', marginTop: '20px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
          <Button
            variant="contained"

            style={{
              backgroundColor: '#e1e2e5',
              color: '#000000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => {
              navigate(`/OrderPlaningResult`);
            }}
          >
            <KeyboardDoubleArrowLeftIcon style={{ marginRight: '4px' }} />

          </Button>
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ marginBottom: '20px', marginTop: '20px' }} >
          <TextField
            fullWidth
            label="From Date"
            placeholder='From Date'
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            type='date'
            value={selectedFromDate}
            onChange={(e) => {
              setSelectedFromDate(e.target.value)
            }}
            required
            inputProps={{ max: selectedToDate }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ marginBottom: '20px', marginTop: '20px' }} >
          <TextField
            fullWidth
            label="To Date"
            placeholder='To Date'
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            type='date'
            value={selectedToDate}
            onChange={(e) => {
              setSelectedToDate(e.target.value)
            }}
            required
            inputProps={{ min: selectedFromDate }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ marginBottom: '20px', marginTop: '20px' }} >
          {/* <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Machine</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Machine"
              placeholder='Select Machine'
              variant="filled"
              value={selectedMachine}
              onChange={(e) => {
                const selectedMachineData = machineList.find((data) => data.id === e.target.value);
                if (selectedMachineData) {
                  setSelectedMachine(selectedMachineData.id);
                  setMachineName(selectedMachineData.machineName);
                }
              }}
              required
            >
              {machineList.map((data) => (
                <MenuItem key={data.id} value={data.id}>{data.machineName}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Machine</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Machine"
              placeholder='Select Machine'
              variant="filled"
              value={selectedMachine}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  // Handle the case when 'All Machines' is selected
                  // You can implement custom logic here
                  // setSelectedMachine('');
                  setIsAllSelect(true);
                  setSelectedMachine('all');
                } else {
                  const selectedMachineData = machineList.find((data) => data.id === e.target.value);
                  if (selectedMachineData) {
                    setIsAllSelect(false);
                    setSelectedMachine(selectedMachineData.id);
                    setMachineName(selectedMachineData.machineName);
                  }
                }
              }}
              required
            >
              {/* Add the 'All Machines' option */}
              <MenuItem key="all" value="all">All Machines</MenuItem>

              {/* Add the individual machines */}
              {machineList.map((data) => (
                <MenuItem key={data.id} value={data.id}>{data.machineName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={1} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
          <Button
            variant="contained"
            onClick={handleSubmitPress}
            style={{ backgroundColor: selectedFromDate && selectedToDate ? '#002d68' : '#C7C8CC' }}
            disabled={selectedFromDate && selectedToDate ? false : true}
          >
            Submit
          </Button>
        </Grid>

        <Grid item xs={12} sm={12} md={1} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
          <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={() => setView(ViewMode.Hour)}>Hour</Button>
            <Button onClick={() => setView(ViewMode.Day)}>Day</Button>
          </ButtonGroup>
        </Grid>
      </Grid>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '11px', zIndex: 1, backgroundColor: '#e3e4e6' }}>
          <span style={{ fontSize: '14px', color: 'green', marginLeft: '5px', zIndex: 1, color: '#000000' }}>Machine Name</span>
        </div>
        <Gantt
          tasks={tasks.length > 0 ? tasks : dataArray}
          viewMode={view}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isChecked ? "155px" : ""}
          columnWidth={columnWidth}
          TooltipContent={taskTooltip}
        // barBackgroundColor={'#ff1744'}
        // barBackgroundSelectedColor={'#ff1744'}
        />
      </div>
    </div>
  );
};
export default GanttChartModule;

