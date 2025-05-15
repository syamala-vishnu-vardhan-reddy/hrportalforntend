import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerformances } from '../../redux/slices/performanceSlice';
import { Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PerformanceList = () => {
  const dispatch = useDispatch();
  const { performances, loading, error } = useSelector((state) => state.performance);

  useEffect(() => {
    dispatch(fetchPerformances());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Performance Reviews</h5>
        <Link to="/performance/new">
          <Button variant="primary">New Review</Button>
        </Link>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Review Date</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {performances.map((review) => (
              <tr key={review.id}>
                <td>{review.employee_name}</td>
                <td>{new Date(review.review_date).toLocaleDateString()}</td>
                <td>{review.rating}/5</td>
                <td>
                  <span className={`badge bg-${review.status === 'completed' ? 'success' : 'warning'}`}>
                    {review.status}
                  </span>
                </td>
                <td>
                  <Link to={`/performance/${review.id}`} className="btn btn-sm btn-info me-2">
                    View
                  </Link>
                  <Link to={`/performance/${review.id}/edit`} className="btn btn-sm btn-warning">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PerformanceList; 