
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, Checkbox } from '@mui/material'

import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';


const CurrencyMaster = ({ open, setOpen, isAddButton, currencyData, setRefreshData, }) => {

  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  useEffect(() => {

  }, [currencyData]);

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  const validateForNullValue = (value, type) => {

  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };



  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
      maxWidth="md"
      open={open}
    >
      <DialogTitle style={{ background: '#002D68', color: 'white' }}>
        {isAddButton ? 'Currency Name' : 'Edit Currency Name'}
      </DialogTitle>
      <DialogContent>
        <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Currency Id"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={currencyId}
                placeholder="Currency Id"

              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Currency Code"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={currencyCode}
                placeholder="Currency Code"

              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Currency Name"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={Currencyname}
                placeholder="Currency Name"

              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}

            >
              <TextField
                id="filled-basic"
                label="Currency Series"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={Currencyseries}
                placeholder="Currency Series"

              />

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Currency No"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={Currencyno}
                placeholder="Currency No"

              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Currency Code Clean"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={Currencycodeclean}
                placeholder="Currency Code Clean"

              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Inactive Remarks"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={Inactiveremarks}
                placeholder="Inactive Remarks"

              />
            </Grid>

            <Grid style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
              item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControlLabel
                control={<Checkbox defaultChecked />} label="Inactive" />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Authorised"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                required
                // value={authorised}
                placeholder="Authorised"

              />
            </Grid>

          </Grid>

          <DialogActions>
            <Button
              variant="contained"
              style={{ width: '150px', background: '#002D68', color: 'white' }}
              // disabled={
              //     errorObject?.customerId?.errorStatus
              //     || errorObject?.GSTNumber?.errorStatus
              //     || errorObject?.customerName?.errorStatus
              //     || errorObject?.billingAddress?.errorStatus
              //     || errorObject?.address?.errorStatus
              //     || errorObject?.shippingAddress?.errorStatus
              //     || errorObject?.contactPersonName?.errorStatus
              //     || errorObject?.primaryContactnumber?.errorStatus
              //     || errorObject?.phoneNumber?.errorStatus
              //     || errorObject?.email?.errorStatus
              // }
              type="submit"

            >
              {isAddButton ? 'Add' : 'Update'}
            </Button>
            <Button
              variant="contained"
              style={{ width: '150px', background: '#002D68', color: 'white' }}
              onClick={(e) => {
                setOpen(false);

              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

    </Dialog>
  )
}

export default CurrencyMaster