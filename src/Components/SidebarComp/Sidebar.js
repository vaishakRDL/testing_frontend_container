import React, { useState } from 'react';
import './Sidebar.css'; // Import your CSS file for styling
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import companyLogo from '../../AllImage/Maliklogo.jpg.webp'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='sidebar'>
            <Box>
                <img
                    style={{
                        padding: '10px',
                        width: '100p',
                        height: '100px',
                        objectFit: 'contain',
                        objectPosition: 'center'
                    }}
                    alt="React Logo"
                    src={companyLogo}
                />
            </Box>
            <ul>
                <Link to='/MotorComponents'>
                    <li>
                        <CorporateFareIcon style={{ marginRight: '10px' }} />
                        <span className='text-sm ml-1 text-white font-medium' style={{ color: "#000000", fontWeight: 'bold', fontSize: '20px' }}>Motor</span>
                    </li>
                </Link>

            </ul>
        </div>
    );
};

export default Sidebar;
