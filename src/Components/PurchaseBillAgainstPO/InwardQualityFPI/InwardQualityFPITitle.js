import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

const InwardQualityFPITitle = (props) => {
  const {
    selectedOptionName,
    setIsChild,
    isChild,
    scrollToRow,
    selectedRowId,
  } = props;
  const [file, setFile] = useState(null);

  const handleFileUpload = () => {
    // Handle the uploaded file here
  };

  return (
    <Box
      sx={{
        mb: "10px",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", cursor: "pointer" }}>
        <Typography
          sx={{
            m: 1,
            fontFamily: "Roboto Slab",
            fontWeight: "bold",
            color: "#0769d9",
            "&:hover": { color: "#043f82" },
          }}
          variant="h5"
          onClick={() => {
            props.setIsProcessInsp(false);
            // props.setIsChild(0);
            // scrollToRow(selectedRowId)
          }}
        >
          {props.inspectionView === true
            ? "Purchase bill Without PO >>"
            : "Purchase bill Against PO >>"}
        </Typography>

        {isChild === 1 && (
          <Typography
            sx={{
              m: 1,
              fontFamily: "Roboto Slab",
              fontWeight: "bold",
              color: "#0769d9",
              "&:hover": { color: "#043f82" },
            }}
            variant="h5"
            onClick={() => {
              props.setIsProcessInsp(5);
              props.setIsChild(1);
            }}
          >
            {`Process Inspection Child>>`}
          </Typography>
        )}

        {/* <Typography
                        sx={{ 
                        m: 1, 
                        fontFamily: 'Roboto Slab', 
                        fontWeight: 'bold', 
                        color: '#0769d9', 
                        '&:hover': { color: '#043f82' } 
                        }}
                        variant="h5"
                        onClick={() => {
                            props.setIsChild(0);
                        }}
                    >
                        {`Process Inspection Child>>`}
                    </Typography> */}

        {/* </Link> */}
        <Typography
          sx={{ m: 1, fontFamily: "Roboto Slab", fontWeight: "bold" }}
          variant="h5"
        >
          Inspection
        </Typography>
      </div>

      <Box sx={{ m: 1 }}>
        <Grid container alignItems={"center"} spacing={2}></Grid>
      </Box>
    </Box>
  );
};
export default InwardQualityFPITitle;
