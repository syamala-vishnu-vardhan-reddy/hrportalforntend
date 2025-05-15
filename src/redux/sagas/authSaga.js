import { takeLatest, call, put } from "redux-saga/effects";
import { login, register, getProfile, fetchProfile } from "../slices/authSlice";
import {
  login as loginService,
  register as registerService,
  getProfile as getProfileService,
  updateProfile as updateProfileService,
  changePassword as changePasswordService,
} from "../../services/authService";

// Saga handlers
function* handleLogin(action) {
  try {
    const response = yield call(loginService, action.payload);
    yield put(login.fulfilled(response.data));
  } catch (error) {
    yield put(login.rejected(error.response?.data?.message || "Login failed"));
  }
}

function* handleRegister(action) {
  try {
    const response = yield call(registerService, action.payload);
    yield put(register.fulfilled(response.data));
  } catch (error) {
    yield put(
      register.rejected(error.response?.data?.message || "Registration failed")
    );
  }
}

function* handleFetchProfile() {
  try {
    const response = yield call(getProfileService);
    yield put(getProfile.fulfilled(response.data));
  } catch (error) {
    yield put(
      getProfile.rejected(
        error.response?.data?.message || "Failed to fetch profile"
      )
    );
  }
}

// Commented out until we fix the missing functions
/*
function* handleUpdateProfile(action) {
  try {
    const response = yield call(updateProfileService, action.payload);
    yield put(updateProfile.fulfilled(response.data));
  } catch (error) {
    yield put(updateProfile.rejected(error.response?.data?.message || 'Failed to update profile'));
  }
}

function* handleChangePassword(action) {
  try {
    const response = yield call(changePasswordService, action.payload);
    yield put(changePassword.fulfilled(response.data));
  } catch (error) {
    yield put(changePassword.rejected(error.response?.data?.message || 'Failed to change password'));
  }
}
*/

// Saga watchers
export function* authSaga() {
  yield takeLatest(login.pending.type, handleLogin);
  yield takeLatest(register.pending.type, handleRegister);
  yield takeLatest(getProfile.pending.type, handleFetchProfile);
  // Commented out until we fix the missing functions
  // yield takeLatest(updateProfile.pending.type, handleUpdateProfile);
  // yield takeLatest(changePassword.pending.type, handleChangePassword);
}
