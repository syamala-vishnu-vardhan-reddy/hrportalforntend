import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchLeaves, 
  fetchMyLeaves, 
  applyLeave, 
  updateLeave, 
  deleteLeave 
} from '../../redux/slices/leaveSlice';

const Leaves = () => {
  const dispatch = useDispatch();
  const { leaves, myLeaves, loading, error } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
  });
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchLeaves());
    } else {
      dispatch(fetchMyLeaves());
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedLeave) {
        await dispatch(updateLeave({ id: selectedLeave._id, ...formData })).unwrap();
      } else {
        await dispatch(applyLeave(formData)).unwrap();
      }
      setFormData({
        startDate: '',
        endDate: '',
        type: '',
        reason: '',
      });
      setSelectedLeave(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to submit leave:', err);
    }
  };

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setFormData({
      startDate: leave.startDate.split('T')[0],
      endDate: leave.endDate.split('T')[0],
      type: leave.type,
      reason: leave.reason,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLeave(id)).unwrap();
    } catch (err) {
      console.error('Failed to delete leave:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(updateLeave({ id, status: 'approved' })).unwrap();
    } catch (err) {
      console.error('Failed to approve leave:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(updateLeave({ id, status: 'rejected' })).unwrap();
    } catch (err) {
      console.error('Failed to reject leave:', err);
    }
  };

  const renderLeaveForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Type</option>
          <option value="sick">Sick Leave</option>
          <option value="casual">Casual Leave</option>
          <option value="annual">Annual Leave</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {loading ? 'Submitting...' : isEditing ? 'Update Leave' : 'Apply Leave'}
      </button>
    </form>
  );

  const renderLeavesList = () => {
    const leavesToRender = user?.role === 'admin' ? leaves : myLeaves;
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">
          {user?.role === 'admin' ? 'All Leaves' : 'My Leaves'}
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
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
              {leavesToRender.map((leave) => (
                <tr key={leave._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user?.role === 'admin' ? (
                      <>
                        {leave.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(leave._id)}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(leave._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {leave.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleEdit(leave)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(leave._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isEditing ? 'Edit Leave' : 'Apply for Leave'}
          </h2>
          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {renderLeaveForm()}
          {renderLeavesList()}
        </div>
      </div>
    </div>
  );
};

export default Leaves; 