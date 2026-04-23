
import React, { useState, useEffect } from 'react';
import { Autocomplete, Button, ButtonGroup, Card, CardActions, CircularProgress, CardContent, Checkbox, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import SvgIcon from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import { alpha, styled } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { BomDeleteD, BomFetchId, BomItemsDelete, BomItemsShow, BomItemsUpdate, BomItemRowInsert, UpdateNewBomEntry, ToolMappingFetchId, ToolItemsShow, ToolMappingDeleteD, ToolMappingForwardReverseId, UpdateToolMappingEntry } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import DeleteConfirmationDailogBOM from '../../Utility/confirmDeletionBom';
import SearchIcon from '@mui/icons-material/Search';
import ApplicationStore from '../../Utility/localStorageUtil';
import { DownloadAllBomXl, DownloadAllTollMappingExel } from '../../ApiService/DownloadCsvReportsService';
import Popper from '@mui/material/Popper';
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
// import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import AllToolMapping from './AllToolMapping';
import ToolUploadData from './ToolUploadData';
import ToolMappingTittle from './ToolMappingTittle';

function MinusSquare(props) {

    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

function TransitionComponent(props) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
        },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const CustomTreeItem = React.forwardRef((props, ref) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} ref={ref} />
));

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));


// StyledTreeItem and RecursiveTreeView components should be defined if not already defined


const RecursiveTreeView = ({ data }) => (
    <TreeView defaultCollapseIcon={<MinusSquare />} defaultExpandIcon={<PlusSquare />} defaultEndIcon={<CloseSquare />}>
        {data.map((item) => (
            <StyledTreeItem key={item.id} nodeId={item.id} label={item.label || item.label}>
                {item.child && <RecursiveTreeView data={item.child} />}
            </StyledTreeItem>
        ))}
    </TreeView>
);


