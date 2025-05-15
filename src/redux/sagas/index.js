import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { leaveSaga } from './leaveSaga';
import { attendanceSaga } from './attendanceSaga';
import { payrollSaga } from './payrollSaga';
import { performanceSaga } from './performanceSaga';
import { documentSaga } from './documentSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    leaveSaga(),
    attendanceSaga(),
    payrollSaga(),
    performanceSaga(),
    documentSaga(),
  ]);
} 