import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react'
import SOBimportResult from '../../SOBimportComp copy/SOBimportResult';

const ImportSOBforCsl = ({ open, setOpen, cslId }) => {

    const handleSubmit = (e) => {


    }
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            // maxWidth="false"
            fullScreen
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                Import SOB
            </DialogTitle>
            {/* <form onSubmit={handleSubmit}> */}
            <DialogContent >
                <SOBimportResult
                    cslId={cslId}
                />
            </DialogContent>
            <DialogActions>
                {/* <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit" >

                    </Button> */}
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
            {/* <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
        /> */}

            {/* </form> */}
        </Dialog>
    )
}

export default ImportSOBforCsl
