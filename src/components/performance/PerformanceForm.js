import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { createPerformanceReview, updatePerformanceReview, fetchEmployeePerformance } from '../../redux/slices/performanceSlice';

const PerformanceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error } = useSelector((state) => state.performance);

  const [formData, setFormData] = useState({
    employee_id: '',
    review_date: new Date().toISOString().split('T')[0],
    rating: 5,
    comments: '',
    goals: '',
    status: 'pending'
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeePerformance(id));
    }
  }, [dispatch, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updatePerformanceReview({ id, ...formData })).unwrap();
      } else {
        await dispatch(createPerformanceReview(formData)).unwrap();
      }
      navigate('/performance');
    } catch (err) {
      console.error('Failed to save performance review:', err);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">{id ? 'Edit' : 'New'} Performance Review</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Employee</Form.Label>
            <Form.Control
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Review Date</Form.Label>
            <Form.Control
              type="date"
              name="review_date"
              value={formData.review_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating (1-5)</Form.Label>
            <Form.Control
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Goals</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Review'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PerformanceForm; 