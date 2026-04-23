/* eslint-disable  */
"use strict";

import {
    USER_ADD,
    USER_ADD_SUCCESS,
    USER_ADD_FAILED,
    MASTER_ADD_FAILED,
    MASTER_ADD_SUCCESS,
    ADD_MASTER,
    MASTER_SHOW_FAILED,
    MASTER_SHOW_SUCCESS,
    SHOW_MASTER
} from '../Actions/Type';

const INITIAL_STATE = {
    userLoader: false,
    userList: [],
    masterLoader: false,
    masterList: [],
    


};

export default (state = INITIAL_STATE, action) => {
    console.log('action----->', action.type);

    switch (action.type) {
        case USER_ADD:
            return { ...state, userLoader: true };
        case USER_ADD_SUCCESS:
            return { ...state, userList: action.payload, userLoader: false };
        case USER_ADD_FAILED:
            return { ...state, userLoader: false };

        case ADD_MASTER:
            return { ...state, masterLoader: true };
        case MASTER_ADD_SUCCESS:
            return { ...state, masterList: action.payload, masterLoader: false };
        case MASTER_ADD_FAILED:
            return { ...state, masterLoader: false };
      
        case SHOW_MASTER:
            return { ...state, masterLoader: true };
        case MASTER_SHOW_SUCCESS:
            return { ...state, masterList: action.payload, masterLoader: false };
        case MASTER_SHOW_FAILED:
            return { ...state, masterLoader: false };

        default:
            return state;

    }
};