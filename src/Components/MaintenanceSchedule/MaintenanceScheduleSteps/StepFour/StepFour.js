import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Divider,
  Radio,
  RadioGroup,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  alpha,
} from "@mui/material";
import { MaintanaceMachineShowList, MaintanenceOperatorList, MaintanenceSupervisorList } from "../../../../ApiService/LoginPageService";

/* ─── design tokens (matches all steps) ─────────────────────────────────── */
const BRAND = {
  primary: "#0F62FE",
  border: "#E2E6EA",
  text: "#1A1A2E",
  muted: "#6B7280",
};

/* ─── bold label above field ─────────────────────────────────────────────── */
function Label({ children }) {
  return (
    <Typography sx={{
      fontSize: "0.8rem", fontWeight: 700, color: BRAND.text,
      mb: 0.75, display: "block", textAlign: "left",
    }}>
      {children}
    </Typography>
  );
}

/* ─── shared field height ────────────────────────────────────────────────── */
const H = "44px";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", height: H, background: "#fff",
    "& input": { padding: "0 14px", height: H, boxSizing: "border-box", fontSize: "0.875rem", fontWeight: 600, color: BRAND.text },
    "& fieldset": { borderColor: BRAND.border, borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: BRAND.primary },
    "&.Mui-focused fieldset": { borderColor: BRAND.primary, borderWidth: "2px" },
  },
  "& .MuiInputLabel-root": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline": { top: 0 },
};

/* date/time fields keep shrink label */
const dateFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", height: H, background: "#fff",
    "& input": { padding: "0 14px", height: H, boxSizing: "border-box", fontSize: "0.875rem", fontWeight: 600, color: BRAND.text },
    "& fieldset": { borderColor: BRAND.border, borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: BRAND.primary },
    "&.Mui-focused fieldset": { borderColor: BRAND.primary, borderWidth: "2px" },
  },
  "& .MuiInputLabel-root": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline": { top: 0 },
};

