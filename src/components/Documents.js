import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDocuments,
  fetchMyDocuments,
  uploadDocument,
  deleteDocument,
  updateDocument,
  verifyDocument
} from '../redux/slices/documentSlice';
import { FaUpload, FaDownload, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const Documents = () => {
  const dispatch = useDispatch();
  const { documents, myDocuments, loading, error } = useSelector((state) => state.document);
  const { user } = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user.role === 'admin' || user.role === 'hr') {
      dispatch(fetchDocuments());
    } else {
      dispatch(fetchMyDocuments());
    }
  }, [dispatch, user.role]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile || !documentType) {
      alert('Please select a file and document type');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', documentType);
    formData.append('description', description);

    dispatch(uploadDocument(formData));
    setSelectedFile(null);
    setDocumentType('');
    setDescription('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      dispatch(deleteDocument(id));
    }
  };

  const handleVerify = (id) => {
    dispatch(verifyDocument(id));
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Document Management</h2>

      {/* Upload Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Type</option>
              <option value="id">ID Document</option>
              <option value="certificate">Certificate</option>
              <option value="contract">Contract</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FaUpload className="inline mr-2" />
            Upload
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            {user.role === 'admin' || user.role === 'hr' ? 'All Documents' : 'My Documents'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(user.role === 'admin' || user.role === 'hr' ? documents : myDocuments).map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4">
                    {doc.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(doc.upload_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {doc.verified ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span className="ml-2">{doc.verified ? 'Verified' : 'Pending'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(doc.file_url)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaDownload />
                      </button>
                      {(user.role === 'admin' || user.role === 'hr') && (
                        <>
                          <button
                            onClick={() => handleVerify(doc.id)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents; 