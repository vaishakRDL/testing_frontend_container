/* eslint-disable  */
import {
    INFO_FETCH,
    EMPTY_PAYLOAD,
    EMPTY_EMAIL,
    GET,
    POST,
    PUT

} from '../Actions/Type';

import {
    SET_API,
    MALLIK_API_PATH
} from '../Services';

// CUSTOMER GROUP API
export const addCustomerGroup = (PAYLOAD_DATA, Success, Failure) => {
    return async (dispatch) => {
        try {
            const HEADERS = {
                USER_TOKEN: EMPTY_PAYLOAD,
                ID: EMPTY_PAYLOAD
            }
            const addCapacityMeasure = await SET_API(MALLIK_API_PATH.ADD_CUSTOMER_GROUP, POST, PAYLOAD_DATA, HEADERS)
            if (addCapacityMeasure) {
                Success(addCapacityMeasure);
            }
        } catch (error) {
            Failure('ERROR', error.response.data.message)
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