import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import { Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Employees</h5>
        <Link to="/employees/new">
          <Button variant="primary">Add Employee</Button>
        </Link>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>
                  <span className={`badge bg-${employee.isActive ? 'success' : 'danger'}`}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <Link to={`/employees/${employee.id}`} className="btn btn-sm btn-info me-2">View</Link>
                  <Link to={`/employees/${employee.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default EmployeeList; 