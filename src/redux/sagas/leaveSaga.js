import { takeLatest, put, call } from 'redux-saga/effects';
import {
  fetchLeavesStart,
  fetchLeavesSuccess,
  fetchLeavesFailure,
  fetchMyLeavesStart,
  fetchMyLeavesSuccess,
  fetchMyLeavesFailure,
  applyLeaveStart,
  applyLeaveSuccess,
  applyLeaveFailure,
  updateLeaveStart,
  updateLeaveSuccess,
  updateLeaveFailure,
  updateLeaveStatusStart,
  updateLeaveStatusSuccess,
  updateLeaveStatusFailure,
} from '../slices/leaveSlice';
import { getLeaves, applyLeave, updateLeave } from '../../services/leaveService';

function* handleFetchLeaves() {
  try {
    const response = yield call(getLeaves);
    yield put(fetchLeavesSuccess(response.data));
  } catch (error) {
    yield put(fetchLeavesFailure(error.response?.data?.message || 'Failed to fetch leaves'));
  }
}

function* handleFetchMyLeaves() {
  try {
    const response = yield call(getLeaves, { myLeaves: true });
    yield put(fetchMyLeavesSuccess(response.data));
  } catch (error) {
    yield put(fetchMyLeavesFailure(error.response?.data?.message || 'Failed to fetch my leaves'));
  }
}

function* handleApplyLeave(action) {
  try {
    const response = yield call(applyLeave, action.payload);
    yield put(applyLeaveSuccess(response.data));
  } catch (error) {
    yield put(applyLeaveFailure(error.response?.data?.message || 'Failed to apply leave'));
  }
}

function* handleUpdateLeave(action) {
  try {
    const response = yield call(updateLeave, action.payload.id, action.payload.data);
    yield put(updateLeaveSuccess(response.data));
  } catch (error) {
    yield put(updateLeaveFailure(error.response?.data?.message || 'Failed to update leave'));
  }
}

function* handleUpdateLeaveStatus(action) {
  try {
    const response = yield call(updateLeave, action.payload.id, { status: action.payload.status });
    yield put(updateLeaveStatusSuccess(response.data));
  } catch (error) {
    yield put(updateLeaveStatusFailure(error.response?.data?.message || 'Failed to update leave status'));
  }
}

export function* leaveSaga() {
  yield takeLatest(fetchLeavesStart.type, handleFetchLeaves);
  yield takeLatest(fetchMyLeavesStart.type, handleFetchMyLeaves);
  yield takeLatest(applyLeaveStart.type, handleApplyLeave);
  yield takeLatest(updateLeaveStart.type, handleUpdateLeave);
  yield takeLatest(updateLeaveStatusStart.type, handleUpdateLeaveStatus);
} 