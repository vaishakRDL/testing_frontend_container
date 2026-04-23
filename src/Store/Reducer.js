/* eslint-disable  */
import { combineReducers } from "redux";
import MasterReducer from "./MasterReducer";

export default combineReducers({
    config: MasterReducer,
})

