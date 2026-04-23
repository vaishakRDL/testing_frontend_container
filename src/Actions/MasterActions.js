/* eslint-disable  */
import {
    INFO_FETCH,
    EMPTY_PAYLOAD,
    EMPTY_EMAIL,
    GET,
    POST,
    PUT,
    USER_ADD,
    USER_ADD_SUCCESS,
    USER_ADD_FAILED,
    SHOW_MASTER,
    MASTER_SHOW_FAILED,
    MASTER_SHOW_SUCCESS
} from '../Actions/Type';

import {
    SET_API,
    MALLIK_API_PATH
} from '../Services';

// ADD USER API
export const addUser = (PAYLOAD_DATA, Success, Failure) => {
    return async (dispatch) => {
        try {
            const HEADERS = {
                USER_TOKEN: EMPTY_PAYLOAD,
                ID: EMPTY_PAYLOAD
            }
            const addCapacityMeasure = await SET_API(MALLIK_API_PATH.ADD_USER, POST, PAYLOAD_DATA, HEADERS)
            if (addCapacityMeasure) {
                Success(addCapacityMeasure);
            }
        } catch (error) {
            Failure('ERROR', error.response.data.message)
            return error
        }
    }
}

export const addAllMasterData = (PAYLOAD_DATA, Success, Failure) => {
    return async (dispatch) => {
        try {
            const HEADERS = {
                USER_TOKEN: EMPTY_PAYLOAD,
                ID: EMPTY_PAYLOAD
            }
            const addMaster = await SET_API(MALLIK_API_PATH.ADD_ALL_MASTER, POST, PAYLOAD_DATA, HEADERS)
            if (addMaster) {
                Success(addMaster);
            }
        } catch (error) {
            Failure('ERROR', error.response.data.message)
            return error
        }
    }
}

export const showAllMasterData = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_MASTER })
        try {
            const HEADERS = {
                USER_TOKEN: EMPTY_PAYLOAD,
                ID: EMPTY_PAYLOAD
            }
            const PAYLOAD_DATA = EMPTY_PAYLOAD

            const showMasters = await SET_API(MALLIK_API_PATH.ADD_ALL_MASTER + `${data?.masterType}`, GET, PAYLOAD_DATA, HEADERS)
            if (showMasters) {
                dispatch({ type: MASTER_SHOW_SUCCESS, payload: showMasters.data })
            } else {
                dispatch({ type: MASTER_SHOW_FAILED })
            }
        } catch (error) {
            dispatch({ type: MASTER_SHOW_FAILED })
            return error
        }
    }
}

// export const showCapacityMeasure = () => {
//     return async (dispatch) => {
//         dispatch({ type: SHOW_CAPACITY_MEASURE_TYPE })
//         try {
//             const HEADERS = {
//                 USER_TOKEN: EMPTY_PAYLOAD,
//                 ID: EMPTY_PAYLOAD
//             }
//             const PAYLOAD_DATA = EMPTY_PAYLOAD

//             const showCapacityMeasure = await SET_API(KEWAUNEE_API_PATH.CAPACITY_MEASURE_SHOW, GET, PAYLOAD_DATA, HEADERS)
//             if (showCapacityMeasure) {
//                 dispatch({ type: SHOW_CAPACITY_MEASURE_TYPE_SUCCESS, payload: showCapacityMeasure.data })
//             } else {
//                 dispatch({ type: SHOW_CAPACITY_MEASURE_TYPE_FAILED })
//             }
//         } catch (error) {
//             dispatch({ type: SHOW_CAPACITY_MEASURE_TYPE_FAILED })
//             return error
//         }
//     }
// }

// export const editCapacityMeasure = (PAYLOAD_DATA, Success, Failure) => {
//     return async (dispatch) => {
//         try {
//             const HEADERS = {
//                 USER_TOKEN: EMPTY_PAYLOAD,
//                 ID: EMPTY_PAYLOAD
//             }

//             const editCapacityMeasure = await SET_API(KEWAUNEE_API_PATH.CAPACITY_MEASURE_EDIT + PAYLOAD_DATA.id + '/update', POST, PAYLOAD_DATA, HEADERS)
//             if (editCapacityMeasure) {
//                 Success(editCapacityMeasure)
//             }
//         } catch (error) {
//             Failure('ERROR', error.response.data.message)
//             return error
//         }
//     }
// }

// export const deleteCapacityMeasure = (PAYLOAD_DATA, Success, Failure) => {
//     return async (dispatch) => {
//         try {
//             const HEADERS = {
//                 USER_TOKEN: EMPTY_PAYLOAD,
//                 ID: EMPTY_PAYLOAD
//             }

//             const deleteCapacityMeasure = await SET_API(KEWAUNEE_API_PATH.CAPACITY_MEASURE_DELETE + PAYLOAD_DATA.id + '/delete', POST, PAYLOAD_DATA, HEADERS)
//             if (deleteCapacityMeasure) {
//                 Success(deleteCapacityMeasure)
//             }
//         } catch (error) {
//             Failure('ERROR', error.response.data.message)
//             return error
//         }
//     }
// }