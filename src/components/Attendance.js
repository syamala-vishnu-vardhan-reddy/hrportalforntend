import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAttendance,
  fetchMyAttendance,
  checkIn,
  checkOut,
  updateAttendanceAction
} from '../redux/slices/attendanceSlice';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const Attendance = () => {
  const dispatch = useDispatch();
  const { attendance, myAttendance, loading, error } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user.role === 'admin' || user.role === 'hr') {
      dispatch(fetchAttendance());
    } else {
      dispatch(fetchMyAttendance());
    }
  }, [dispatch, user.role]);

  const handleCheckIn = () => {
    dispatch(checkIn());
  };

  const handleCheckOut = () => {
    dispatch(checkOut());
  };

  const handleUpdateAttendance = (id, data) => {
    dispatch(updateAttendanceAction({ id, data }));
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FaCheck className="text-green-500" />;
      case 'absent':
        return <FaTimes className="text-red-500" />;
      case 'late':
        return <FaClock className="text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>
      
      {/* Check In/Out Section */}
      {user.role === 'employee' && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Check In/Out</h3>
          <div className="flex gap-4">
            <button
              onClick={handleCheckIn}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Check Out
            </button>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            {user.role === 'admin' || user.role === 'hr' ? 'All Attendance Records' : 'My Attendance'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {(user.role === 'admin' || user.role === 'hr') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(user.role === 'admin' || user.role === 'hr' ? attendance : myAttendance).map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.employee_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(record.check_in)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(record.check_out)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className="ml-2">{record.status}</span>
                    </div>
                  </td>
                  {(user.role === 'admin' || user.role === 'hr') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={record.status}
                        onChange={(e) => handleUpdateAttendance(record.id, { status: e.target.value })}
                        className="border rounded px-2 py-1"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance; 