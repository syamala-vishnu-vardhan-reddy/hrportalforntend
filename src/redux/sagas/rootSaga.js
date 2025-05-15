import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
// import { leaveSaga } from './leaveSaga'; // Disabled - using createAsyncThunk directly
import { attendanceSaga } from "./attendanceSaga";
import { payrollSaga } from "./payrollSaga";
import { performanceSaga } from "./performanceSaga";
import { documentSaga } from "./documentSaga";

// Add a console log to show which sagas are running
console.log("Starting sagas: auth, attendance, payroll, performance, document");

export function* rootSaga() {
  yield all([
    authSaga(),
    // leaveSaga(), // Disabled - using createAsyncThunk directly
    attendanceSaga(),
    payrollSaga(),
    performanceSaga(),
    documentSaga(),
  ]);
}
