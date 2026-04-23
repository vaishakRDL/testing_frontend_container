import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import motorImage from '../../AllImage/motarIcon.jpg';
import MotoModule from './MotoModule';
import SettingModule from '../SettingComp/SettingModule';

const MotorComponents = () => {
  const [motorOpen, setMotorOpen] = useState(false);
  const [thresholdOpen, setThresholdOpen] = useState(false);

  return (
    <div
      style={{
        marginTop: '20px',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <Card style={{  borderRadius: '10px', boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)', backgroundColor: '#cfcccc' }}>
        <CardContent>
        
        </CardContent>
      </Card>
      <MotoModule
        open={motorOpen}
        setOpen={setMotorOpen}
      />
      <SettingModule
        thresholdOpen={thresholdOpen}
        setThresholdOpen={setThresholdOpen}
      />
    </div>
  )
}

export default MotorComponents