const selectSx = {
  borderRadius: "8px", height: H, background: "#fff",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.border, borderWidth: "1.5px", top: 0 },
  "& legend": { display: "none" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary, borderWidth: "2px" },
  "& .MuiSelect-select": {
    height: `${H} !important`, display: "flex", alignItems: "center",
    padding: "0 14px", fontSize: "0.875rem", fontWeight: 600, color: BRAND.text, boxSizing: "border-box",
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      mt: 0.5, borderRadius: "8px", border: `1px solid ${BRAND.border}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      "& .MuiMenuItem-root": {
        fontSize: "0.875rem", fontWeight: 500, color: BRAND.text, py: 0.75,
        "&:hover": { bgcolor: alpha(BRAND.primary, 0.06) },
        "&.Mui-selected": { bgcolor: alpha(BRAND.primary, 0.08), color: BRAND.primary, fontWeight: 700 },
      },
    },
  },
};

/* ─── radio pill ─────────────────────────────────────────────────────────── */
function RadioPill({ value, label, selected, onChange }) {
  return (
    <FormControlLabel
      value={value} label={label}
      control={<Radio size="small" sx={{ color: BRAND.border, "&.Mui-checked": { color: BRAND.primary }, p: 0.5 }} />}
      onChange={onChange}
      sx={{
        m: 0, px: 1.5, py: 0.6, borderRadius: "8px",
        border: `1.5px solid ${selected ? BRAND.primary : BRAND.border}`,
        bgcolor: selected ? alpha(BRAND.primary, 0.05) : "#fff",
        transition: "all 0.15s",
        "& .MuiFormControlLabel-label": {
          fontSize: "0.82rem",
          fontWeight: selected ? 700 : 500,
          color: selected ? BRAND.primary : BRAND.text,
        },
      }}
    />
  );
}

/* ─── component ──────────────────────────────────────────────────────────── */
const StepFour = ({
  affMachine, setaffMachine,
  affManHr, setaffManHr,
  type1, settype1,
  type2, settype2,
  fromdate, setfromdate,
  todate, settodate,
  fromtime, setfromtime,
  totime, settotime,
  handleSubmit,
  setManhr, setMachineUti,
  users, setUser,
  supervisor, setSupervisor,
  error, setError,
  isPreventiveFromChild,
  machine,
  checkList,
  selectedCheckList, setSelectedCheckList,
  machineOptions, setMachineOptions,
  userlist, setUserlist,
}) => {
  const [supervisorList, setSupervisorList] = useState([]);

  useEffect(() => {
    // API calls go here
    MaintanaceMachineShowList(
      (data) => setMachineOptions(Array.isArray(data?.data) ? data.data : []),
      (error) => console.error("Failed to load machine list:", error)
    );
    MaintanenceSupervisorList(
      (data) => setSupervisorList(Array.isArray(data?.data) ? data.data : []),
      (error) => console.error("Failed to load supervisor list:", error)
    );
    MaintanenceOperatorList(
      (data) => setUserlist(Array.isArray(data?.data) ? data.data : []),
      (error) => console.error("Failed to load operator list:", error)
    );

  }, []);

  return (
    <Card elevation={0} sx={{ mt: 2, borderRadius: "16px", border: "1.5px solid #E2E6EA", background: "#fff", overflow: "visible" }}>
      <CardContent sx={{ p: "24px !important" }}>

        {/* ── header ── */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: BRAND.text, lineHeight: 1.2 }}>
              Schedule
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: BRAND.muted, mt: 0.3 }}>
              Set affected machines, manpower, dates and supervisor
            </Typography>
          </Box>
          {/* <Box sx={{ px: 1.5, py: 0.4, borderRadius: "20px", bgcolor: BRAND.primary, color: "#fff", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em" }}>
            STEP 04
          </Box> */}
        </Box>

        <Divider sx={{ borderColor: "#E2E6EA", mb: 3 }} />

        <Grid container spacing={2.5} alignItems="flex-start">

          {/* ── Affected Machine ── */}
          <Grid item xs={12} sm={6}>
            <Label>Affected Machine</Label>
            <FormControl fullWidth size="small">
              <Select
                multiple
                value={affMachine}
                onChange={(e) => setaffMachine(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                displayEmpty
                sx={selectSx}
                MenuProps={menuProps}
              >
                <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select machines</span></MenuItem>
                {machineOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.name}>
                    <Checkbox size="small" checked={affMachine.indexOf(opt.name) > -1}
                      sx={{ p: 0.5, mr: 1, color: BRAND.border, "&.Mui-checked": { color: BRAND.primary } }} />
                    <ListItemText primary={opt.name} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ShutDown / Runtime radio */}
            <Box sx={{ mt: 1.5 }}>
              <RadioGroup row value={type1} onChange={(e) => settype1(e.target.value)} sx={{ gap: 1 }}>
                {["ShutDown", "Runtime"].map((val) => (
                  <RadioPill key={val} value={val} label={val} selected={type1 === val} onChange={(e) => settype1(e.target.value)} />
                ))}
              </RadioGroup>
              {type1 === "Runtime" && (
                <Box sx={{ mt: 1.5 }}>
                  <Label>Machine Runtime Details</Label>
                  <TextField fullWidth size="small" placeholder="Enter runtime details"
                    onChange={(e) => setMachineUti(e.target.value)} sx={fieldSx} />
                </Box>
              )}
            </Box>
          </Grid>

          {/* ── Man Power ── */}
          <Grid item xs={12} sm={6}>
            <Label>Select Man Power</Label>
            <FormControl fullWidth size="small">
              <Select
                multiple
                value={users}
                onChange={(e) => setUser(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)}
                renderValue={(selected) => selected.join(", ")}
                displayEmpty
                sx={selectSx}
                MenuProps={menuProps}
              >
                <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select operators</span></MenuItem>
                {userlist.map((opt) => (
                  <MenuItem key={opt.id} value={opt.name}>
                    <Checkbox size="small" checked={users.indexOf(opt.name) > -1}
                      sx={{ p: 0.5, mr: 1, color: BRAND.border, "&.Mui-checked": { color: BRAND.primary } }} />
                    <ListItemText primary={opt.name} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Off / Man Hours radio */}
            <Box sx={{ mt: 1.5 }}>
              <RadioGroup row value={type2} onChange={(e) => settype2(e.target.value)} sx={{ gap: 1 }}>
                {["Off", "Man Hours Utilization"].map((val) => (
                  <RadioPill key={val} value={val} label={val} selected={type2 === val} onChange={(e) => settype2(e.target.value)} />
                ))}
              </RadioGroup>
              {type2 === "Man Hours Utilization" && (
                <Box sx={{ mt: 1.5 }}>
                  <Label>Man Hours Details</Label>
                  <TextField fullWidth size="small" placeholder="Enter man hours details"
                    onChange={(e) => setManhr(e.target.value)} sx={fieldSx} />
                </Box>
              )}
            </Box>
          </Grid>

          {/* ── From Date & Time ── */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Label>From Date</Label>
                <TextField fullWidth type="date" size="small" value={fromdate}
                  onChange={(e) => setfromdate(e.target.value)}
                  InputLabelProps={{ shrink: true }} sx={dateFieldSx} />
              </Grid>
              <Grid item xs={6}>
                <Label>From Time</Label>
                <TextField fullWidth type="time" size="small" value={fromtime}
                  onChange={(e) => setfromtime(e.target.value)}
                  InputLabelProps={{ shrink: true }} sx={dateFieldSx} />
              </Grid>
            </Grid>
          </Grid>

          {/* ── To Date & Time ── */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Label>To Date</Label>
                <TextField fullWidth type="date" size="small" value={todate}
                  onChange={(e) => settodate(e.target.value)}
                  InputLabelProps={{ shrink: true }} sx={dateFieldSx} />
              </Grid>
              <Grid item xs={6}>
                <Label>To Time</Label>
                <TextField fullWidth type="time" size="small" value={totime}
                  onChange={(e) => settotime(e.target.value)}
                  InputLabelProps={{ shrink: true }} sx={dateFieldSx} />
              </Grid>
            </Grid>
          </Grid>

          {/* ── Assign Supervisor ── */}
          <Grid item xs={12} sm={6}>
            <Label>Assign Supervisor</Label>
            <FormControl fullWidth size="small" error={error}>
              <Select
                value={supervisor}
                onChange={(e) => { setError(false); setSupervisor(e.target.value); }}
                displayEmpty
                sx={selectSx}
                MenuProps={menuProps}
              >
                <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select supervisor</span></MenuItem>
                {supervisorList.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                ))}
              </Select>
              {error && (
                <FormHelperText sx={{ fontSize: "0.75rem", color: "#FF4D4F", mt: 0.5, ml: 0 }}>
                  Please select a supervisor.
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* ── Checklist (Preventive only) ── */}
          {isPreventiveFromChild && (
            <Grid item xs={12} sm={6}>
              <Label>Checklist</Label>
              <FormControl fullWidth size="small" error={error}>
                <Select
                  value={selectedCheckList}
                  onChange={(e) => { setError(false); setSelectedCheckList(e.target.value); }}
                  displayEmpty
                  sx={selectSx}
                  MenuProps={menuProps}
                >
                  <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select checklist</span></MenuItem>
                  {checkList.map((opt) => (
                    <MenuItem key={opt.checkListId} value={opt.checkListId}>{opt.checkname}</MenuItem>
                  ))}
                </Select>
                {error && (
                  <FormHelperText sx={{ fontSize: "0.75rem", color: "#FF4D4F", mt: 0.5, ml: 0 }}>
                    Please select a checklist.
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}

          {/* ── Submit ── */}
          {/* <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Box sx={{ display: "flex", mt: 3 }}>
              <Button
                onClick={handleSubmit}
                sx={{
                  height: H, px: 4, borderRadius: "8px",
                  bgcolor: BRAND.primary, color: "#fff",
                  fontWeight: 700, fontSize: "0.9rem",
                  textTransform: "none", boxShadow: "none",
                  "&:hover": { bgcolor: "#0050D8", boxShadow: "none" },
                }}
              >
                Submit
              </Button>
            </Box>
          </Grid> */}

        </Grid>
      </CardContent>
    </Card>
  );
};

export default StepFour;