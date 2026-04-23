import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import { UpdateKPIMonth } from "../../ApiService/LoginPageService";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// const CustomTooltip = ({ active, payload, label, kpi, month }) => {
//   if (!active || !payload || !payload.length) return null;

//   const row = payload[0]?.payload || {};
//   const subKeys = Array.isArray(kpi?.subKeys) ? kpi.subKeys : [];

//   const getValue = (v) => {
//     const num = Number(v);
//     return isNaN(num) ? 0 : num;
//   };

//   return (
//     <Box
//       sx={{
//         background: "#fff",
//         p: 1,
//         borderRadius: 2,
//         boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
//       }}
//     >
//       <Typography fontWeight={700}>
//         {MONTHS[month - 1]} {label}
//       </Typography>

//       {/* Completion */}
//       <Typography>
//         Value: {getValue(row[kpi.key]).toFixed(2)}%
//       </Typography>

//       {/* Dynamic Sub Keys */}
//       {/* {subKeys.map((item) => (
//         <Typography key={item.key}>
//           {item.label}: {getValue(row[item.key]).toFixed(2)}
//         </Typography>
//       ))} */}
//       {subKeys.length > 0 &&
//         subKeys.map((item) => (
//           <Typography key={item.key}>
//             {item.label}: {getValue(row[item.key]).toFixed(2)}
//           </Typography>
//         ))}

//       {/* Formula */}
//       {/* {kpi?.formula && (
//         <Typography sx={{ mt: 1, color: "#777" }}>
//           Formula: {kpi.formula}
//         </Typography>
//       )} */}
//       {kpi?.formula && (
//         <Typography sx={{ mt: 1, color: "#1a1818", fontWeight: "bold" }}>
//           Formula: {kpi.formula}
//         </Typography>
//       )}
//     </Box>
//   );
// };

