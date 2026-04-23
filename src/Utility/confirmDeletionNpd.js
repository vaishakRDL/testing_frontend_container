import { WarningAmber } from '@mui/icons-material';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function DeleteConfirmationDailogNpd(props) {
  const [remark, setRemark] = useState('');
  function onSubmit() {
    props.setOpen(false);
    if (props?.selectedMaster !== '') {
      props.deleteService({
        remark: remark,
        masterType: props.selectedMaster,
        id: props.deleteId,
      }, props.handleSuccess, props.handleException);

    } else {
      props.deleteService(props.deleteId, props.handleSuccess, props.handleException);
    }
  }
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
      open={props.open}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <FeedbackIcon color="warning" style={{ fontSize: 95, color: '#8b1228' }} />
      </DialogTitle>
      <DialogContent sx={{
        mt: 1,
        textAlign: 'center', fontFamily: 'customfont',
        letterSpacing: '0.5px',
        marginTop: '0px'
      }}>
        <Typography
          sx={{
            m: 1,
            fontFamily: 'customfont',
            letterSpacing: '0.5px',
            padding: '10px 0'
          }}
          variant="h5"
          component="span"
        >
          You are deleting Item No : {props.selectedItemNo}
          <br />
          Revision : {props.selectedRevision}
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextField
              id="filled-basic"
              label="Reason"
              variant="filled"
              sx={{ mb: 1 }}
              multiline
              margin="dense"
              fullWidth
              placeholder="Reason"
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ margin: '10px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button onClick={() => { onSubmit(); }}
            style={{
              background: 'rgb(19 60 129)',
            }}
            sx={{
              height: '0',
              color: 'white',
              padding: "10px 19px",
              fontSize: '13px',
              borderRadius: '10px',
              fontWeight: '600',
              fontFamily: 'customfont',
              letterSpacing: '1px',
              boxShadow: 'none',
              marginRight: '20px',
              marginBottom: '20px'
            }}>
            Confirm
          </Button>
          <Button
            style={{
              background: 'rgb(19 60 129)',
            }}
            sx={{
              height: '0',
              color: 'white',
              padding: "10px 19px",
              fontSize: '13px',
              borderRadius: '10px',
              fontWeight: '600',
              fontFamily: 'customfont',
              letterSpacing: '1px',
              boxShadow: 'none',
              marginRight: '20px',
              marginBottom: '20px'
            }}
            onClick={() => props.setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