const ToolMappingModule = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [open, setOpen] = useState(false);
    const [mainId, setMainId] = useState('');
    const [openAllView, setOpenAllView] = useState(false);
    const [itemCodeList, setItemCodeList] = useState([]);
    const [itemCode, setItemCode] = useState('');
    const [itemId, setItemId] = useState('');
    const [treeData, setTreeData] = useState([]);
    const [rows, setRows] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [selectedItem, setselectedItem] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteDailogOpen2, setDeleteDailogOpen2] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [refreshData, setRefreshData] = useState('');
    const [isEditRow, setIsEditRow] = useState(false);
    const [searchedItemId, setSearchedItemId] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemLists, setItemLists] = useState([])
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [insertFlag, setInsertFlag] = useState(false);
    const [downloadloading, setdownloadLoading] = useState(false);
    const [saveloading, setsaveLoading] = useState(false);

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "bom");

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleAddRow = () => {
        // const newRow = {
        //     id: 'temp' + selectedItems.length + 1,
        //     siNo: (selectedItems.length + 1).toString(),
        //     // other columns for the new row
        // };
        // setSelectedItems((prevRows) => [...prevRows, newRow]);

        setSelectedItems((prevItems) => {
            // Check if an item with id: 'RDL001' already exists
            const exists = prevItems.some(item => item.id === 'RDL001');

            // If it doesn't exist, add it; otherwise, return the same array
            if (!exists) {
                return [...prevItems, { id: 'RDL001' }];
            }

            return prevItems;
        });
    };

    const handleAddRowDelete = () => {
        setDeleteDailogOpen2(true);
    };

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [

        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',

        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Name
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            // editable: true
        },
        {
            field: 'uomName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>

                    UOM
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            // editable: true
        },

        {


            field: 'actions',
            type: 'actions',
            headerClassName: 'super-app-theme--header',
            flex: 1,
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>

                    BOM
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <BOMCheck selectedRow={params.row} />,

            ],
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80,
            align: 'center',
            headerAlign: 'center',
            editable: isEditRow
        },
        // {
        //     field: 'jcPart',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Job Card
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     sortable: false,
        //     flex: 1,
        //     minWidth: 80,
        //     align: 'center',
        //     headerAlign: 'center',
        //     editable: isEditRow
        // },
        {
            field: 'jcPart',
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Job Card
                </span>
            ),
            type: 'string',
            sortable: true, // Consider removing this line if you want to disable sorting
            flex: 1,
            minWidth: 80,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const handleChange = (e) => {

                    BomItemsUpdate({
                        id: params.row.id,
                        itemId: params.row.itemId,
                        itemCode: params.row.itemCode,
                        itemName: params.row.itemName,
                        Qty: params.row.Qty,
                        jcPart: e.target.value,
                    }, handleBomItemsUpdateSucess, handleBomItemsUpdateException);

                };

                return (
                    <select disabled={!isEditRow} value={params.row.jcPart} onChange={handleChange}>
                        <option value="N">N</option>
                        <option value="Y">Y</option>
                        <option value="NR">NR</option>
                    </select>
                );
            }
        },
        {
            field: 'actions2',
            type: 'actions',
            headerClassName: 'super-app-theme--header',
            flex: 1,
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions2',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteData selectedRow={params.row} />,

            ],
        },

    ];


    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1) {
                        setDeleteDailogOpen(true);
                        setDeleteId(props.selectedRow.id);
                    }
                }}

            />
        );
    }

    useEffect(() => {

        if (searchId) {
            BomFetchId({
                itemCode: searchId
            }, handleToolFetchIdSuccess, handleToolFetchIdException);
        }
    }, [refreshData]);

    const handleToolItemsShowSuccess = (dataObject) => {
        setItemCodeList(dataObject?.data || []);
    }

    const options = itemCodeList.map(item => ({
        id: item?.id,
        label: item?.itemCode
    }));

    const handleToolItemsShowException = (errorObject, errorMessage) => {
        console.log('error ', errorMessage);

    }

    function BOMCheck(props) {

        return (
            <Checkbox checked={props.selectedRow.isBom === 'N' ? false : true} {...label} />
        );
    }



    const RecursiveTreeView = ({ data }) => {
        return (
            <TreeView
                aria-label="customized"
                defaultExpanded={['1']}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                sx={{ overflowX: 'hidden' }}
            >
                {data.map((item) => (
                    <StyledTreeItem key={item.id} nodeId={item.id} label={item.label}>
                        {item.children && <RecursiveTreeView data={item.children} />}
                    </StyledTreeItem>
                ))}
            </TreeView>
        );
    };

    function handleAutocompleteChange(selectedValue) {
        // Your logic here with the selected value
        setIsEditRow(false)
        console.log("Selected Value:", selectedValue);
        setselectedItem(selectedValue?.label);
        setSearchId(selectedValue?.itemId);
        setSearchedItemId(selectedValue?.id);
        ToolMappingFetchId({
            id: selectedValue?.id
        }, handleToolFetchIdSuccess, handleToolFetchIdException);
    }

    const handleToolFetchIdSuccess = (dataObject) => {
        setTreeData(dataObject?.toolTree || []);
        // // setSelectedItems([...selectedItems, ...dataObject?.data] || []);
        setSelectedItems(dataObject?.data || []);
        // // setRows(dataObject?.data || []);
        // setItemId(dataObject?.data[0]?.bomMstId);
        setMainId(dataObject?.toolTree[0]?.id || []);

    }

    const handleToolFetchIdException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
        setTreeData([]);
        setSelectedItems([]);
        // setRows([]);
    }

    const RecursiveTreeViewComponent = ({ data }) => (
        <TreeView
            aria-label="customized"
            defaultExpanded={['1']}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            sx={{ overflowX: 'hidden' }}
        >
            {data.map((item) => {
                return (
                    <StyledTreeItem key={item.id} nodeId={item.id} label={
                        <div style={{ display: 'flex' }}>
                            <Grid container spacing={2} >
                                <Grid item md={6}>
                                    <Typography style={{ display: 'flex' }}>
                                        {item?.label}
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography style={{ display: 'flex' }}>
                                        {
                                            item?.count ? `Count-${item?.count}` : ''
                                        }

                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    }>
                        {item.child && <RecursiveTreeViewComponent data={item.child} />}
                    </StyledTreeItem>
                );
            })}
        </TreeView>
    );

    // const RecursiveTreeViewComponent = ({ data }) => (
    //     <TreeView
    //         aria-label="customized"
    //         defaultExpanded={['1']}
    //         defaultCollapseIcon={<MinusSquare />}
    //         defaultExpandIcon={<PlusSquare />}
    //         defaultEndIcon={<CloseSquare />}
    //         sx={{ overflowX: 'hidden' }}
    //     >
    //         {data.map((item) => (
    //             <StyledTreeItem key={item.id} nodeId={item.id} label={item.showLabel}>
    //                 {item.child && <RecursiveTreeViewComponent data={item.child} />}
    //             </StyledTreeItem>
    //         ))}
    //     </TreeView>
    // );

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleCellEdit = (params) => {
        const updatedRows = [...rows];
        const index = updatedRows.findIndex((row) => row.id === params.id);
        updatedRows[index][params.field] = params.value;
        console.log("params.valueparams.value", params);

        BomItemsUpdate({
            id: params?.id,
            itemId: params?.itemId,
            itemCode: params.itemCode,
            itemName: params?.itemName || '',
            Qty: params?.Qty || '',
            jcPart: params?.jcPart || "",
        }, handleBomItemsUpdateSucess, handleBomItemsUpdateException);
    }

    const handleBomItemsUpdateSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setIsEditRow(false);
            handleClose();
            BomFetchId({
                itemCode: searchId
            }, handleToolFetchIdSuccess, handleToolFetchIdException);
        }, 3000);


    }

    const handleBomItemsUpdateException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);

    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };

    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };

    const deletehandleSuccess2 = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        // setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen2(false);
            setSearchId('');
            // NEW CODE
            setSelectedItems([]);
            setItemId('');
            setTreeData([]);
        }, 3000);
    };

    const deletehandleException2 = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            setDeleteDailogOpen2(false);
            // setSearchId('');
        }, 3000);
    };

    const onTextSearch = (e) => {
        ToolItemsShow({
            text: e.target.value
        }, handleToolItemsShowSuccess, handleToolItemsShowException);
    }

    const handleExportSuccess = () => {
        setdownloadLoading(false);

        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 2000)
    }
    const handleExportException = () => {
        setdownloadLoading(false);
        setNotification({
            status: true,
            type: 'success',
            message: "Download Failed",
        });
    }

    // SEARCH FILTER
    const handleChange = (e) => {
        BomItemRowInsert({ code: e.target.value }, handleItemSucessShow, handleItemExceptionShow);
    }

    const handleItemSucessShow = (dataObject) => {
        setItemLists(dataObject?.data || []);
    }

    const handleItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleItemChange = (value) => {
        if (value !== null) {
            // const clonedSelectedItems = [...selectedItems];
            // const lastObj = clonedSelectedItems.pop();
            // clonedSelectedItems.push(value, lastObj);
            // setSelectedItems(clonedSelectedItems);
            const updatedSelectedItems = selectedItems.map((item) => {
                if (item.id === 'RDL001') {
                    return { ...item, ...value };
                }
                return item
            })
            setSelectedItems(updatedSelectedItems)
        }
    }

    //CHECKBOX CHANGE
    const isChangeBom = (checked, rowId) => {
        console.log("nnnnnnnnnn", checked)
        const updatedItems = selectedItems.map((item) => {
            if (item.id === rowId) {
                console.log("MATCHED")
                return { ...item, isBom: checked ? 'Y' : 'N' }; // Update the `isBom` property
            }
            return item; // Keep the other items unchanged
        });
        setSelectedItems(updatedItems); // Update the state with the modified array
    };

    // DROPDOWN CHANGE
    const handleDropdownChange = (newValue, itemId) => {
        const updatedItems = selectedItems.map((item) =>
            item.id === itemId ? { ...item, jcPart: newValue } : item
        );
        setSelectedItems(updatedItems); // Update the state
    };

    console.log("selected Items>>>>>>>>>>>", selectedItem);

    // DELETE TABLE ROW
    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
    }

    //TABLE DATA UPDATE
    const handleEdit = (cellNam, newValue, id, rowData) => {
        switch (cellNam) {
            case "count":
                const updatedCount = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'count' ?
                        { ...supp, count: newValue }
                        : supp
                )
                setSelectedItems(updatedCount);
                break;
            default:
        }
    }

    //HANDLE BOM SAVE
    const handleSaveData = () => {
        setsaveLoading(true)
        const updatedArray = selectedItems.map((item) => (
            {
                itemId: item.id,
                count: item.count,
            }
        ))
        UpdateToolMappingEntry({
            itemId: searchedItemId,
            itemCode: selectedItem,
            ToolList: updatedArray
        }, handleToolMappingUpdateSuccess, handleToolMappingUpdateException)
    }

    const handleToolMappingUpdateSuccess = (dataObject) => {
        setsaveLoading(false)

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        ToolMappingForwardReverseId({
            id: searchedItemId, type: 'last'

        }, handleToolFetchIdSuccess, handleToolFetchIdException);

        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleToolMappingUpdateException = (errorObject, errorMessage) => {
        setsaveLoading(false)

        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", selectedItems);
    // Custom Popper for fixing the dropdown to the top
    const CustomPopper = styled(Popper)(({ theme }) => ({
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: theme.zIndex.modal, // Ensure it is above other elements
        width: 300, // Match your Autocomplete width
    }));

    const handleTableRowClick = (index) => {
        // Check if the object with id 'RDL001' already exists
        const doesExist = selectedItems.some(item => item.id === 'RDL001');

        // If it doesn't exist, proceed to insert it
        if (!doesExist && insertFlag) {
            const updatedItems = [...selectedItems];
            updatedItems.splice(index + 1, 0, { id: 'RDL001' });
            setSelectedItems(updatedItems);
        } else {
            console.log("Item with id 'RDL001' already exists. No new row added.");
        }
    }

    const handleForwardReverse = (type, id) => {
        ToolMappingForwardReverseId({
            type: type, id
        }, handleToolFetchIdSuccess, handleToolFetchIdException);
    }
    return (
        <div style={{ height: '70vh', width: '98%', justifyContent: 'space-around', marginLeft: '15px' }}>

            <ToolMappingTittle
                setTreeData={setTreeData}
                setRows={setRows}
            />
            <Grid container spacing={2} alignItems={'center'} style={{ marginTop: '-30px' }} >
                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}
                    style={{
                        // display: 'flex',
                        // alignItems: 'center',
                        // justifyContent: 'center',

                    }}
                >
                    <FormControl style={{ width: '86%' }}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            id="combo-box-demo"
                            size='small'
                            options={options}
                            value={selectedItem}
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Search By Item Code " onChange={onTextSearch} />}
                            onChange={(event, value) => handleAutocompleteChange(value)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', marginTop: "-10px", borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>
                            {/* <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                processRowUpdate={handleCellEdit}
                                sx={{
                                    overflow: 'auto',
                                    height: '55vh',
                                    // minHeight: '500px',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919'

                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696', // Add border to column headers
                                    },
                                }}
                                getRowClassName={(params) => {

                                    const rowIndex = rows.findIndex(row => row.id === params.row.id);

                                    if (rowIndex !== -1) {
                                        console.log(' ');
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            /> */}
                            <div style={{ height: screenHeight - 350, overflow: 'auto', marginBottom: '20px' }}>
                                <table id="customers">
                                    <tr>
                                        {/* <th style={{ whiteSpace: 'nowrap' }}>Item Code</th> */}
                                        <th style={{ whiteSpace: 'nowrap' }}>Machine</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Process</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Tool No</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Count</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
                                        {/* <th style={{ whiteSpace: 'nowrap' }}>BOM</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Job Card</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Actions</th> */}
                                    </tr>
                                    {selectedItems.map((item, index) => (
                                        <tr key={index} onClick={() => handleTableRowClick(index)}>

                                            {/* <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>
                                                {item.itemcode ? <span>{item.itemcode}</span> :
                                                    // <Autocomplete
                                                    //     disablePortal
                                                    //     id="combo-box-demo"
                                                    //     options={itemLists}
                                                    //     getOptionLabel={(option) => `${option.itemCode}` || ''}
                                                    //     sx={{ width: 300 }}
                                                    //     renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                                                    //     onChange={(event, value) => handleItemChange(value)}
                                                    //     size='small'
                                                    // // disabled={isPOView}
                                                    // />
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={itemLists}
                                                        getOptionLabel={(option) => `${option.itemCode}` || ''}
                                                        sx={{ width: 300 }}
                                                        renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                                                        onChange={(event, value) => handleItemChange(value)}
                                                        size="small"
                                                        PopperComponent={(props) => <CustomPopper {...props} />}
                                                    />
                                                }
                                            </td> */}

                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.machineCode}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.process}</td>

                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.toolId}</td>
                                            {/* <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.count}</td> */}
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={isEditRow} onBlur={(e) => handleEdit('count', e.target.textContent, item.id, item)}>{item.count}</td>


                                            <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                {/* {item.id === 'RDL001' ?
                                                    null
                                                    :
                                                    isEditRow ? */}
                                                <DeleteIcon
                                                    onClick={() => {
                                                        handleDeleteRow(item.id)
                                                    }}
                                                    style={{ color: 'black', cursor: 'pointer' }}
                                                />
                                                {/* :
                                                        <DeleteIcon
                                                            style={{ color: 'gray', cursor: 'pointer' }}
                                                        />
                                                } */}
                                            </td>
                                        </tr>))}
                                </table>
                            </div>
                            <Grid container spacing={2}>




                                <Grid item xs={12} sm={12} md={7} lg={7} xl={7}  >
                                    <ButtonGroup variant="contained" aria-label="Basic button group" style={{ flexWrap: 'wrap' }}
                                    >
                                        {/* <Tooltip title="Add">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                                disabled={userPermission[0]?.addData === 0}
                                                onClick={() => {
                                                    handleAddRow()
                                                    setIsEditRow(true)
                                                }}> <AddIcon /></Button>
                                        </Tooltip> */}
                                        <Tooltip title="Edit">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: userPermission[0]?.updateData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.updateData === 0 ? 'black' : 'white' }}
                                                disabled={userPermission[0]?.updateData === 0}
                                                onClick={() => {
                                                    // setIsEditRow(!isEditRow);
                                                    setIsEditRow(true);

                                                }}
                                            // startIcon={isEditRow ? <CloseIcon /> : <EditIcon />}

                                            >
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete ">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: userPermission[0]?.deleteData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.deleteData === 0 ? 'black' : 'white' }}
                                                disabled={userPermission[0]?.deleteData === 0}
                                                onClick={handleAddRowDelete}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Download">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: '#002D68', color: 'white' }}

                                                disabled={downloadloading} onClick={() => {
                                                    setdownloadLoading(true);
                                                    DownloadAllTollMappingExel({ id: searchedItemId }, handleExportSuccess, handleExportException)
                                                }}
                                            >
                                                {downloadloading ? (
                                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                                ) : (
                                                    <DownloadIcon />)}
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Option">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                                disabled={userPermission[0]?.addData === 0}
                                                onClick={() => {
                                                    setOpen(true);
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Save">
                                            <Button variant="contained"
                                                style={{ width: '68px', background: userPermission[0]?.deleteData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.deleteData === 0 ? 'black' : 'white' }}
                                                disabled={userPermission[0]?.deleteData === 0 || saveloading}
                                                // onClick={handleAddRowDelete}
                                                onClick={handleSaveData}
                                            >
                                                {saveloading ? (
                                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                                ) : (
                                                    'Save'
                                                )}
                                            </Button>

                                        </Tooltip>
                                        <Tooltip title="Cancel">
                                            <Button variant="contained"
                                                style={{ width: '68px', background: userPermission[0]?.deleteData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.deleteData === 0 ? 'black' : 'white' }}
                                                disabled={userPermission[0]?.deleteData === 0}
                                                onClick={() => {
                                                    setIsEditRow(false);
                                                }}
                                            //  onClick={handleSaveData}
                                            >Cancel</Button>

                                        </Tooltip>


                                    </ButtonGroup>
                                </Grid>




                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                    <ButtonGroup variant="contained" aria-label="Basic button group" style={{ flexWrap: 'wrap' }}                                    >

                                        <Tooltip title="First">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: '#002D68', color: 'white' }}
                                                onClick={() => handleForwardReverse('first', '')}
                                            >
                                                <FastRewindIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Previous">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: '#002D68', color: 'white' }}
                                                onClick={() => handleForwardReverse('reverse', mainId)}
                                            >
                                                <SkipPreviousIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Search">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: '#002D68', color: 'white' }}
                                                onClick={() => { setOpenAllView(true) }}
                                            >
                                                <SearchIcon />
                                            </Button>
                                        </Tooltip> <Tooltip title="Forward">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: '#002D68', color: 'white' }}
                                                onClick={() => handleForwardReverse('forward', mainId)}
                                            >
                                                <SkipNextIcon />
                                            </Button>
                                        </Tooltip> <Tooltip title="Last">
                                            <Button variant="contained"
                                                style={{ width: '50px', background: '#002D68', color: 'white' }}
                                                onClick={() => handleForwardReverse('last', '')}
                                            >
                                                <FastForwardIcon />
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>

                        </CardContent>

                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '100%', height: '100%', overflow: 'auto' }}>
                        <CardContent>
                            <Box sx={{ height: screenHeight - 297, flexGrow: 1, maxWidth: 600, }}>
                                <RecursiveTreeViewComponent data={treeData} />
                            </Box>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

            <ToolUploadData
                open={open}
                setOpen={setOpen}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <DeleteConfirmationDailogBOM
                open={deleteDailogOpen2}
                setOpen={setDeleteDailogOpen2}
                deleteId={searchedItemId}
                deleteService={ToolMappingDeleteD}
                handleSuccess={deletehandleSuccess2}
                handleException={deletehandleException2}
            />

            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={BomItemsDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

            <AllToolMapping
                setOpenAllView={setOpenAllView}
                openAllView={openAllView}
            />
        </div >
    )
}

export default ToolMappingModule
