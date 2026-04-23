import { Grid, Typography } from "@mui/material";
import React from "react";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <Grid container justifyContent={'space-around'} style={{ backgroundColor: '#314373', height: '45px', alignItems: 'center' }}>
            <Grid item>
                <Typography style={{ color: '#ffffff' }}>Copyright © 2023 RDL Technologies Pvt Ltd - All Rights Reserved.</Typography>
            </Grid>
            <Grid item>
                <Typography style={{ color: '#ffffff' }}>
                    <a href='https://rdltech.in' style={{ color: '#ffffff', textDecoration: 'none' }}>
                        www.rdltech.in
                    </a>
                </Typography>
            </Grid>
            <Grid item>
                <FacebookIcon style={{ color: '#ffffff', marginLeft: '10px', marginRight: '10px' }} />
                <TwitterIcon style={{ color: '#ffffff', marginLeft: '10px', marginRight: '10px' }} />
                <LinkedInIcon style={{ color: '#ffffff', marginLeft: '10px', marginRight: '10px' }} />
            </Grid>
        </Grid>
    )
}
export default Footer;