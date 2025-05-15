import { takeLatest, put, call } from 'redux-saga/effects';
import {
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  fetchMyAttendanceStart,
  fetchMyAttendanceSuccess,
  fetchMyAttendanceFailure,
  checkInStart,
  checkInSuccess,
  checkInFailure,
  checkOutStart,
  checkOutSuccess,
  checkOutFailure,
} from '../slices/attendanceSlice';
import { getAttendance, markAttendance } from '../../services/attendanceService';

function* handleFetchAttendance() {
  try {
    const response = yield call(getAttendance);
    yield put(fetchAttendanceSuccess(response.data));
  } catch (error) {
    yield put(fetchAttendanceFailure(error.response?.data?.message || 'Failed to fetch attendance'));
  }
}

function* handleFetchMyAttendance() {
  try {
    const response = yield call(getAttendance, { myAttendance: true });
    yield put(fetchMyAttendanceSuccess(response.data));
  } catch (error) {
    yield put(fetchMyAttendanceFailure(error.response?.data?.message || 'Failed to fetch my attendance'));
  }
}

function* handleCheckIn() {
  try {
    const response = yield call(markAttendance, { type: 'check-in' });
    yield put(checkInSuccess(response.data));
  } catch (error) {
    yield put(checkInFailure(error.response?.data?.message || 'Failed to check in'));
  }
}

function* handleCheckOut() {
  try {
    const response = yield call(markAttendance, { type: 'check-out' });
    yield put(checkOutSuccess(response.data));
  } catch (error) {
    yield put(checkOutFailure(error.response?.data?.message || 'Failed to check out'));
  }
}

export function* attendanceSaga() {
  yield takeLatest(fetchAttendanceStart.type, handleFetchAttendance);
  yield takeLatest(fetchMyAttendanceStart.type, handleFetchMyAttendance);
  yield takeLatest(checkInStart.type, handleCheckIn);
  yield takeLatest(checkOutStart.type, handleCheckOut);
} 