const CustomTooltip = ({ active, payload, label, kpi, month }) => {
  if (!active || !payload || !payload.length) return null;

  const row = payload[0]?.payload || {};
  const subKeys = Array.isArray(kpi?.subKeys) ? kpi.subKeys : [];
  const unit = kpi?.unit || "";

  const getValue = (v) => {
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };

  // combine Value + subKeys
  const items = [
    { label: "Value", value: `${getValue(row[kpi.key]).toFixed(2)}${unit}` },
    ...subKeys.map((item) => ({
      label: item.label,
      value: getValue(row[item.key]).toFixed(2),
    })),
  ];

  // split into pairs (2 per row)
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <Box
      sx={{
        background: "#fff",
        p: 1,
        borderRadius: 2,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        minWidth: 220,
      }}
    >
      <Typography fontWeight={700} mb={0.5}>
        {MONTHS[month - 1]} {label}
      </Typography>

      {rows.map((pair, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {pair.map((item, i) => (
            <Typography key={i} fontSize={13}>
              {item.label}: <b>{item.value}</b>
            </Typography>
          ))}
        </Box>
      ))}

      {kpi?.formula && (
        <Typography
          sx={{
            mt: 0.5,
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          Formula: {kpi.formula}
        </Typography>
      )}
    </Box>
  );
};


const KPIChartCard = ({
  kpi,
  apiData,
  onOpenSettings,
  onViewGraph,
}) => {

  /* --------------------------------------------------
     1️⃣ CURRENT MONTH (INITIAL)
  -------------------------------------------------- */
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  /* --------------------------------------------------
     2️⃣ THRESHOLD
  -------------------------------------------------- */
  const [threshold, setThreshold] = useState(0);

  /* --------------------------------------------------
     3️⃣ LOCAL API DATA
  -------------------------------------------------- */
  const [localApiData, setLocalApiData] = useState([]);

  /* --------------------------------------------------
     4️⃣ PREVENT DOUBLE API CALL (STRICT MODE)
  -------------------------------------------------- */
  const initialLoadRef = useRef(false);

  /* --------------------------------------------------
     5️⃣ SYNC API DATA FROM PROPS
  -------------------------------------------------- */
  useEffect(() => {
    if (Array.isArray(apiData)) {
      setLocalApiData(apiData);
    }
  }, [apiData]);

  /* --------------------------------------------------
     6️⃣ APPLY KPI DEFAULT THRESHOLD
  -------------------------------------------------- */
  useEffect(() => {
    const parsed = Number(kpi?.value);
    setThreshold(!isNaN(parsed) ? parsed : 0);
  }, [kpi?.value]);

  /* --------------------------------------------------
     7️⃣ CHART DATA
  -------------------------------------------------- */
  // const chartData = useMemo(() => {
  //   return localApiData.map((row) => ({
  //     day: row.kpi_day,
  //     value: Number(row[kpi.key]) || 0,
  //   }));
  // }, [localApiData, kpi.key]);

  const chartData = useMemo(() => {
    return localApiData.map((row) => ({
      day: row.kpi_day,
      value: Number(row[kpi.key]) || 0,
      ...row   // ⭐ VERY IMPORTANT
    }));
  }, [localApiData, kpi.key]);

  /* --------------------------------------------------
     8️⃣ Y-AXIS MAX
  -------------------------------------------------- */
  const maxValue = useMemo(() => {
    const barMax = Math.max(...chartData.map((d) => d.value), 0);
    return Math.max(barMax, threshold) * 1.1;
  }, [chartData, threshold]);

  /* --------------------------------------------------
     9️⃣ VIEW HANDLER
  -------------------------------------------------- */
  const handleView = () => {
    const payload = {
      month: Number(month),
      code: kpi.kpi_code,
      key: kpi.key,
    };

    onViewGraph?.({
      month: Number(month),
      code: kpi.kpi_code,
      key: kpi.key,
      kpi,
      threshold,
      chartData,
    });

    UpdateKPIMonth(payload, handleSuccess, handleFailure);
  };

  /* --------------------------------------------------
     🔟 AUTO LOAD CURRENT MONTH ON FIRST OPEN
  -------------------------------------------------- */
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      handleView(); // ✅ current month passed automatically
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------------------
     1️⃣1️⃣ API SUCCESS
  -------------------------------------------------- */
  const handleSuccess = (res) => {
    console.log("UpdateKPIMonth Response 👉", res);

    if (!res?.success) return;

    if (Array.isArray(res?.data)) {
      setLocalApiData(res.data);
    }

    // optional: backend controls month
    if (res?.config?.month) {
      setMonth(Number(res.config.month));
    }

    if (res?.config?.value !== undefined) {
      const parsed = Number(res.config.value);
      setThreshold(!isNaN(parsed) ? parsed : 0);
    }
  };

  /* --------------------------------------------------
     1️⃣2️⃣ API FAILURE
  -------------------------------------------------- */
  const handleFailure = (err) => {
    console.error("UpdateKPIMonth Error 👉", err);
  };

  /* --------------------------------------------------
     1️⃣3️⃣ UI
  -------------------------------------------------- */
  return (
    <Card sx={{
      height: 240, boxShadow: "0px 3px 8px rgba(0,0,0,0.25)", overflow: "visible"
    }}>
      <CardContent sx={{ height: "100%", p: 1, overflow: "visible" }}>

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography fontWeight={700} fontSize={14}>
            {kpi.label}
          </Typography>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings?.(kpi, e);
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* FILTER */}
        <Box sx={{ display: "flex", mb: 1 }}>
          <TextField
            select
            size="small"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            sx={{ width: 140 }}
          >
            {MONTHS.map((m, i) => (
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <Button
            sx={{ ml: 1 }}
            variant="contained"
            size="small"
            onClick={handleView}
          >
            View
          </Button>
        </Box>

        {/* CHART */}
        <ResponsiveContainer width="100%" height="70%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 9 }} />
            <YAxis
              tick={{ fontSize: 9 }}
              domain={[0, maxValue]}
              tickFormatter={(v) => v.toFixed(2)}
            />
            {/* <Tooltip /> */}
            <Tooltip content={<CustomTooltip kpi={kpi} month={month} />} />

            <ReferenceLine
              y={threshold}
              stroke="#d32f2f"
              strokeDasharray="4 4"
              label={{
                value: `Threshold ${threshold.toFixed(2)}`,
                position: "right",
                fontSize: 10,
                fill: "#d32f2f",
              }}
            />

            <Bar dataKey="value" barSize={6}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.value >= threshold ? "#d32f2f" : "#1976d2"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  );
};

export default KPIChartCard;
