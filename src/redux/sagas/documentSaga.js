import { takeLatest, put, call } from 'redux-saga/effects';
import {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  fetchMyDocumentsStart,
  fetchMyDocumentsSuccess,
  fetchMyDocumentsFailure,
  uploadDocumentStart,
  uploadDocumentSuccess,
  uploadDocumentFailure,
  deleteDocumentStart,
  deleteDocumentSuccess,
  deleteDocumentFailure,
} from '../slices/documentSlice';
import { getDocuments, uploadDocument, deleteDocument } from '../../services/documentService';

// Fetch Documents saga
function* handleFetchDocuments() {
  try {
    const response = yield call(getDocuments);
    yield put(fetchDocumentsSuccess(response.data));
  } catch (error) {
    yield put(fetchDocumentsFailure(error.response?.data?.message || 'Failed to fetch documents'));
  }
}

// Fetch My Documents saga
function* handleFetchMyDocuments() {
  try {
    const response = yield call(getDocuments, { myDocuments: true });
    yield put(fetchMyDocumentsSuccess(response.data));
  } catch (error) {
    yield put(fetchMyDocumentsFailure(error.response?.data?.message || 'Failed to fetch my documents'));
  }
}

// Upload Document saga
function* handleUploadDocument(action) {
  try {
    const response = yield call(uploadDocument, action.payload);
    yield put(uploadDocumentSuccess(response.data));
  } catch (error) {
    yield put(uploadDocumentFailure(error.response?.data?.message || 'Failed to upload document'));
  }
}

// Delete Document saga
function* handleDeleteDocument(action) {
  try {
    const response = yield call(deleteDocument, action.payload);
    yield put(deleteDocumentSuccess(response.data));
  } catch (error) {
    yield put(deleteDocumentFailure(error.response?.data?.message || 'Failed to delete document'));
  }
}

// Root document saga
export function* documentSaga() {
  yield takeLatest(fetchDocumentsStart.type, handleFetchDocuments);
  yield takeLatest(fetchMyDocumentsStart.type, handleFetchMyDocuments);
  yield takeLatest(uploadDocumentStart.type, handleUploadDocument);
  yield takeLatest(deleteDocumentStart.type, handleDeleteDocument);
} 