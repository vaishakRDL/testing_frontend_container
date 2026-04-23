import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, FormGroup, FormLabel, RadioGroup, Radio,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import {
    AddStoreItemMaster,
    StoreItemEdit,
    GetMainLocation,
    GetSubLocation,
    GetProductFinish,
    GetProductFamily,
    GetHSNCode,
    GetUnderLedger,
    GetItemGroup,
    GetUOM
} from '../../../ApiService/LoginPageService';
import MinMaxConsumptionReportTitle from './MinMaxConsumptionReportTitle';

const MinMaxConsumptionReport = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [multiOpen, setMultiOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    //NEW STATE
    const [sItemCode, setSItemCode] = useState('');
    const [sItemName, setSItemName] = useState('');
    const [itemGroup, setItemGroup] = useState('');
    const [selectedUOM, setSelectedUOM] = useState('');
    const [stdRate, setStdRate] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [minStockLevel, setMinStockLevel] = useState('');
    const [maxLevel, setMaxLevel] = useState('');
    const [underLedger, setUnderLedger] = useState('');
    const [reOrder, setReOrder] = useState('');
    const [selectedROL, setSelectedROL] = useState('');
    const [selectedROQ, setSelectedROQ] = useState('');
    const [selfLifeItem, setSelfLifeItem] = useState('');
    const [selectedHNSCode, setSelectedHNSCode] = useState('');
    const [critical, setCritical] = useState('');
    const [mainLocation, setMainLocation] = useState('');
    const [subLocation, setSubLocation] = useState('');
    const [weight, setWeight] = useState('');
    const [productFinish, setProductFinish] = useState('');
    const [productFamily, setProductFamily] = useState('');
    const [base64Image, setBase64Image] = useState(null);


    const [isEdit, setIsEdit] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isActive, setIsActive] = useState(false);
    const [remark, setRemark] = useState('')
    const [rowId, setRowId] = useState('')

    const [mainLocationList, setMainLocationList] = useState([]);
    const [subLocationList, setSubLocationList] = useState([]);
    const [productFinishList, setProductFinishList] = useState([]);
    const [productFamilyList, setProductFamilyList] = useState([]);
    const [hsnCodeList, setHsnCodeList] = useState([]);
    const [underLedgerList, setUnderLedgerList] = useState([]);
    const [itemGroupList, setItemGroupList] = useState([]);
    const [uomList, setUOMList] = useState([]);
    const [imgView, setImgView] = useState('');
    const url = 'http://192.168.1.149:8000/'
    //END NEW STATE

    useEffect(() => {
        // open && GetMainLocation(handleMainLocationSucessShow, handleMainLocationExceptionShow);
        // open && GetSubLocation(handleSubLocationSucessShow, handleSubLocationExceptionShow);
        // open && GetProductFinish(handleProductFinishSucessShow, handleProductFinishExceptionShow);
        // open && GetProductFamily(handleProductFamilySucessShow, handleProductFamilyExceptionShow);
        // open && GetHSNCode(handleHSNCodeSucessShow, handleHSNCodeExceptionShow);
        // open && GetUnderLedger(handleUnderLedgerSucessShow, handleUnderLedgerExceptionShow);
        // open && GetItemGroup(handleItemGroupSucessShow, handleItemGroupExceptionShow);
        // open && GetUOM(handleUOMSucessShow, handleUOMExceptionShow);
        loaderData();
    }, [editeData]);


    const handleSubmit = (e) => {
        e.preventDefault();
        // if (isAddButton) {
        //     AddStoreItemMaster(
        //         {
        //             itmCode: sItemCode,
        //             itmName: sItemName,
        //             itmGroup: itemGroup,
        //             uomList: selectedUOM,
        //             stdRate: stdRate,
        //             inActive: isActive,
        //             reMarks: remark,
        //             file: base64Image,
        //             minStkLvl: minStockLevel,
        //             maxStkLvl: maxLevel,
        //             underLedger: underLedger,
        //             reOrder: reOrder,
        //             rol: selectedROL,
        //             roq: selectedROQ,
        //             shelfLifeItm: selfLifeItem,
        //             hsnCode: selectedHNSCode,
        //             critical: critical,
        //             mainLoc: mainLocation,
        //             subLoc: subLocation,
        //             weight: weight,
        //             productFinish: productFinish,
        //             productFamily: productFamily
        //         }, handleSuccess, handleException
        //     )
        // } else {
        //     StoreItemEdit({
        //         id: rowId,
        //         itmCode: sItemCode,
        //         itmName: sItemName,
        //         itmGroup: itemGroup,
        //         uomList: selectedUOM,
        //         stdRate: stdRate,
        //         inActive: isActive,
        //         reMarks: remark,
        //         file: base64Image,
        //         minStkLvl: minStockLevel,
        //         maxStkLvl: maxLevel,
        //         underLedger: underLedger,
        //         reOrder: reOrder,
        //         rol: selectedROL,
        //         roq: selectedROQ,
        //         shelfLifeItm: selfLifeItem,
        //         hsnCode: selectedHNSCode,
        //         critical: critical,
        //         mainLoc: mainLocation,
        //         subLoc: subLocation,
        //         weight: weight,
        //         productFinish: productFinish,
        //         productFamily: productFamily
        //     }, handleSuccess, handleException)
        // }

    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
        }, 2000);
    };

    // HEADER DROPDOWNS SUCCESS
    // GET MAIN LOCATION
    const handleMainLocationSucessShow = (dataObject) => {
        setMainLocationList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleMainLocationExceptionShow = (errorObject, errorMessage) => {
    }

    // GET SUB LOCATION
    const handleSubLocationSucessShow = (dataObject) => {
        setSubLocationList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleSubLocationExceptionShow = (errorObject, errorMessage) => {
    }

    // GET PRODUCT FINISH
    const handleProductFinishSucessShow = (dataObject) => {
        setProductFinishList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleProductFinishExceptionShow = (errorObject, errorMessage) => {
    }

    // GET PRODUCT FAMILY
    const handleProductFamilySucessShow = (dataObject) => {
        setProductFamilyList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleProductFamilyExceptionShow = (errorObject, errorMessage) => {
    }

    // GET HNS CODE
    const handleHSNCodeSucessShow = (dataObject) => {
        setHsnCodeList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleHSNCodeExceptionShow = (errorObject, errorMessage) => {
    }

    // GET UNDER LEDGER
    const handleUnderLedgerSucessShow = (dataObject) => {
        setUnderLedgerList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleUnderLedgerExceptionShow = (errorObject, errorMessage) => {
    }

    // GET ITEM GROUP
    const handleItemGroupSucessShow = (dataObject) => {
        setItemGroupList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleItemGroupExceptionShow = (errorObject, errorMessage) => {
    }

    // GET ITEM GROUP
    const handleUOMSucessShow = (dataObject) => {
        setUOMList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleUOMExceptionShow = (errorObject, errorMessage) => {
    }


    const ClearData = () => {
        setOpen(false);
        setRefreshData(oldvalue => !oldvalue);
        setSItemCode('');
        setSItemName('');
        setItemGroup('');
        setSelectedUOM('');
        setStdRate('');
        setSelectedFile('');
        setMinStockLevel('');
        setMaxLevel('');
        setUnderLedger('');
        setReOrder('');
        setSelectedROL('');
        setSelectedROQ('');
        setSelfLifeItem('');
        setSelectedHNSCode('');
        setCritical('');
        setMainLocation('');
        setSubLocation('');
        setWeight('');
        setProductFinish('');
        setProductFamily('');
        setBase64Image(null);

        setIsEdit(false);
        setSelectedCategory('')
        setIsActive(false);
        setRemark('')
    }

    const loaderData = () => {
        setRowId(editeData?.id || '')
        setSItemCode(editeData?.itmCode || '');
        setSItemName(editeData?.itmName || '');
        setItemGroup(editeData?.itmGroup || '');
        setSelectedUOM(editeData?.uomList || '');
        setStdRate(editeData?.stdRate || '');
        setSelectedFile(editeData?.file || '');
        setMinStockLevel(editeData?.minStkLvl || '');
        setMaxLevel(editeData?.maxStkLvl || '');
        setUnderLedger(editeData?.underLedger || '');
        setReOrder(editeData?.reOrder || '');
        setSelectedROL(editeData?.rol || '');
        setSelectedROQ(editeData?.roq || '');
        setSelfLifeItem(editeData?.shelfLifeItm || '');
        setSelectedHNSCode(editeData?.hsnCode || '');
        setCritical(editeData?.critical || '');
        setMainLocation(editeData?.mainLoc || '');
        setSubLocation(editeData?.subLoc || '');
        setWeight(editeData?.weight || '');
        setProductFinish(editeData?.productFinish || '');
        setProductFamily(editeData?.productFamily || '');
        setImgView(url + editeData?.file || '');

        // setIsEdit(true);
        setSelectedCategory(editeData?.id || '')
        setIsActive(editeData?.id || '');
        setRemark(editeData?.id || '')
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleCellEdit = (params) => {


    };

    //TOP RIGHT GRID
    const topRightColumns = [
        {
            field: 'headerName',
            headerName: 'Header Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'value',
            headerName: 'Values',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => [
                <FieldsAction selectedRow={params.row} />,
            ],
        },
    ];

    function FieldsAction(props) {
        return (
            <>
                {

                    props.selectedRow.headerName === 'Selected Location' ? (
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={underLedger}
                                size='small'
                                // label="Age"
                                onChange={(e) => setUnderLedger(e.target.value)}
                            >
                                {underLedgerList.map((data) => (

                                    <MenuItem key={data.id} value={data.id}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) :
                        props.selectedRow.headerName === 'Reference No' ? (
                            <TextField
                                fullWidth
                                required
                                size='small'
                                value={minStockLevel}
                                onChange={(e) => setMinStockLevel(e.target.value)}
                            />
                        ) :
                            (
                                <>
                                </>
                            )
                }
            </>
        );

    }

    const HeaderRows = [
        { id: 1, headerName: 'Reference No', value: 'Rupee' },
        {
            id: 2,
            headerName: 'Selected Location',
            value: '',
            isDropDown: true
        }
    ]
    //SEARCH FIELD
    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
            label: 'The Lord of the Rings: The Return of the King',
            year: 2003,
        },
        { label: 'The Good, the Bad and the Ugly', year: 1966 },
        { label: 'Fight Club', year: 1999 },
        {
            label: 'The Lord of the Rings: The Fellowship of the Ring',
            year: 2001,
        },
        {
            label: 'Star Wars: Episode V - The Empire Strikes Back',
            year: 1980,
        },
        { label: 'Forrest Gump', year: 1994 },
        { label: 'Inception', year: 2010 },
        {
            label: 'The Lord of the Rings: The Two Towers',
            year: 2002,
        },
        { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { label: 'Goodfellas', year: 1990 },
        { label: 'The Matrix', year: 1999 },
        { label: 'Seven Samurai', year: 1954 },
        {
            label: 'Star Wars: Episode IV - A New Hope',
            year: 1977,
        },
        { label: 'City of God', year: 2002 },
        { label: 'Se7en', year: 1995 },
        { label: 'The Silence of the Lambs', year: 1991 },
        { label: "It's a Wonderful Life", year: 1946 },
        { label: 'Life Is Beautiful', year: 1997 },
        { label: 'The Usual Suspects', year: 1995 },
        { label: 'Léon: The Professional', year: 1994 },
        { label: 'Spirited Away', year: 2001 },
        { label: 'Saving Private Ryan', year: 1998 },
        { label: 'Once Upon a Time in the West', year: 1968 },
        { label: 'American History X', year: 1998 },
        { label: 'Interstellar', year: 2014 },
        { label: 'Casablanca', year: 1942 },
        { label: 'City Lights', year: 1931 },
        { label: 'Psycho', year: 1960 },
        { label: 'The Green Mile', year: 1999 },
        { label: 'The Intouchables', year: 2011 },
        { label: 'Modern Times', year: 1936 },
        { label: 'Raiders of the Lost Ark', year: 1981 },
        { label: 'Rear Window', year: 1954 },
        { label: 'The Pianist', year: 2002 },
        { label: 'The Departed', year: 2006 },
        { label: 'Terminator 2: Judgment Day', year: 1991 },
        { label: 'Back to the Future', year: 1985 },
        { label: 'Whiplash', year: 2014 },
        { label: 'Gladiator', year: 2000 },
        { label: 'Memento', year: 2000 },
        { label: 'The Prestige', year: 2006 },
        { label: 'The Lion King', year: 1994 },
        { label: 'Apocalypse Now', year: 1979 },
        { label: 'Alien', year: 1979 },
        { label: 'Sunset Boulevard', year: 1950 },
        {
            label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
            year: 1964,
        },
        { label: 'The Great Dictator', year: 1940 },
        { label: 'Cinema Paradiso', year: 1988 },
        { label: 'The Lives of Others', year: 2006 },
        { label: 'Grave of the Fireflies', year: 1988 },
        { label: 'Paths of Glory', year: 1957 },
        { label: 'Django Unchained', year: 2012 },
        { label: 'The Shining', year: 1980 },
        { label: 'WALL·E', year: 2008 },
        { label: 'American Beauty', year: 1999 },
        { label: 'The Dark Knight Rises', year: 2012 },
        { label: 'Princess Mononoke', year: 1997 },
        { label: 'Aliens', year: 1986 },
        { label: 'Oldboy', year: 2003 },
        { label: 'Once Upon a Time in America', year: 1984 },
        { label: 'Witness for the Prosecution', year: 1957 },
        { label: 'Das Boot', year: 1981 },
        { label: 'Citizen Kane', year: 1941 },
        { label: 'North by Northwest', year: 1959 },
        { label: 'Vertigo', year: 1958 },
        {
            label: 'Star Wars: Episode VI - Return of the Jedi',
            year: 1983,
        },
        { label: 'Reservoir Dogs', year: 1992 },
        { label: 'Braveheart', year: 1995 },
        { label: 'M', year: 1931 },
        { label: 'Requiem for a Dream', year: 2000 },
        { label: 'Amélie', year: 2001 },
        { label: 'A Clockwork Orange', year: 1971 },
        { label: 'Like Stars on Earth', year: 2007 },
        { label: 'Taxi Driver', year: 1976 },
        { label: 'Lawrence of Arabia', year: 1962 },
        { label: 'Double Indemnity', year: 1944 },
        {
            label: 'Eternal Sunshine of the Spotless Mind',
            year: 2004,
        },
        { label: 'Amadeus', year: 1984 },
        { label: 'To Kill a Mockingbird', year: 1962 },
        { label: 'Toy Story 3', year: 2010 },
        { label: 'Logan', year: 2017 },
        { label: 'Full Metal Jacket', year: 1987 },
        { label: 'Dangal', year: 2016 },
        { label: 'The Sting', year: 1973 },
        { label: '2001: A Space Odyssey', year: 1968 },
        { label: "Singin' in the Rain", year: 1952 },
        { label: 'Toy Story', year: 1995 },
        { label: 'Bicycle Thieves', year: 1948 },
        { label: 'The Kid', year: 1921 },
        { label: 'Inglourious Basterds', year: 2009 },
        { label: 'Snatch', year: 2000 },
        { label: '3 Idiots', year: 2009 },
        { label: 'Monty Python and the Holy Grail', year: 1975 },
    ];

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        // Check if the selected file meets the dimensions criteria (225x225)
        if (selectedFile) {
            const img = new Image();
            img.src = URL.createObjectURL(selectedFile);
            img.onload = () => {
                // if (img.width === 225 && img.height === 225) {
                // setFile(selectedFile);
                // Convert the selected file to base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBase64Image(reader.result);
                };
                reader.readAsDataURL(selectedFile);
                // } else {
                //     alert('Please upload an image with dimensions 225x225.');
                // }
            };
        }
    };

    //MIDDLE GRID COLUMNS
    const middleGridColumns = [
        {
            field: 'siNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Group
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'partNo',
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
            headerAlign: 'center'
        },
        {
            field: 'partName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Name
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actual Consumption
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Max Consumption',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Max Consumption
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Min Consumption',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Min Consumption
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

        //     ],
        // },
    ];

    //BOTTOM LEFT GRID
    const bottomLeftColumns = [
        {
            field: 'headerName',
            headerName: 'Header Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'value',
            headerName: 'Values',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => [
                <BottomLeftFieldsAction selectedRow={params.row} />,
            ],
        },
    ];

    const BottomLeftHeaderRows = [
        { id: 1, headerName: 'Payment Terms', value: 'Rupee' },
        {
            id: 2,
            headerName: 'GST',
            value: '',
            isDropDown: true
        },
        {
            id: 3,
            headerName: 'Department[Mst]',
            value: '',
            isDropDown: true
        },
        {
            id: 4,
            headerName: 'Delivery Mode',
            value: '',
            isDropDown: false
        },
        {
            id: 5,
            headerName: 'Supply of Mtrl',
            value: '',
            isDropDown: true
        },
        {
            id: 6,
            headerName: 'Spl Instructon 1',
            value: '',
            isDropDown: true
        },
        {
            id: 7,
            headerName: 'Caption',
            value: '',
            isDropDown: true
        }
    ]

    //BOTTOM RIGHT
    const bottomRightGridColumns = [
        {
            field: 'partNo',
            headerName: 'Total Qty',
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'partName',
        //     headerName: 'Gross Amount',
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
    ];

    function BottomLeftFieldsAction(props) {
        return (
            <>
                {

                    props.selectedRow.headerName === 'PO Type' ? (
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={underLedger}
                                size='small'
                                // label="Age"
                                onChange={(e) => setUnderLedger(e.target.value)}
                            >
                                {underLedgerList.map((data) => (

                                    <MenuItem key={data.id} value={data.id}>
                                        {data.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : props.selectedRow.headerName === 'Delivery Mode' ? (
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={reOrder}
                                size='small'
                                label="Age"
                                onChange={(e) => setReOrder(e.target.value)}
                            >
                                <MenuItem value={'BY ROAD'}>BY ROAD</MenuItem>
                                <MenuItem value={'BY AIR'}>BY AIR</MenuItem>
                            </Select>
                        </FormControl>
                    ) : props.selectedRow.headerName === 'Supply of Mtrl' ? (
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selfLifeItem}
                                size='small'
                                label="Age"
                                onChange={(e) => setSelfLifeItem(e.target.value)}
                            >
                                <MenuItem value={'Y'}>Door Delivery</MenuItem>
                                <MenuItem value={'N'}>Freight Extra</MenuItem>
                            </Select>
                        </FormControl>
                    ) : props.selectedRow.headerName === 'Freight Type' ? (
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedHNSCode}
                                label="Age"
                                size='small'
                                onChange={(e) => setSelectedHNSCode(e.target.value)}
                            >
                                <MenuItem value={'Y'}>Paid</MenuItem>
                                <MenuItem value={'N'}>To Pay</MenuItem>
                            </Select>
                        </FormControl>
                    ) :
                        props.selectedRow.headerName === 'Ref No & Date' ? (
                            <TextField
                                fullWidth
                                required
                                value={minStockLevel}
                                onChange={(e) => setMinStockLevel(e.target.value)}
                            />
                        ) :
                            (
                                <>
                                </>
                            )
                }
            </>
        );

    }

    return (
        <div style={{ marginLeft: '25px', marginRight: '25px' }}>
            <MinMaxConsumptionReportTitle />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                <TextField
                                                    fullWidth
                                                    variant="filled"
                                                    required
                                                    type='date'
                                                    size='small'
                                                    value={sItemCode}
                                                    onChange={(e) => setSItemCode(e.target.value)}

                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <Typography style={{ marginTop: '15px' }}>To</Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <TextField
                                                    fullWidth
                                                    // label="Sitem Name"
                                                    // placeholder='Sitem Name'
                                                    variant="filled"
                                                    type='date'
                                                    required
                                                    size='small'
                                                    value={sItemName}
                                                    onChange={(e) => setSItemName(e.target.value)}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>

                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <FormGroup>
                                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Select Item" />
                                                </FormGroup>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <FormGroup>
                                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Select Item Group" />
                                                </FormGroup>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>

                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        name="row-radio-buttons-group"
                                                    >
                                                        <FormControlLabel value="female" control={<Radio />} label="Weekly" />
                                                        <FormControlLabel value="male" control={<Radio />} label="Monthly" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <Button variant="contained">View</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container marginTop={10} marginBottom={10}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        height: '150%',
                                        width: '100%',
                                        '& .super-app-theme--header': {
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'
                                        },
                                    }}
                                >
                                    <DataGrid
                                        rows={[]}
                                        columns={middleGridColumns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '30vh',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',

                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', // Add border to column headers
                                            },
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                    <Grid container>
                                        <Grid item>
                                            <Button variant="contained">Save As XL</Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>

                        </Card>
                    </Grid>
                </Grid>

            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div >
    )
}

export default MinMaxConsumptionReport