// /* eslint-disable  */
// "use strict";

// import {
//     INFO_FETCH,
//     SHOW_VENDOR_MASTER_SUCCESS,
//     SHOW_VENDOR_MASTER_FAILED,
//     SHOW_VENDOR_MASTER,
//     USER_SHOW_UNIT_MASTER,
//     USER_SHOW_UNIT_MASTER_SUCCESS,
//     USER_SHOW_UNIT_MASTER_FAILED,
//     USER_ADD_UNIT_MASTER_FAILED,
//     USER_ADD_UNIT_MASTER_SUCCESS,
//     USER_ADD_UNIT_MASTER,
//     LOCATION_SHOW_UNIT_MASTER,
//     LOCATION_SHOW_UNIT_MASTER_SUCCESS,
//     LOCATION_SHOW_UNIT_MASTER_FAILED,
//     LOCATION_ADD_UNIT_MASTER,
//     LOCATION_ADD_UNIT_MASTER_SUCCESS,
//     LOCATION_ADD_UNIT_MASTER_FAILED,
//     LOCATION_UPDATE_UNIT_MASTER,
//     LOCATION_UPDATE_UNIT_MASTER_SUCCESS,
//     LOCATION_UPDATE_UNIT_MASTER_FAILED,
//     LOCATION_DELETE_UNIT_MASTER_FAILED,
//     LOCATION_DELETE_UNIT_MASTER_SUCCESS,
//     BRANCH_SHOW_UNIT_MASTER,
//     BRANCH_SHOW_UNIT_MASTER_SUCCESS,
//     BRANCH_SHOW_UNIT_MASTER_FAILED,
//     FACILITY_SHOW_UNIT_MASTER,
//     FACILITY_SHOW_UNIT_MASTER_SUCCESS,
//     FACILITY_SHOW_UNIT_MASTER_FAILED,

// } from '../Actions/Type';

// const INITIAL_STATE = {
//     name: "Mallik",

//     userMeasureLoader: false,
//     userMeasureList: [],

//     userAddMeasureLoader: false,
//     userAddMeasureList: [],

//     locationShowLoader: false,
//     locationShowList: [],

//     locationAddLoader: false,
//     locationAddList: [],

//     locationUpdateLoader: false,
//     locationUpdateList: [],

//     locationDeleteLoader: false,
//     locationDeleteList: [],

//     vendorMeasureLoader: false,
//     vendorMeasureList: [],

//     branchShowLoader: false,
//     branchShowList: [],

//     facilityShowLoader: false,
//     facilityShowList: [],
// };

// export default (state = INITIAL_STATE, action) => {
//     console.log('action----->', action.type);

//     switch (action.type) {
//         case INFO_FETCH:
//             return { ...state, name: action.payload };
//         // ---------USER COMPONETS------- //
//         // --------USER-SHOW---------//
//         case USER_SHOW_UNIT_MASTER:
//             return { ...state, userMeasureLoader: true };
//         case USER_SHOW_UNIT_MASTER_SUCCESS:
//             return { ...state, userMeasureList: action.payload, userMeasureLoader: false };
//         case USER_SHOW_UNIT_MASTER_FAILED:
//             return { ...state, userMeasureLoader: false };
//         // --------USER-ADD---------//
//         case USER_ADD_UNIT_MASTER:
//             return { ...state, userAddMeasureLoader: true };
//         case USER_ADD_UNIT_MASTER_SUCCESS:
//             return { ...state, userAddMeasureList: action.payload, userAddMeasureLoader: false };
//         case USER_ADD_UNIT_MASTER_FAILED:
//             return { ...state, userAddMeasureLoader: false };

//         // ---------LOCATION COMPONETS------- //
//         // --------LOCATION-SHOW---------//
//         case LOCATION_SHOW_UNIT_MASTER:
//             return { ...state, locationShowLoader: true };
//         case LOCATION_SHOW_UNIT_MASTER_SUCCESS:
//             return { ...state, locationShowList: action.payload, locationShowLoader: false };
//         case LOCATION_SHOW_UNIT_MASTER_FAILED:
//             return { ...state, locationShowLoader: false };
//         // --------LOCATION-ADD---------//
//         case LOCATION_ADD_UNIT_MASTER:
//             return { ...state, locationAddLoader: true };
//         case LOCATION_ADD_UNIT_MASTER_SUCCESS:
//             return { ...state, locationAddLoader: action.payload, locationAddLoader: false };
//         case LOCATION_ADD_UNIT_MASTER_FAILED:
//             return { ...state, locationAddLoader: false };
//         // --------LOCATION-UPDATE---------//
//         case LOCATION_UPDATE_UNIT_MASTER:
//             return { ...state, locationUpdateLoader: true };
//         case LOCATION_UPDATE_UNIT_MASTER_SUCCESS:
//             return { ...state, locationUpdateList: action.payload, locationUpdateLoader: false };
//         case LOCATION_UPDATE_UNIT_MASTER_FAILED:
//             return { ...state, locationUpdateLoader: false };
//         // --------LOCATION-DELETE---------//
//         case LOCATION_DELETE_UNIT_MASTER_FAILED:
//             return { ...state, locationDeleteLoader: true };
//         case LOCATION_DELETE_UNIT_MASTER_SUCCESS:
//             return { ...state, locationDeleteList: action.payload, locationDeleteLoader: false };
//         case LOCATION_DELETE_UNIT_MASTER_FAILED:
//             return { ...state, locationDeleteLoader: false };

//         // ---------BRANCH COMPONETS------- //
//         // --------BRANCH-SHOW---------//
//         case BRANCH_SHOW_UNIT_MASTER:
//             return { ...state, branchShowLoader: true };
//         case BRANCH_SHOW_UNIT_MASTER_SUCCESS:
//             return { ...state, branchShowList: action.payload, branchShowLoader: false };
//         case BRANCH_SHOW_UNIT_MASTER_FAILED:
//             return { ...state, branchShowLoader: false };

//         // ---------FACILITY COMPONETS------- //
//         // --------FACILITY-SHOW---------//
//         case FACILITY_SHOW_UNIT_MASTER:
//             return { ...state, facilityShowLoader: true };
//         case FACILITY_SHOW_UNIT_MASTER_SUCCESS:
//             return { ...state, facilityShowList: action.payload, facilityShowLoader: false };
//         case FACILITY_SHOW_UNIT_MASTER_FAILED:
//             return { ...state, facilityShowLoader: false };


//         // --------VENDOR---------//
//         case SHOW_VENDOR_MASTER:
//             return { ...state, vendorMeasureLoader: true };
//         case SHOW_VENDOR_MASTER_SUCCESS:
//             return { ...state, vendorMeasureList: action.payload, vendorMeasureLoader: false };
//         case SHOW_VENDOR_MASTER_FAILED:
//             return { ...state, vendorMeasureLoader: false };
//         default:
//             return state;
//     }
// };