import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLeaves,
  fetchMyLeaves,
  applyLeave,
  updateLeave,
  updateLeaveStatus,
} from '../redux/slices/leaveSlice';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Modal,
  Alert,
  Badge,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Leaves = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { leaves, myLeaves, loading, error } = useSelector((state) => state.leave);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
  });

  useEffect(() => {
    if (user.role === 'admin') {
      dispatch(fetchLeaves());
    } else {
      dispatch(fetchMyLeaves());
    }
  }, [dispatch, user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLeave) {
        await dispatch(updateLeave({ id: selectedLeave.id, data: formData }));
      } else {
        await dispatch(applyLeave(formData));
      }
      setShowModal(false);
      setSelectedLeave(null);
      setFormData({
        startDate: '',
        endDate: '',
        type: '',
        reason: '',
      });
    } catch (error) {
      console.error('Error submitting leave:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(updateLeaveStatus({ id, status }));
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setFormData({
      startDate: leave.startDate,
      endDate: leave.endDate,
      type: leave.type,
      reason: leave.reason,
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Leave Management</h2>
          {user.role !== 'admin' && (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedLeave(null);
                setFormData({
                  startDate: '',
                  endDate: '',
                  type: '',
                  reason: '',
                });
                setShowModal(true);
              }}
            >
              Apply for Leave
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h3>{user.role === 'admin' ? 'All Leave Requests' : 'My Leave Requests'}</h3>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    {user.role === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {(user.role === 'admin' ? leaves : myLeaves).map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.employeeName}</td>
                      <td>{leave.type}</td>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.reason}</td>
                      <td>{getStatusBadge(leave.status)}</td>
                      {user.role === 'admin' && (
                        <td>
                          {leave.status === 'pending' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleStatusUpdate(leave.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedLeave ? 'Edit Leave Request' : 'Apply for Leave'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="">Select Type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedLeave ? 'Update' : 'Submit'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Leaves; 