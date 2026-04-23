import React, { useEffect, useState } from 'react';
import logo from '../../AllImage/MALLIK_MULTITECHNOLOGIES_PRIVATE_LIMITED.png.webp';
import RDL_Logo from '../../AllImage/RDL_Logo.png';
import '../NavbarComp/Navbar.css';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Tooltip, Typography } from '@mui/material';
import ApplicationStore from '../../Utility/localStorageUtil';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { DispatchDashboardLock } from '../../ApiService/LoginPageService';


const MyNavbar = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [urlList, setUrlList] = useState('');
  const [isTarget, setIsTarget] = useState('');

  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });


  const { userDetails, fyFrom, fyTo } = ApplicationStore().getStorage('userDetails');

  // Normalize role checking
  const isAdmin =
    userDetails?.role?.toLowerCase() === "admin" || userDetails?.isSuperUser === true;

  const menuPermition = userDetails?.groupRights || [];
  const [menuPermitionList, setMenuPermitionList] = useState('');

  const handleMasterDropdownEnter = () => {
    setMasterDropdownOpen(true);
  }

  const handleMasterDropdownLeave = () => {
    setMasterDropdownOpen(false);
  }

  const [fyData, setFyData] = useState({
    fyFrom,
    fyTo
  });
  useEffect(() => {
    const updateFY = () => {
      const data = ApplicationStore().getStorage("userDetails");

      setFyData({
        fyFrom: data?.fyFrom,
        fyTo: data?.fyTo,
      });
    };

    window.addEventListener("fyUpdated", updateFY);

    return () => {
      window.removeEventListener("fyUpdated", updateFY);
    };
  }, []);

  const parmisionRights = (value) => {
    const menuPermissionFiltered = menuPermition.filter((data) => data?.menu?.toLowerCase() === value.toLowerCase());
    return menuPermissionFiltered.length > 0 && parseInt(menuPermissionFiltered[0]?.viewData) === 1;
  };


  const onLogoutClick = () => {
    setNotification({
      status: true,
      type: 'success',
      message: 'Logout Successfully...!'
    });
    setTimeout(() => {
      handleClose();
      ApplicationStore().setStorage('userDetails', '');
      ApplicationStore().clearStorage();
      setAnchorEl(null);
      navigate('/login');
    }, 3000);

  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenue = () => {
    setAnchorEl(null);
  };



  let windows = {};

  function openInNewTab(url, target) {

    if (windows[url]) {
      windows[url].focus();
    } else {
      let win = window.open('#' + url, target);
      if (win) {
        windows[url] = win;
        win.focus();
      }
    }
  }



  function openInNewTab2(event, url) {
    event.preventDefault();
    const openedUrls = JSON.parse(localStorage.getItem('openedUrls')) || [];
    const storedUrl = openedUrls.find(u => u === url);

    if (!storedUrl) {
      openedUrls.push(url);
      localStorage.setItem('openedUrls', JSON.stringify(openedUrls));
      localStorage.removeItem(`${url}_closed`);
      window.open(`MallikEngineering#${url}`, '_blank');
    } else {
      const existingTab = window.open(`MallikEngineering#${url}`, '_self');
      if (existingTab) {
        existingTab.focus();
      } else {
        alert('Unable to focus on the existing tab.');
      }
    }
  }



  window.addEventListener('beforeunload', function (event) {
    const openedUrls = JSON.parse(localStorage.getItem('openedUrls')) || [];
    const url = window.location.hash.substring(1);
    const indexToRemove = openedUrls.indexOf(url);

    if (indexToRemove !== -1) {
      openedUrls.splice(indexToRemove, 1);
      localStorage.setItem('openedUrls', JSON.stringify(openedUrls));
    }

    if (openedUrls.length === 0) {
      // Clear localStorage when the last tab is being closed
      localStorage.removeItem('openedUrls');
      localStorage.removeItem('indexToRemove');
    }

    localStorage.setItem('indexToRemove', JSON.stringify(indexToRemove));
  });



  const handleNewTab = (url) => {
    const openedUrls = JSON.parse(localStorage.getItem('openedUrls')) || [];

    if (!openedUrls.includes(url)) {
      openedUrls.push(url);
      localStorage.setItem('openedUrls', JSON.stringify(openedUrls));
      localStorage.removeItem(`${url}_closed`);
      setUrlList(url);
      setIsTarget('_blank');
    } else {
      alert('This page is already open in another tab.');
    }
  }

  useEffect(() => {

  }, []);


  const openTab = (url, target) => {
    // Open a new tab with the specified URL and target
    let win = window.open(url, target);

    // Focus on the opened tab
    if (win) {
      win.focus();
    }
  };

  const baseUrl = process.env.REACT_APP_API_URL;
  const urlParts = baseUrl.split('api/');


  const handleDispatchClick = () => {
    console.log('Dispatch Dashboard Lock API called');
    DispatchDashboardLock(
      { type: 0 },
      (dataObject) => {
        // Success callback
        console.log(dataObject);
        setNotification({
          status: true,
          type: 'success',
          message: dataObject.message,
        });

        // Navigate to dashboard
        openInNewTab('/DispatchDashboard', 'DispatchDashboard');
      },
      (errorObject, message) => {
        // Error callback
        console.log(message);
        setNotification({
          status: true,
          type: 'error',
          message: message,
        });
        // No navigation happens here
      }
    );
  };


  return (
    <div style={{ backgroundColor: '#002D68' }}>
      <nav  >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#002D68', alignItems: 'center', }}>
          <div class="logo-container">
            <Link to="/MasterDashboard">
              <img src={RDL_Logo} alt="Logo" style={{ width: '60px', }} />
            </Link>
          </div>
          <div>
            <h5 style={{ color: '#ffffff', fontFamily: 'Roboto Slab' }}>RDL Technologies Pvt Ltd</h5>
          </div>
          <div className='timeing-container' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', columnGap: '20px' }}>
            <h6 style={{ color: '#ffffff', fontFamily: 'Roboto Slab' }}>{formattedDate} {formattedTime}</h6>
            <div style={{ backgroundColor: '#ffffff', width: '2px', height: '20px' }}></div>
            <h6 style={{ color: '#ffffff', fontFamily: 'Roboto Slab' }}>FY: {fyData.fyFrom} | {fyData.fyTo}</h6>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
            {userDetails?.image === "No image data found" ?
              <AccountCircleIcon style={{ width: '40px', height: '40px', borderRadius: '20px', marginRight: '10px', color: '#ffffff' }} />
              :
              <img src={`${urlParts[0]}${userDetails?.image}`} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '20px', marginRight: '10px' }} />
            }
            <Typography className='timeing-container' style={{ color: '#ffffff', fontFamily: 'Roboto Slab', marginRight: '20px' }}>
              {userDetails?.userName}
            </Typography>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >

              <DragHandleIcon style={{ color: '#ffffff', fontFamily: 'Roboto Slab' }} />
            </Button>
            {/* <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenue}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
            </Menu> */}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenue}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {/* {isAdmin && ( */}
              {/* <MenuItem
                onClick={() => {
                  handleCloseMenue();
                  navigate('/TransactionLock');
                }}
              >
                🔐 Transaction Lock
              </MenuItem> */}
              {/* )} */}


              <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
            </Menu>


          </div>
        </div>

        <label for="drop" class="toggle">Menu</label>
        <input type="checkbox" id="drop" />
        <ul class="menu">
          {parmisionRights('master') ? (
            <li>
              <label for="drop-2" class="toggle">Master +</label>
              <a href="javascript:void(0)">Master</a>
              <input type="checkbox" id="drop-2" />
              <ul style={{ width: '219px' }}>

                <li>

                  <label for="drop-3" class="toggle">Add Master +</label>
                  <a href="javascript:void(0)">Add Master</a>
                  <input type="checkbox" id="drop-3" />
                  <ul>
                    {
                      parmisionRights('addmaster') ? (
                        <li style={{ width: '300px' }}> <Link

                          onClick={(e) => openInNewTab('/AddMasterResult', 'AddMaster')}
                        >
                          Add Master
                        </Link></li>
                      ) : (<li style={{ width: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray', }}> Add Master</label>
                          <a href="javascript:void(0)" style={{ color: 'gray', }}> Add Master</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>)
                    }

                    {
                      parmisionRights('holidaymaster') ? (
                        <li style={{ width: '300px' }}><Link
                          onClick={(e) => openInNewTab('/HolidayMasterResult', 'HolidayMaster')}
                        >
                          Add Holiday Master
                        </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}> Add Holiday Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add Holiday Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('FileTypeMaster') ? (

                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/FileTypeResult', 'FileType')}

                          >Add File Type Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}> Add File Type Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add File Type Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('FileTypeMaster') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CompanyMaster', 'CompanyMaster')}

                          >Company Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Company Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Company Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('FileTypeMaster') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/RemarksMasterResult', 'RemarksMasterResult')}

                          >Remarks Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Remarks Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Remarks Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('EmailSettings') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/EmailSettingResult', 'EmailSettingResult')}

                          >Email Setting
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Email Settings</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Email Settings</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('EmailSettings') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/TransactionLock', 'TransactionLock')}

                          > Transaction Lock Settings
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}> Transaction Lock Settings</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}> Transaction Lock Settings</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                  </ul>
                </li>

                <li>
                  <label for="drop-3" class="toggle">User Management +</label>
                  <a href="javascript:void(0)">User Management</a>
                  <input type="checkbox" id="drop-3" />
                  <ul>
                    {
                      parmisionRights('AddUser') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/UserAddResult', 'UserAdd')}

                          >
                            Add User
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Add User</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add User</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('GroupMaster') ? (

                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/GroupMasterResult', 'GroupMaster')}

                          >
                            Add Group
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Add Group</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add Group</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                  </ul>
                </li>

                <li>
                  <label for="drop-3" class="toggle">Customer Master +</label>
                  <a href="javascript:void(0)">Customer Master</a>
                  <input type="checkbox" id="drop-3" />

                  <ul>
                    {
                      parmisionRights('AddCustomer') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CustomerResult', 'Customer')}

                          >Add Customer
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Add Customer</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add Customer</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('AddSupplyPlace') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SupplaceResult', 'Supplace')}

                          >
                            Add Supply Place
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}> Add Supply Place</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}> Add Supply Placer</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('AddProjectName') ? (

                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/ProjectNameResult', 'ProjectName')}

                          >
                            Add Project Name
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Add Project Name</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add Project Name</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                  </ul>
                </li>

                <li>
                  <label for="drop-4" class="toggle">Supplier Master +</label>
                  <a href="javascript:void(0)">Supplier Master</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('SupplierMaster') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SupplerResult', 'Suppler')}

                          >
                            Add Supplier Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Add Supplier Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add Supplier Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('AddSupplierList') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SupplierModule', 'Supplier')}

                          >
                            Add Supplier List
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Add Supplier List</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add Supplier List</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                  </ul>
                </li>
                <li>
                  <label for="drop-4" class="toggle">Machine Master +</label>
                  <a href="javascript:void(0)">Machine Master</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('ShiftMaster') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/ShiftMasterResult', 'ShiftMaster')}

                          >
                            Shift Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Shift Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Shift Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('ProcessVsUOM') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/ProcessVsUOMResult', 'ProcessVsUOM')}

                          >
                            Process Vs UOM
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Process Vs UOM</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Process Vs UOM</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('Machine') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/AddMachineResult', 'AddMachine')}

                          >
                            Add Machine
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}> Add Machine</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}> Add Machine</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                  </ul>
                </li>

                <li>
                  <label for="drop-4" class="toggle">Item Master +</label>
                  <a href="javascript:void(0)">Item Master</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>

                    {
                      parmisionRights('ItemMaster') ? (
                        <li style={{ width: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/PartMasterResult', 'PartMaster')}

                          >
                            Add Item
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Add Item</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>Add Item</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                  </ul>
                </li>

                {/* <li>
                  <ul>
                  </ul>
                </li>
                <li style={{ width: '219px' }}><Link
                  onClick={(e) => openInNewTab('/DocumentMasterResult')}
                >Financial Year </Link></li>
                <li style={{ width: '219px' }}><Link
                  onClick={(e) => openInNewTab('/DocumentNumberResult')}

                >Document Number</Link></li> */}
                {/* <ul> */}
                {parmisionRights('FinancialYear') ? (
                  <li style={{ width: '219px' }}>
                    <Link

                      onClick={(e) => {
                        openInNewTab('/DocumentMasterResult', 'financialYear');
                      }}

                    >Financial Year </Link>
                  </li>
                ) : (
                  <li style={{ width: '219px' }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Financial Year</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Financial Year</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
                {parmisionRights('DocumentNumber') ? (
                  <li style={{ width: '219px' }}>
                    <Link
                      // style={{ color: userDetails.userRole === "Admin" ? '#ffffff' : 'gray' }}
                      // onClick={(e) => openInNewTab('/CSLimportResult')}
                      onClick={(e) => {
                        openInNewTab('/DocumentNumberResult', 'DocumentNumber');
                      }}
                    //  target='_blank' to='/CSLimportResult'
                    // onClick={(e) => openInNewTab(e, '/CSLimportResult')}
                    >Document Number</Link>
                  </li>
                ) : (
                  <li style={{ width: '219px' }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Document Number</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Document Number</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
                {/* </ul> */}

              </ul>
            </li>
          ) :
            (
              <li>
                <Tooltip title="Unauthorized Access">
                  <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Master +</label>
                  <a href="javascript:void(0)" style={{ color: 'gray' }}>Master</a>
                </Tooltip>
                <input type="checkbox" id="drop-2" />
              </li>
            )

          }

          {parmisionRights('Purchase') ? (
            <li>
              <label for="drop-1" class="toggle">Purchase +</label>
              <a href="javascript:void(0)">Purchase</a>
              <input type="checkbox" id="drop-1" />
              <ul>
                <li>
                  <label for="drop-4" class="toggle" style={{ width: '300px' }}>Transaction</label>
                  <a href="javascript:void(0)" style={{ width: '300px' }}>Transaction</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('PurchaseOrderGeneration') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/PurchaseOrderGenerationModule', 'PurchaseOrderGenerationModule')}

                          >
                            Purchase Order Generation
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Purchase Order Generation</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Purchase Order Generation</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('PoShortClosed') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/PoShortClosed', 'PoShortClosed')}

                          >
                            PO ShortClosed
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>PO ShortClosed</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>PO ShortClosed</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('ViewPurchaseOrder') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/PurchaseOrderView', 'PurchaseOrderView')}

                          >
                            View Purchase Order
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>View Purchase Order</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>View Purchase Order</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('ForeCastEntry') ? (

                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/ForeCastEntryModule', 'ForeCastEntry')}

                          >
                            Fore Cast Entry
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Fore Cast Entry</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Fore Cast Entry</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('MaterialAllocation') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/MaterialAllocationResult', 'MaterialAllocation')}

                          >
                            Material Allocation
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Material Allocation</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Material Allocation</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SupplierVsItemMaster') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SupplierVsItemMasterResult', 'SupplierVsItemMaster')}

                          >
                            Supplier Vs Item Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Supplier Vs Item Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Supplier Vs Item Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                  </ul>
                </li>
                <li>
                  <label for="drop-4" class="toggle">Approval Administration</label>
                  <a href="javascript:void(0)">Approval Administration</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>

                    {
                      parmisionRights('PriceRevisonApproval') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/PriceRevisionApproval', 'PriceRevisionApproval')}

                          >
                            Price Revison Approval
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Price Revison Approval</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Price Revison Approval</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('AuthoriseDocuments') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/AuthoriseDocumentsModule', 'AuthoriseDocumentsModule')}

                          >
                            Authorise Documents
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Authorise Documents</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Authorise Documents</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('OpeningBalanceApproval') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/OpeningBalanceApproval', 'OpeningBalanceApproval')}

                          >
                            Opening Balance Approval
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Opening Balance Approval</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Opening Balance Approval</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                  </ul>
                </li>
                <li>
                  <label for="drop-4" class="toggle">Report</label>
                  <a href="javascript:void(0)">Report</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    <li style={{ width: '300px', left: '300px' }}><Link
                      onClick={(e) => openInNewTab('/PurchaseOrderReport')}

                    >Purchase Order Report</Link></li>
                    {
                      parmisionRights('RM/BOIIndentReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/RMBOIIndentReportResult', 'RMBOIIndentReport')}

                          >
                            RM/BOI Indent Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>RM/BOI Indent Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>RM/BOI Indent Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('MinMaxStatusReport') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/MinMaxStatusReport', 'MinMaxStatusReport')}

                        >Min Max Status Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Min Max Status Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Min Max Status Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SRNShortageReport') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/SRNShortageReport', 'SRNShortageReport')}

                        >SRN Shortage Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>SRN Shortage Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>SRN Shortage Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('SRNShortageReport') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/PoAuthorizationReport', 'PoAuthorizationReport')}

                        >PO Authorization Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>PO Authorization Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>PO Authorization Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('SupplierVsItemListReport') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/SupplierVsItemListReport', 'SupplierVsItemListReport')}

                        >Supplier Vs Items Rate List Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Supplier Vs Items Rate List Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Supplier Vs Items Rate List Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('PurchaseReceiptReport') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/PurchaseReceiptReport', 'PurchaseReceiptReport')}

                        >Purchase vs Receipt Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Purchase vs Receipt Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Purchase vs Receipt Report</a>

                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('SRNShortageReport') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/SupplierDeliveryRating', 'SupplierDeliveryRating')}

                        >Supplier Delivery rating Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Supplier Delivery rating Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Supplier Delivery rating Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('ForeCastVsPo') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/ForeCastVsPo', 'ForeCastVsPo')}

                        >Forecast Vs PO</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Forecast Vs PO</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Forecast Vs PO</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('PriceRevisionHistoryReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/PriceRevisionHistoryReport', 'PriceRevisionHistory')}

                          >
                            Price Revision History Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Price Revision History Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray', }}>  Price Revision History Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                  </ul>

                </li>
              </ul>
            </li>
          ) :
            (<li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Purchase +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Purchase</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>)
          }


          {parmisionRights('Store') ? (
            <li>
              <label for="drop-1" class="toggle">Store +</label>
              <a href="javascript:void(0)">Store</a>
              <input type="checkbox" id="drop-1" />
              <ul>
                <li>
                  <label for="drop-4" class="toggle" style={{ width: '300px' }}>Transaction</label>
                  <a href="javascript:void(0)" style={{ width: '300px' }}>Transaction</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('PurchaseBillAgainstPO') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/PurchaseBillAgainstPOModule')}
                            onClick={(e) => openInNewTab('/PurchaseBillAgaintPOModule', 'PurchaseBillAgaintPO')}

                          >
                            Purchase Bill Against PO
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Purchase Bill Against PO</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Purchase Bill Against PO</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('PurchaseBillWithoutPO') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/PurchaseBillWithoutPOModule', 'PurchaseBillWithoutPO')}

                          >
                            Purchase Bill Without PO
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Purchase Bill Without PO</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Purchase Bill Without PO</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('MaterialIssue') ? (
                        <li style={{ width: '300px', left: '300px' }}><Link
                          onClick={(e) => openInNewTab('/NewMaterialIsseResult', 'NewMaterialIsseResult')}
                        //  target='_blank' to='/MaterialIssueResult'
                        // onClick={(e) => openInNewTab(e, '/MaterialIssueResult')}
                        >Material Issue</Link></li>

                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Material Issue</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Material Issue</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SrnShortClosed') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SrnShortClosed', 'SrnShortClosed')}

                          >
                            SRN ShortClosed
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>SRN ShortClosed</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>SRN ShortClosed</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('StoresRequestNote') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/StoresRequestNote', 'StoresRequestNote')}

                          >
                            Stores Request Note
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Stores Request Note</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Stores Request Note</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('MaterialReturnNote') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/MaterialReturnNoteList', 'MaterialReturnNote')}

                          >
                            Material Return Note
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Material Return Note</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Material Return Note</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('OpeningBalanceUpload') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/OpeningBalanceUpload', 'OpeningBalanceUpload')}
                          //  target='_blank' to='/StoresRequestNote'
                          // onClick={(e) => openInNewTab(e, '/StoresRequestNote')}
                          >
                            Opening Balance Upload
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Opening Balance Upload</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Opening Balance Upload</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {parmisionRights('SFGVerification') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/NewSfgVarificationResult', 'NewSfgVarificationResult')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >SFG Verification</Link></li>

                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>SFG Verification </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>SFG Verification</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                    {parmisionRights('ViewJobWorkIssue') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/JobWorkIssueModal', 'JobWorkIssue')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Job Work Issue / DC</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Job Work Issue / DC</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Job Work Issue / DC</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('ViewJobWorkIssue') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/JobWork_Receipt', 'JobWork_Receipt')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Job Work Receipt</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Job Work Receipt</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Job Work Receipt</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('StoreItemReference') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/StoreItemReference', 'StoreItemReference')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Store Item Reference</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Store Item Reference</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Store Item Reference</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('StockTransfer') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/StockTransfer', 'StockTransfer')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Stock Transfer</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Stock Transfer</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Stock Transfer</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                    {parmisionRights('ItemConsumptionTrend') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/ItemConsumptionTrend', 'ItemConsumptionTrend')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Item Consumption Trend</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Item Consumption Trend</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Item Consumption Trend</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                  </ul>
                </li>

                <li>
                  <label for="drop-4" class="toggle" style={{ width: '300px' }}>Report</label>
                  <a href="javascript:void(0)" style={{ width: '300px' }}>Report</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    <li style={{ width: '300px', left: '300px' }}><Link
                      onClick={(e) => openInNewTab('/PurchasebillWithoutReport')}
                    //  target='_blank' to='/PurchaseOrderReport'
                    // onClick={(e) => openInNewTab(e, '/PurchaseOrderReport')}
                    >Purchase Bill Summary Report</Link></li>
                    <li style={{ width: '300px', left: '300px' }}><Link
                      onClick={(e) => openInNewTab('/PurchaseOrderAganistPOReport')}
                    //  target='_blank' to='/PurchaseOrderReport'
                    // onClick={(e) => openInNewTab(e, '/PurchaseOrderReport')}
                    >Purchase Bill Detailed Report</Link></li>
                    {parmisionRights('StockLedgerReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/StockLedgerReportList', 'StockLedgerReport')}
                      //  target='_blank' to='/SfgViewResult'
                      // onClick={(e) => openInNewTab(e, '/SfgViewResult')}
                      >Stock Ledger Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Stock Ledger Report</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Stock Ledger Report</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('StockBalanceReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/StockBalanceReport', 'StockBalanceReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Stock Balance Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Stock Balance Report</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Stock Balance Report</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                    {parmisionRights('QuarantineStockReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/QuarantineStockReport', 'QuarantineStockReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Quarantine Stock Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Quarantine Stock Report</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Quarantine Stock Report</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('StockAgeReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/StockAgeReport', 'StockAgeReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Stock Age Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Stock Age Report</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Stock Age Report</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                    {parmisionRights('JobWorkIssueReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/JobWorkIssueReport', 'JobWorkIssueReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >Job Work Issue Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Job Work Issue Report</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Job Work Issue Report</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('MeterailIssueNoteReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/MeterailIssueReport', 'MeterailIssueReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >     Material Issue Note Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Material Issue Note Report </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}> Material Issue Note Report </a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('ITC04IssueReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/ITC04JobworkIssueReport', 'ITC04JobworkIssueReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >  ITC04 Jobwork Issue Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}> ITC04 Jobwork Issue Report </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}> ITC04 Jobwork Issue Report </a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('ITC04ReceiptReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/ITC04JobworkReceiptReport', 'ITC04JobworkReceiptReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      >  ITC04 Jobwork Receipt Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}> ITC04 Jobwork Receipt Report </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}> ITC04 Jobwork Receipt Report </a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                    {parmisionRights('LotwiseStockReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/LotwiseStockReport', 'LotwiseStockReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      > Lotwise Stock Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Lotwise Stock Reports </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}> Lotwise Stock Reports </a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                    {parmisionRights('InwardDiscReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/InwardDiscrepancyReport', 'InwardDiscrepancyReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      > Inward Discrepancy Report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Inward Discrepancy Report </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}> Inward Discrepancy Report </a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                    {parmisionRights('InwardDiscReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/MrnReport', 'MrnReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      > MRN Reports</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}> MRN Report </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}> MRN Report </a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('LotwiseStockReport') ? (
                      <li style={{ width: '300px', left: '300px' }}><Link
                        onClick={(e) => openInNewTab('/IndentIssuedReport', 'IndentIssuedReport')}
                      //  target='_blank' to='/SfgVarificationResult'
                      // onClick={(e) => openInNewTab(e, '/SfgVarificationResult')}
                      > Requirement V/S indent issued report</Link></li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Requirement V/S indent issued report </label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}> Requirement V/S indent issued report </a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                  </ul>

                </li>

              </ul>
            </li>
          ) :
            (<li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Store +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Store</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>)
          }

          {parmisionRights('Account') ? (
            <li>
              <label for="drop-1" class="toggle">Account +</label>
              <a href="javascript:void(0)">Account</a>
              <input type="checkbox" id="drop-1" />
              <ul>
                <li>
                  <label for="drop-4" class="toggle" style={{ width: '300px' }}>Transaction</label>
                  <a href="javascript:void(0)" style={{ width: '300px' }}>Transaction</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('CustomerVsItemProcess') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CustomerVsItemProcess', 'CustomerVsItemProcess')}
                          //  target='_blank' to='/PurchaseOrderGenerationModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderGenerationModule')}
                          >
                            Custom vs Item Price
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>  Custom vs Item Price</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>  Custom vs Item Price</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('PoSalesOrderEntry') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/NewPurchaseOrderEntry', 'NewPurchaseOrderEntry')}
                          //  target='_blank' to='/AuthoriseDocumentsModule'
                          // onClick={(e) => openInNewTab(e, '/AuthoriseDocumentsModule')}
                          >
                            Po-Sales Order Entry
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Po-Sales Order Entry</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Po-Sales Order Entry</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('PerformInvoice') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/NewPerformInvoice', 'NewPerformInvoice')}
                          //  target='_blank' to='/PurchaseOrderView'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderView')}
                          >
                            Proforma Invoice/Quotation
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Proforma Invoice/Quotation</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Proforma Invoice/Quotation</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('GSTSalesInvoice') ? (

                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/NewGstInvoice', 'NewGstInvoice')}
                          //  target='_blank' to='/ForeCastEntryModule'
                          // onClick={(e) => openInNewTab(e, '/ForeCastEntryModule')}
                          >
                            GST Sales Invoice
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>  GST Sales Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>  GST Sales Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('GenerateElectronicInvoice') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/GenerateElectronicInvoice', 'GenerateElectronicInvoice')}
                          //  target='_blank' to='/MaterialAllocationResult'
                          // onClick={(e) => openInNewTab(e, '/MaterialAllocationResult')}
                          >
                            Generate E-Invoice
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Generate E-Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Generate E-Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('cancelGSTsalesinvoice') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CancelInvoice', 'CancelInvoice')}
                          //  target='_blank' to='/SupplierVsItemMasterResult'
                          // onClick={(e) => openInNewTab(e, '/SupplierVsItemMasterResult')}
                          >
                            Cancel GST Sales Invoice
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>  Cancel GST Sales Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>   Cancel GST Sales Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('CreditNote/SalesReturn') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SalesReturn', 'SalesReturn')}
                          //  target='_blank' to='/StoresRequestNote'
                          // onClick={(e) => openInNewTab(e, '/StoresRequestNote')}
                          >
                            Credit Note/Sales Return
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Credit Note/Sales Return</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Credit Note/Sales Return</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('NonReturnableDC') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/NewNRDCEntry', 'NewNRDCEntry')}
                          //  target='_blank' to='/StoresRequestNote'
                          // onClick={(e) => openInNewTab(e, '/StoresRequestNote')}
                          >
                            Non Returnable DC
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>     Non Returnable DC</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>     Non Returnable DC</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('CustomerDC') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/NewCustomerDc', 'NewCustomerDc')}
                          //  target='_blank' to='/StoresRequestNote'
                          // onClick={(e) => openInNewTab(e, '/StoresRequestNote')}
                          >
                            Customer DC
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Customer DC</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Customer DC</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('MultiXML') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/MultiXMLPrint', 'MultiXMLPrint')}
                          //  target='_blank' to='/StoresRequestNote'
                          // onClick={(e) => openInNewTab(e, '/StoresRequestNote')}
                          >
                            Multi XML
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Multi XML</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Multi XML</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                  </ul>
                </li>
                <li>
                  <label for="drop-4" class="toggle">Master</label>
                  <a href="javascript:void(0)">Master</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>

                    {
                      parmisionRights('TransporterMaster') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/AccMasterList', 'AccMasterList')}
                          //  target='_blank' to='/PriceRevisionApproval'
                          // onClick={(e) => openInNewTab(e, '/PriceRevisionApproval')}
                          >
                            Transporter Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>   Transporter Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>   Transporter Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('DispatchMaster') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/AccDispatchList', 'AccDispatchList')}
                          //  target='_blank' to='/AuthoriseDocumentsModule'
                          // onClick={(e) => openInNewTab(e, '/AuthoriseDocumentsModule')}
                          >
                            Dispatch Master
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Dispatch Master</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Dispatch Master</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('MapCustomerPODC') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/FGItemViewResult', 'FGItemViewResult')}
                          //  target='_blank' to='/AuthoriseDocumentsModule'
                          // onClick={(e) => openInNewTab(e, '/AuthoriseDocumentsModule')}
                          >
                            Map Customer PO & DC
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>  Map Customer PO & DC</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>  Map Customer PO & DC</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('ShortdDocument') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/ShortCloseDocument', 'ShortCloseDocument')}
                          //  target='_blank' to='/AuthoriseDocumentsModule'
                          // onClick={(e) => openInNewTab(e, '/AuthoriseDocumentsModule')}
                          >
                            Short Closed Document  </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>    Short Closed Document  </label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>    Short Closed Document  </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                  </ul>
                </li>
                <li>
                  <label for="drop-4" class="toggle">Report</label>
                  <a href="javascript:void(0)">Report</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('SalesInvoiceReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SalesInvoiceReport', 'SalesInvoiceReport')}
                          //  target='_blank' to='/PurchaseOrderGenerationModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderGenerationModule')}
                          >
                            Sales Invoice
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Sales Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Sales Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SalesInvoiceReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/Cancel_Invoice_Report', 'Cancel_Invoice_Report')}
                          //  target='_blank' to='/PurchaseOrderGenerationModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderGenerationModule')}
                          >
                            Cancel Sales Invoice
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Cancel Sales Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Cancel Sales Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SalesInvoiceReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CancelSummarizedReport', 'CancelSummarizedReport')}
                          //  target='_blank' to='/PurchaseOrderGenerationModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderGenerationModule')}
                          >
                            Cancel Summarized Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Cancel Summarized Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Cancel Summarized Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('ItemwiseReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/ItemwiseReport', 'ItemwiseReport')}
                          //  target='_blank' to='/AuthoriseDocumentsModule'
                          // onClick={(e) => openInNewTab(e, '/AuthoriseDocumentsModule')}
                          >
                            Item Invoice
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Item Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Item Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SalesRegisterReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/SalesRegisterReport', 'SalesRegisterReport')}
                          //  target='_blank' to='/PurchaseOrderView'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderView')}
                          >
                            Sales Register
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Sales Register</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Sales Register</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SalesRegisterReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/Customer_POList_Report', 'Customer_POList_Report')}
                          //  target='_blank' to='/PurchaseOrderView'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderView')}
                          >
                            Customer POList
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Customer POList </label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Customer POList </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('SalesRegisterReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/Credit_Note_Report', 'Credit_Note_Report')}

                          >
                            Credit Note
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Credit Note  </label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Credit Note  </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('CustPoReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/PurchaseBillAgainstPOModule')}
                            onClick={(e) => openInNewTab('/CustPoReport', 'CustPoReport')}
                          //  target='_blank' to='/PurchaseBillAgainstPOModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseBillAgainstPOModule')}
                          >
                            SO-Cust PO Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>SO-Cust PO Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>SO-Cust PO Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('CustomerDCReportList') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CustomerDCReportList', 'CustomerDCReportList')}

                          >
                            Customer DC Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Customer DC Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Customer DC Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('CustomerVsItemPriceReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CustomerVsItemReport', 'CustomerVsItemReport')}
                          // onClick={(e) => openInNewTab('/PurchaseBillWithoutPOModule')}
                          //  target='_blank' to='/PurchaseBillWithoutPOModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseBillWithoutPOModule')}
                          >
                            Customer Vs Item Price Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>       Customer Vs Item Price Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>       Customer Vs Item Price Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('NrdcItemWise') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/NRDCItemReport', 'NRDCItemReport')}
                          // onClick={(e) => openInNewTab('/PurchaseBillWithoutPOModule')}
                          //  target='_blank' to='/PurchaseBillWithoutPOModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseBillWithoutPOModule')}
                          >
                            NRDC Item Wise Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>  NRDC Item Wise Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>  NRDC Item Wise Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('NrdcItemWise') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/NRDCCutomerReport', 'NRDCCutomerReport')}
                          // onClick={(e) => openInNewTab('/PurchaseBillWithoutPOModule')}
                          //  target='_blank' to='/PurchaseBillWithoutPOModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseBillWithoutPOModule')}
                          >
                            NRDC Customer Wise Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>  NRDC Customer Wise Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>  NRDC Customer Wise Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('NrdcItemWise') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/DailyStockReport', 'DailyStockReport')}
                          // onClick={(e) => openInNewTab('/PurchaseBillWithoutPOModule')}
                          //  target='_blank' to='/PurchaseBillWithoutPOModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseBillWithoutPOModule')}
                          >
                            Daily Stock Report
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Daily Stock Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Daily Stock Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                  </ul>
                </li>

                <li>
                  <label for="drop-4" class="toggle">Authorise</label>
                  <a href="javascript:void(0)">Authorise</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('CustomerPriceRevisionApproval') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CustomerPriceRevisionApproval', 'CustomerPriceRevisionApproval')}
                          //  target='_blank' to='/PurchaseOrderGenerationModule'
                          // onClick={(e) => openInNewTab(e, '/PurchaseOrderGenerationModule')}
                          >
                            Price Revision Approval
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Sales Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Sales Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('AuthoriseCancelinvoice') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => openInNewTab('/CancelInvoiceAuthorization', 'CancelInvoiceAuthorization')}
                          //  target='_blank' to='/AuthoriseDocumentsModule'
                          // onClick={(e) => openInNewTab(e, '/AuthoriseDocumentsModule')}
                          >
                            Authorise Cancel Invoice
                          </Link>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}> Authorise Cancel Invoice</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}> Authorise Cancel Invoice</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                  </ul>
                </li>
              </ul>
            </li>
          ) :
            (<li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Account +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Account</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>)
          }

          {parmisionRights('Planning') ? (
            <li>
              <label for="drop-1" class="toggle">Planning +</label>
              <a href="javascript:void(0)">Planning</a>
              <input type="checkbox" id="drop-1" />
              <ul>
                {/* PLANNING MODULE */}
                <li>
                  <label for="drop-4" class="toggle">Production</label>
                  <a href="javascript:void(0)">Production</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('CSL') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/CSLimportResult')}
                            onClick={(e) => {

                              openInNewTab('/CSLimportResult', 'CSLimportResult');

                            }}
                          //  target='_blank' to='/CSLimportResult'
                          // onClick={(e) => openInNewTab(e, '/CSLimportResult')}
                          >CSL</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>CSL</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>CSL</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('OrderInput') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/SalesResult')}
                            onClick={(e) => {

                              openInNewTab('/SalesResult', 'SalesResult');

                            }}
                          //  target='_blank' to='/SalesResult'
                          // onClick={(e) => openInNewTab(e, '/SalesResult')}
                          >Order Input / BOQ</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Order Input</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Order Input</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('OrderPlanning') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/OrderPlaningResult')}

                            onClick={(e) => {

                              openInNewTab('/OrderPlaningResult', 'OrderPlaning');

                            }}
                          //  target='_blank' to='/OrderPlaningResult'
                          // onClick={(e) => openInNewTab(e, '/OrderPlaningResult')}
                          >Production Planning And Control</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Order Planning</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Order Planning</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('OrderStatusReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/OrderPlaningResult')}

                            onClick={(e) => {

                              openInNewTab('/OrderStatusReport', 'OrderStatusReport');

                            }}
                          //  target='_blank' to='/OrderPlaningResult'
                          // onClick={(e) => openInNewTab(e, '/OrderPlaningResult')}
                          >Order Status Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Order Status Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Order Status Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('MachineandAssemblyPlaning') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/MachinePlanningTab')}
                            onClick={(e) => {

                              openInNewTab('/MachinePlanningTab', 'MachinePlanningTab');

                            }}
                          //  target='_blank' to='/MachinePlanningTab'
                          // onClick={(e) => openInNewTab(e, '/MachinePlanningTab')}
                          >Machine and Assembly Planing</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Machine and Assembly Planing</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Machine and Assembly Planing</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('PlanReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/PlanReportResult')}
                            onClick={(e) => {

                              openInNewTab('/ReportTabsList', 'ReportTabsList');

                            }}

                          >Plan Report</Link>
                          {/* <ul>
                            <li style={{ width: '300px', left: '300px' }}>
                              <Link

                                // onClick={(e) => openInNewTab('/PlanReportResult')}
                                onClick={(e) => {

                                  openInNewTab('/ReportTabsList', 'ReportTabsList');

                                }}
                              //  target='_blank' to='/PlanReportResult'
                              // onClick={(e) => openInNewTab(e, '/PlanReportResult')}
                              >Report</Link>
                            </li>
                          </ul> */}
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Plan Report</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Plan Report</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('JobCard') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/JabCardView')}
                            onClick={(e) => {

                              // openInNewTab('/JabCardView', 'JabCardView'); OLD JOBCARD VIEW SANJITH
                              openInNewTab('/JobCardViewNewResult', 'JabCardView');

                            }}
                          //  target='_blank' to='/JabCardView'
                          // onClick={(e) => openInNewTab(e, '/JabCardView')}
                          >Job Card</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Job Card </label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Job Card </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('SupervisJobCard') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/JabCardView')}
                            onClick={(e) => {

                              openInNewTab('/SupervisorModule', 'SupervisorModule');

                            }}
                          //  target='_blank' to='/JabCardView'
                          // onClick={(e) => openInNewTab(e, '/JabCardView')}
                          >Supervisor Job Card </Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Supervisor Job Card </label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Supervisor Job Card </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }

                    {
                      parmisionRights('AssemblyUser') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/JabCardView')}
                            onClick={(e) => {

                              openInNewTab('/AssemblyUser', 'AssemblyUser');

                            }}

                          >Assembly User</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Assembly User</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Assembly User</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }
                    {
                      parmisionRights('AssemblyUser') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/JabCardView')}
                            onClick={(e) => {

                              openInNewTab('/RevisedPlan', 'RevisedPlan');

                            }}
                          //  target='_blank' to='/JabCardView'
                          // onClick={(e) => openInNewTab(e, '/JabCardView')}
                          >Revised Plan</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Revised Plan</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Revised Plan</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }


                    {
                      parmisionRights('Scrap') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            onClick={(e) => {
                              openInNewTab('/ScrapModule', 'ScrapModule');
                            }}
                          >
                            Scrap
                          </Link>
                          <ul>
                            <li style={{ width: '300px', left: '300px' }}>
                              <Link
                                onClick={(e) => {
                                  openInNewTab('/ScrapModule', 'ScrapModule');
                                }}
                              >
                                Scrap Master
                              </Link>
                            </li>
                            <li style={{ width: '300px', left: '300px' }}>
                              <Link
                                onClick={(e) => {
                                  openInNewTab('/ScrapReport', 'ScrapReport');
                                }}
                              >
                                Scrap Report
                              </Link>
                            </li>
                            <li style={{ width: '300px', left: '300px' }}>
                              <Link
                                onClick={(e) => {
                                  openInNewTab('/PaintSludgeReport', 'PaintSludgeReport');
                                }}
                              >
                                Paint Sludge Report
                              </Link>
                            </li>
                            <li style={{ width: '300px', left: '300px' }}>
                              <Link
                                onClick={(e) => {
                                  openInNewTab('/ScrapAnalysisReport', 'ScrapAnalysisReport');
                                }}
                              >
                                Scrap Analysis Report
                              </Link>
                            </li>
                          </ul>
                        </li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label htmlFor="drop-2" className="toggle" style={{ color: 'gray' }}>Scrap</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Scrap</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }



                  </ul>
                </li>

                {/* ASSEMBLY USER PALNNING */}
                <li>
                  <label for="drop-4" class="toggle">Assembly Production</label>
                  <a href="javascript:void(0)">Assembly Production</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('AssemblyOrderInput') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/SalesResult')}
                            onClick={(e) => {

                              openInNewTab('/SalesResultAssembly', 'SalesResultAssembly');

                            }}
                          //  target='_blank' to='/SalesResult'
                          // onClick={(e) => openInNewTab(e, '/SalesResult')}
                          >Assembly Order Input</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Assembly Order Input</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Assembly Order Input</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                  </ul>
                </li>
                {
                  parmisionRights('BOM') ? (
                    <li style={{ width: '300px' }}>
                      {/* <Tooltip title={userDetails.userRole === "Admin" ? "" : "Unauthorized Access"}> */}
                      <Link
                        onClick={(e) => {

                          openInNewTab('/BomModule', 'BomModule');

                        }}

                      //  target='_blank' to='/BomModule'
                      // onClick={(e) => openInNewTab(e, '/BomModule')}
                      >BOM</Link>
                      {/* </Tooltip> */}
                    </li>
                  ) : (
                    <li style={{ width: '300px', }}>
                      <Tooltip title="Unauthorized Access">
                        <label for="drop-2" class="toggle" style={{ color: 'gray' }}>BOM</label>
                        <a href="javascript:void(0)" style={{ color: 'gray' }}>BOM</a>
                      </Tooltip>
                      <input type="checkbox" id="drop-2" />
                    </li>
                  )}

                {
                  parmisionRights('MKD') ? (
                    <li style={{ width: '300px' }}>
                      <Link
                        // onClick={(e) => openInNewTab('/MkdResult')}
                        onClick={(e) => {

                          openInNewTab('/MkdResult', 'MkdResult');

                        }}

                      //  target='_blank' to='/MkdResult'
                      // onClick={(e) => openInNewTab(e, '/MkdResult')}
                      >MKD</Link>
                    </li>
                  ) : (
                    <li style={{ width: '300px', }}>
                      <Tooltip title="Unauthorized Access">
                        <label for="drop-2" class="toggle" style={{ color: 'gray' }}>MKD</label>
                        <a href="javascript:void(0)" style={{ color: 'gray' }}>MKD</a>
                      </Tooltip>
                      <input type="checkbox" id="drop-2" />
                    </li>
                  )}

                {
                  parmisionRights('ItemVsProcess') ? (
                    <li>
                      <label for="drop-4" class="toggle"
                      // style={{ color: userDetails.userRole === "Admin" ? '#ffffff' : 'gray' }}
                      >Item Vs Process</label>
                      <a href="javascript:void(0)" >Item Vs Process</a>
                      <input type="checkbox" id="drop-4" />
                      <ul>
                        {
                          parmisionRights('ItemVsProcessAllocation') ? (
                            <li style={{ width: '300px', left: '300px' }}>
                              <Link
                                // onClick={(e) => openInNewTab('/ItemVsProcess')}
                                onClick={(e) => {

                                  openInNewTab('/ItemVsProcess', 'ItemVsProcess');

                                }}

                              //  target='_blank' to='/ItemVsProcess'
                              // onClick={(e) => openInNewTab(e, '/ItemVsProcess')}
                              >Item Vs Process Allocation</Link>
                            </li>
                          ) : (
                            <li style={{ width: '300px', left: '300px' }}>
                              <Tooltip title="Unauthorized Access">
                                <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Item Vs Process Allocation</label>
                                <a href="javascript:void(0)" style={{ color: 'gray' }}>Item Vs Process Allocation</a>
                              </Tooltip>
                              <input type="checkbox" id="drop-2" />
                            </li>
                          )}

                        {
                          parmisionRights('ItemVsProcessView') ? (
                            <li style={{ width: '300px', left: '300px' }}>
                              <Link
                                // onClick={(e) => openInNewTab('/ItemVsProcessView')}
                                onClick={(e) => {

                                  openInNewTab('/ItemVsProcessView', 'ItemVsProcessView');

                                }}

                              //  target='_blank' to='/ItemVsProcessView'
                              // onClick={(e) => openInNewTab(e, '/ItemVsProcessView')}
                              >Item Vs Process View</Link>
                            </li>
                          ) : (
                            <li style={{ width: '300px', left: '300px' }}>
                              <Tooltip title="Unauthorized Access">
                                <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Item Vs Process View</label>
                                <a href="javascript:void(0)" style={{ color: 'gray' }}>Item Vs Process View</a>
                              </Tooltip>
                              <input type="checkbox" id="drop-2" />
                            </li>
                          )}
                      </ul>
                    </li>
                  ) : (
                    <li style={{ width: '300px', }}>
                      <Tooltip title="Unauthorized Access">
                        <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Item Vs Process</label>
                        <a href="javascript:void(0)" style={{ color: 'gray' }}>Item Vs Process</a>
                      </Tooltip>
                      <input type="checkbox" id="drop-2" />
                    </li>
                  )
                }
                {
                  parmisionRights('AuthorizePlanning') ? (
                    <li style={{ width: '300px' }}>
                      {/* <Tooltip title={userDetails.userRole === "Admin" ? "" : "Unauthorized Access"}> */}
                      <Link
                        onClick={(e) => {

                          openInNewTab('/AuthorizePlanning', 'AuthorizePlanning');

                        }}

                      //  target='_blank' to='/BomModule'
                      // onClick={(e) => openInNewTab(e, '/BomModule')}
                      >Authorize Planning Document</Link>
                      {/* </Tooltip> */}
                    </li>
                  ) : (
                    <li style={{ width: '300px', }}>
                      <Tooltip title="Unauthorized Access">
                        <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Authorize Planning Document</label>
                        <a href="javascript:void(0)" style={{ color: 'gray' }}>Authorize Planning Document</a>
                      </Tooltip>
                      <input type="checkbox" id="drop-2" />
                    </li>
                  )}
                {/* /////////Tool List/// */}
                <li>
                  <label for="drop-4" class="toggle">Tool</label>
                  <a href="javascript:void(0)">Tool</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {
                      parmisionRights('AddTool') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/SalesResult')}
                            onClick={(e) => openInNewTab('/ToolResult', 'ToolResult')}

                          //  target='_blank' to='/SalesResult'
                          // onClick={(e) => openInNewTab(e, '/SalesResult')}
                          >Add Tool
                          </Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Add Tools+</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Add Tools</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('AddTool') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/CSLimportResult')}
                            onClick={(e) => openInNewTab('/ToolMappingModule', 'ToolMappingModule')}

                          //  target='_blank' to='/CSLimportResult'
                          // onClick={(e) => openInNewTab(e, '/CSLimportResult')}
                          >Tool Mapping</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Mapping +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Mapping</a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )
                    }


                    {
                      parmisionRights('ToolMonitoring') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/OrderPlaningResult')}

                            onClick={(e) => {

                              openInNewTab('/ToolMonitoringResult', 'ToolMonitoring');

                            }}

                          >Tool Monitoring</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Monitoring +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Monitoring </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('ToolGrinding') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link
                            // onClick={(e) => openInNewTab('/OrderPlaningResult')}

                            onClick={(e) => {

                              openInNewTab('/ToolGrindingResult', 'ToolGrinding');

                            }}

                          >Tool Grinding</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Grinding +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Grinding </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                    {
                      parmisionRights('ToolComplaint') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/MachinePlanningTab')}
                            onClick={(e) => {

                              openInNewTab('/ToolComplaintsResult', 'ToolComplaint');

                            }}
                          //  target='_blank' to='/MachinePlanningTab'
                          // onClick={(e) => openInNewTab(e, '/MachinePlanningTab')}
                          >Tool Broken</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Broken +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Broken </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('ToolComplaint') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/MachinePlanningTab')}
                            onClick={(e) => {

                              openInNewTab('/MaintenanceSchedule', 'MaintenanceSchedule');

                            }}
                          //  target='_blank' to='/MachinePlanningTab'
                          // onClick={(e) => openInNewTab(e, '/MachinePlanningTab')}
                          >Tool Maintenance</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Maintenance +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Maintenance </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('ToolComplaint') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/MachinePlanningTab')}
                            onClick={(e) => {

                              openInNewTab('/MaintenanceApproval', 'MaintenanceApproval');

                            }}
                          //  target='_blank' to='/MachinePlanningTab'
                          // onClick={(e) => openInNewTab(e, '/MachinePlanningTab')}
                          >Tool Maintenance Approval</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Maintenance Approval +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Maintenance Approval </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('ToolComplaint') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/MachinePlanningTab')}
                            onClick={(e) => {

                              openInNewTab('/MaintenanceStatus', 'MaintenanceStatus');

                            }}
                          //  target='_blank' to='/MachinePlanningTab'
                          // onClick={(e) => openInNewTab(e, '/MachinePlanningTab')}
                          >Tool Maintenance Status</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Maintenance Status +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Maintenance Status </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}
                    {
                      parmisionRights('ToolReport') ? (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Link

                            // onClick={(e) => openInNewTab('/MachinePlanningTab')}
                            onClick={(e) => {

                              openInNewTab('/ToolUsageReport', 'ToolUsageReport');

                            }}
                          //  target='_blank' to='/MachinePlanningTab'
                          // onClick={(e) => openInNewTab(e, '/MachinePlanningTab')}
                          >Tool Report</Link></li>
                      ) : (
                        <li style={{ width: '300px', left: '300px' }}>
                          <Tooltip title="Unauthorized Access">
                            <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Tool Report +</label>
                            <a href="javascript:void(0)" style={{ color: 'gray' }}>Tool Report </a>
                          </Tooltip>
                          <input type="checkbox" id="drop-2" />
                        </li>
                      )}

                  </ul>
                </li>
              </ul>
            </li>
          ) :
            (<li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Planning +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Planning</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>)
          }


          {
            parmisionRights('Quality') ? (
              <li>
                <label htmlFor="drop-1" className="toggle">Quality +</label>
                <a href="javascript:void(0)">Quality</a>
                <input type="checkbox" id="drop-1" />
                <ul>
                  {
                    parmisionRights('QualityMaster') ? (
                      <li style={{ width: '300px' }}><Link
                        onClick={(e) => openInNewTab('/QualityMstList', 'QualityMstList')}
                      //  target='_blank' to='/QualityMstList'
                      // onClick={(e) => openInNewTab(e, '/QualityMstList')}
                      >Quality Master</Link></li>
                    ) : (
                      <li>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Quality Master</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Quality Master</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                  {
                    parmisionRights('QualityTemplate') ? (
                      <li style={{ width: '300px' }}><Link
                        onClick={(e) => openInNewTab('/QualityTemplateResult', 'QualityTemplateResult')}
                      //  target='_blank' to='/QualityTemplateResult'
                      // onClick={(e) => openInNewTab(e, '/QualityTemplateResult')}
                      >Quality Template</Link></li>
                    ) : (
                      <li>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Quality Template</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Quality Template</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                  {
                    parmisionRights('PartProcessVsInspection') ? (
                      <li style={{ width: '300px' }}><Link
                        onClick={(e) => openInNewTab('/PartProcessVsInspectionResult', 'PartProcessVsInspection')}

                      >Part Process Vs Inspection</Link></li>
                    ) : (
                      <li>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Part Process Vs Inspection</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Part Process Vs Inspection</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                  {
                    parmisionRights('Rejection/ReworkReason') ? (
                      <li style={{ width: '300px' }}><Link
                        onClick={(e) => openInNewTab('/RejectionAndRework', 'RejectionAndRework')}

                      >Rejection/Rework Reason</Link></li>

                    ) : (
                      <li>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Rejection/Rework Reason</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Rejection/Rework Reason</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}


                  {
                    parmisionRights('QualitySetting') ? (
                      <li style={{ width: '300px' }}><Link
                        onClick={(e) => openInNewTab('/QualitySetting', 'QualitySetting')}

                      >Quality Setting</Link></li>

                    ) : (
                      <li>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Quality Setting</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Quality Setting</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                  {
                    parmisionRights('ProcessInspection') ? (
                      <li style={{ width: '300px' }}><Link
                        onClick={(e) => openInNewTab('/QualityInspectionTab', 'QualityInspectionTab')}

                      >Process Inspection</Link></li>
                    ) : (
                      <li>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Process Inspection</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Process Inspection</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                  {
                    parmisionRights('Report') ? (
                      <li style={{ width: '300px' }}>
                        <Link

                        >Report</Link>
                        <ul>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              // onClick={(e) => openInNewTab('/PlanReportResult')}
                              onClick={(e) => {

                                openInNewTab('/FPIReportTitle', 'FPIReportTitle');

                              }}

                            >Production Report</Link>
                          </li>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              onClick={(e) => {

                                openInNewTab('/QualityAssemblyReportTab', 'QualityAssemblyReportTab');

                              }}

                            >Assembly Report</Link>
                          </li>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              // onClick={(e) => openInNewTab('/PlanReportResult')}
                              onClick={(e) => {

                                openInNewTab('/FPIProcessInwardTitle', 'ProcessInwardReport');

                              }}

                            >Inward Report</Link>
                          </li>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              // onClick={(e) => openInNewTab('/PlanReportResult')}
                              onClick={(e) => {

                                openInNewTab('/FPYTrendsReport', 'FPYTrendsReport');

                              }}

                            >F.P.Y TREND Report</Link>
                          </li>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              // onClick={(e) => openInNewTab('/PlanReportResult')}
                              onClick={(e) => {

                                openInNewTab('/COPQReport', 'COPQReport');

                              }}

                            >COPQ Report</Link>
                          </li>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              // onClick={(e) => openInNewTab('/PlanReportResult')}
                              onClick={(e) => {

                                openInNewTab('/PPMCalculationReport', 'PPMCalculationReport');

                              }}

                            >PPM Calculation Report</Link>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Report</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Report</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )
                  }

                  {
                    parmisionRights('Report') ? (
                      <li style={{ width: '300px' }}>
                        <Link

                        >Rejected Items</Link>
                        <ul>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              // onClick={(e) => openInNewTab('/PlanReportResult')}
                              onClick={(e) => {

                                openInNewTab('/RejectedItemsResult', 'RejectedItemsResult');

                              }}

                            >Production Rejected Items</Link>
                          </li>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link


                              onClick={(e) => {

                                openInNewTab('/QualityAssemblyRejectedTab', 'QualityAssemblyRejectedTab');

                              }}

                            >Assembly Rejected Items</Link>
                          </li>
                          <li style={{ width: '300px', left: '300px' }}>
                            <Link

                              // onClick={(e) => openInNewTab('/PlanReportResult')}
                              onClick={(e) => {

                                // openInNewTab('/AssemblyRejectedItemsResult', 'AssemblyRejectedItemsResult');
                                openInNewTab('/InwardRejectedItemsResult', 'InwardRejectedItemsResult');

                              }}

                            >Inward Rejected Items</Link>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-2" class="toggle" style={{ color: 'gray' }}>Rejected Items</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>Rejected Items</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )
                  }
                  {
                    parmisionRights('COPQList') ? (
                      <li style={{ width: '300px' }}><Link
                        onClick={(e) => openInNewTab('/RateMasterTablist', 'RateMasterTablist')}

                      >COPQ</Link></li>
                    ) : (
                      <li>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>COPQ</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>COPQ</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                </ul>
              </li>
            ) :
              (<li>
                <Tooltip title="Unauthorized Access">
                  <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Quality +</label>
                  <a href="javascript:void(0)" style={{ color: 'gray' }}>Quality</a>
                </Tooltip>
                <input type="checkbox" id="drop-2" />
              </li>)
          }


          {parmisionRights('NPD') ? (
            <li>
              <label for="drop-1" class="toggle">NPD  +</label>
              <a href="javascript:void(0)">NPD </a>
              <input type="checkbox" id="drop-1" />
              <ul>
                {parmisionRights('AddFile') ? (
                  <li style={{ width: '300px' }}><Link
                    onClick={(e) => openInNewTab('/NpdResult', 'Npd')}
                  //  target='_blank' to='/NpdResult'
                  // onClick={(e) => openInNewTab(e, '/NpdResult')}
                  >Add File</Link></li>
                ) : (
                  <li style={{ width: '300px' }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Add File</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Add File</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )
                }
                {/* <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/FileTypeResult')}
                //  target='_blank' to='/FileTypeResult'
                // onClick={(e) => openInNewTab(e, '/FileTypeResult')}
                >Add File Type Master</Link></li> */}
                {parmisionRights('DeletedLog') ? (
                  <li style={{ width: '300px' }}><Link
                    onClick={(e) => openInNewTab('/DeletLog', 'DeletLog')}
                  //  target='_blank' to='/DeletLog'
                  // onClick={(e) => openInNewTab(e, '/DeletLog')}
                  >Deleted Log</Link></li>
                ) : (
                  <li style={{ width: '300px' }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Deleted Log</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Deleted Log</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
                {/* <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/NPDPlanResult')}
                //  target='_blank' to='/NPDPlanResult'
                // onClick={(e) => openInNewTab(e, '/NPDPlanResult')}
                >NPD Plan</Link></li> */}


                <li>
                  <label for="drop-4" class="toggle">NPD Production</label>
                  <a href="javascript:void(0)">NPD Production</a>
                  <input type="checkbox" id="drop-4" />
                  <ul>
                    {/* {parmisionRights('OrderInput') ? ( */}
                    {parmisionRights('NPDOrderInput') ? (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Link
                          // style={{ color: userDetails.userRole === "Admin" ? '#ffffff' : 'gray' }}
                          // onClick={(e) => openInNewTab('/CSLimportResult')}
                          onClick={(e) => {
                            // if (userDetails.userRole === "Admin") {
                            openInNewTab('/ProductionResult', 'Production');
                            // } else {
                            //   e.preventDefault();
                            // }
                          }}

                        //  target='_blank' to='/CSLimportResult'
                        // onClick={(e) => openInNewTab(e, '/CSLimportResult')}
                        >NPD Order Input</Link>
                      </li>
                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>NPD Order Input</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>NPD Order Input</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}
                    {parmisionRights('NPDOrderPlanning') ? (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Link
                          // onClick={(e) => openInNewTab('/SalesResult')}
                          onClick={(e) => {
                            // if (userDetails.userRole === "Admin" || userDetails.userRole === "Assembly") {
                            openInNewTab('/OrderPlaningNpdResult', 'OrderPlaningNpd');
                            // } else {
                            //   e.preventDefault();
                            // }
                          }}
                        //  target='_blank' to='/SalesResult'
                        // onClick={(e) => openInNewTab(e, '/SalesResult')}
                        >NPD Order Planning</Link>
                      </li>

                    ) : (
                      <li style={{ width: '300px', left: '300px' }}>
                        <Tooltip title="Unauthorized Access">
                          <label for="drop-1" class="toggle" style={{ color: 'gray' }}>NPD Order Planning</label>
                          <a href="javascript:void(0)" style={{ color: 'gray' }}>NPD Order Planning</a>
                        </Tooltip>
                        <input type="checkbox" id="drop-2" />
                      </li>
                    )}

                  </ul>
                </li>

              </ul>
            </li>
          ) :
            (<li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>NPD +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>NPD</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>)
          }

          {parmisionRights('Dispatch') ? (
            <li>
              <label for="drop-1" class="toggle">Dispatch +</label>
              <a href="javascript:void(0)">Dispatch</a>
              <input type="checkbox" id="drop-1" />
              <ul>
                {/* <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/DispatchResult')}
                //  target='_blank' to='/DispatchResult'
                // onClick={(e) => openInNewTab(e, '/DispatchResult')}
                >Dispatch</Link></li> */}
                {parmisionRights('CreateDel_Note') ? (
                  <li style={{ width: '300px' }}><Link
                    onClick={(e) => openInNewTab('/CreateDeliveryOrderResult', 'CreateDeliveryOrder')}
                  //  target='_blank' to='/CreateDeliveryOrderResult'
                  // onClick={(e) => openInNewTab(e, '/CreateDeliveryOrderResult')}
                  >Create Del_Note</Link></li>
                ) : (
                  <li style={{ width: '300px', }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Create Del_Note</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Create Del_Note</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
                {parmisionRights('CustomerDel_Note') ? (
                  <li style={{ width: '300px' }}><Link
                    onClick={(e) => openInNewTab('/CDispatchOrderResult', 'CDispatchOrder')}
                  //  target='_blank' to='/CDispatchOrderResult'
                  // onClick={(e) => openInNewTab(e, '/CDispatchOrderResult')}
                  >Customer Del_Note</Link></li>
                ) : (
                  <li style={{ width: '300px', }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Customer Del_Note</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Customer Del_Note</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}

                {parmisionRights('DeliveryStatus') ? (
                  <li style={{ width: '300px' }}><Link
                    onClick={(e) => openInNewTab('/DeliveryOrderStatusResult', 'DeliveryOrderStatus')}

                  >Delivery Status</Link></li>
                ) : (
                  <li style={{ width: '300px', }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Delivery Status</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Delivery Status</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
                {parmisionRights('dispatchDashboard') ? (
                  <li style={{ width: '300px' }}>
                    <Link
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        handleDispatchClick(); // Conditional navigation inside
                      }}
                    >
                      Dispatch Dashboard
                    </Link>
                  </li>
                ) : (
                  <li style={{ width: '300px' }}>
                    <Tooltip title="Unauthorized Access">
                      <span style={{ color: 'gray', cursor: 'not-allowed' }}>Dispatch Dashboard</span>
                    </Tooltip>
                  </li>
                )}


                {parmisionRights('PartDispatchDashboard') ? (
                  <li style={{ width: '300px' }}><Link
                    onClick={(e) => openInNewTab('/PartNumberDashboard', 'PartNumberDashboard')}
                  //  target='_blank' to='/DeliveryOrderStatusResult'
                  // onClick={(e) => openInNewTab(e, '/DeliveryOrderStatusResult')}
                  >Part Dispatch DashBoard</Link></li>
                ) : (
                  <li style={{ width: '300px', }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Part Dispatch DashBoard</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Part Dispatch DashBoard</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
                {parmisionRights('SFGStockReport') ? (
                  <li style={{ width: '300px' }}><Link
                    onClick={(e) => openInNewTab('/SFGStockReport', 'SFGStockReport')}
                  //  target='_blank' to='/DeliveryOrderStatusResult'
                  // onClick={(e) => openInNewTab(e, '/DeliveryOrderStatusResult')}
                  >SFG Stock Report</Link></li>
                ) : (
                  <li style={{ width: '300px', }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>SFG Stock Report</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>SFG Stock Report</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}

                {
                  parmisionRights('RemarksMasterResult') ? (
                    <li style={{ width: '300px' }}>
                      <Link
                        onClick={(e) => openInNewTab('/RemarksMasterResult', 'RemarksMasterResult')}
                      //  target='_blank' to='/FileTypeResult'
                      // onClick={(e) => openInNewTab(e, '/FileTypeResult')}
                      >Remarks Master
                      </Link>
                    </li>
                  ) : (
                    <li style={{ width: '300px' }}>
                      <Tooltip title="Unauthorized Access">
                        <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Remarks Master</label>
                        <a href="javascript:void(0)" style={{ color: 'gray', }}>Remarks Master</a>
                      </Tooltip>
                      <input type="checkbox" id="drop-2" />
                    </li>
                  )
                }
                {
                  parmisionRights('Manual_Dispatch_Title') ? (
                    <li style={{ width: '300px' }}>
                      <Link
                        onClick={(e) => openInNewTab('/Manual_Dispatch_Title', 'Manual_Dispatch_Title')}
                      //  target='_blank' to='/FileTypeResult'
                      // onClick={(e) => openInNewTab(e, '/FileTypeResult')}
                      >Manual Dispatch
                      </Link>
                    </li>
                  ) : (
                    <li style={{ width: '300px' }}>
                      <Tooltip title="Unauthorized Access">
                        <label for="drop-2" class="toggle" style={{ color: 'gray', }}>Manual Dispatch</label>
                        <a href="javascript:void(0)" style={{ color: 'gray', }}>Manual Dispatch</a>
                      </Tooltip>
                      <input type="checkbox" id="drop-2" />
                    </li>
                  )
                }
              </ul>
            </li>
          ) :
            (<li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Dispatch +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Dispatch</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>)
          }

          {parmisionRights('Checklist') ? (
            <li>
              <label for="drop-1" class="toggle">Checklist +</label>
              <a href="javascript:void(0)">Checklist</a>
              <input type="checkbox" id="drop-1" />
              <ul>
                <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/AddChecklistResult', 'addchecklist')}
                //  target='_blank' to='/AccMasterList'
                // onClick={(e) => openInNewTab(e, '/AccMasterList')}
                >CheckList</Link></li>
                <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/ChecklistTemplateResult', 'checklist_template')}
                //  target='_blank' to='/AccMasterList'
                // onClick={(e) => openInNewTab(e, '/AccMasterList')}
                >CheckList Template</Link></li>
                <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/ChecklistReport', 'checklist_report')}
                //  target='_blank' to='/AccMasterList'
                // onClick={(e) => openInNewTab(e, '/AccMasterList')}
                >CheckList Report</Link></li>
                {/* <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/CheckListTitleList')}
                //  target='_blank' to='/AccMasterList'
                // onClick={(e) => openInNewTab(e, '/AccMasterList')}
                >CheckList Title</Link></li>
                <li style={{ width: '300px' }}><Link
                  onClick={(e) => openInNewTab('/ChecklistHeaderList')}
                //  target='_blank' to='/AccDispatchList'
                // onClick={(e) => openInNewTab(e, '/AccDispatchList')}
                >CheckList Header</Link></li> */}

              </ul>
            </li>
          ) :
            (<li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Checklist +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Checklist</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>)
          }

          {parmisionRights('Costing') ? (

            <li>
              <label for="drop-4" class="toggle">Costing +</label>
              <a href="javascript:void(0)">Costing </a>
              <input type="checkbox" id="drop-4" />
              <ul>
                {parmisionRights('PriceChangeResult') ? (
                  <li style={{ width: '300px' }}>
                    <Link

                      onClick={(e) => {
                        openInNewTab('/PriceChangeResult', 'PriceChangeResult');
                      }}

                    >Price Change Note </Link>
                  </li>
                ) : (
                  <li style={{ width: '300px' }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Price Change Note</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Price Change Note</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
                {parmisionRights('SOPriceChangeResult') ? (
                  <li style={{ width: '300px' }}>
                    <Link
                      // style={{ color: userDetails.userRole === "Admin" ? '#ffffff' : 'gray' }}
                      // onClick={(e) => openInNewTab('/CSLimportResult')}
                      onClick={(e) => {
                        openInNewTab('/SOPriceChangeResult', 'SOPriceChangeResult');
                      }}
                    //  target='_blank' to='/CSLimportResult'
                    // onClick={(e) => openInNewTab(e, '/CSLimportResult')}
                    >SO Price Verification</Link>
                  </li>
                ) : (
                  <li style={{ width: '300px' }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>SO Price Verification</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>SO Price Verification</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}
              </ul>
            </li>
          ) : (
            <li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Costing +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Costing</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>
          )}

          {parmisionRights('ShopfloorDocuments') ? (
            <li>
              <label for="drop-4" class="toggle">Shopfloor Documents +</label>
              <a href="javascript:void(0)">Shopfloor Documents </a>
              <input type="checkbox" id="drop-4" />
              <ul>
                {parmisionRights('ShopfloorDocuments') ? (
                  <li style={{ width: '300px' }}>
                    <Link
                      // style={{ color: userDetails.userRole === "Admin" ? '#ffffff' : 'gray' }}
                      // onClick={(e) => openInNewTab('/CSLimportResult')}
                      onClick={(e) => {
                        openInNewTab('/SkillMatrixResult', 'SkillMatrixResult');
                      }}
                    //  target='_blank' to='/CSLimportResult'
                    // onClick={(e) => openInNewTab(e, '/CSLimportResult')}
                    >Shopfloor Documents</Link>
                  </li>
                ) : (
                  <li style={{ width: '300px' }}>
                    <Tooltip title="Unauthorized Access">
                      <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Shopfloor Documents</label>
                      <a href="javascript:void(0)" style={{ color: 'gray' }}>Shopfloor Documents</a>
                    </Tooltip>
                    <input type="checkbox" id="drop-2" />
                  </li>
                )}

              </ul>
            </li>
          ) : (
            <li>
              <Tooltip title="Unauthorized Access">
                <label for="drop-1" class="toggle" style={{ color: 'gray' }}>Skill Matrix +</label>
                <a href="javascript:void(0)" style={{ color: 'gray' }}>Skill Matrix</a>
              </Tooltip>
              <input type="checkbox" id="drop-2" />
            </li>
          )}

        </ul>
      </nav >
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div >
  );
};

export default MyNavbar;





