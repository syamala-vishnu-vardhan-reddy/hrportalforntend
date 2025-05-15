import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendance,
  fetchMyAttendance,
  checkIn,
  checkOut,
  updateAttendanceAction,
} from "../redux/slices/attendanceSlice";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Alert,
  Badge,
  Tabs,
  Tab,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";

const Attendance = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { attendance, myAttendance, loading, error } = useSelector(
    (state) => state.attendance
  );
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date().setDate(1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    notes: "",
    workHours: 0,
    overtime: 0,
  });
  const [activeTab, setActiveTab] = useState("attendance");

  useEffect(() => {
    if (user.role === "admin" || user.role === "hr") {
      dispatch(fetchAttendance(dateRange));
    } else {
      dispatch(fetchMyAttendance(dateRange));
    }
  }, [dispatch, user.role, dateRange]);

  const handleCheckIn = async () => {
    try {
      // In a real app, you would get the location from browser's geolocation API
      const location = { coordinates: [0, 0] };
      await dispatch(checkIn({ location }));
    } catch (error) {
      console.error("Error checking in:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      // In a real app, you would get the location from browser's geolocation API
      const location = { coordinates: [0, 0] };
      await dispatch(checkOut({ location }));
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  const handleUpdateAttendance = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateAttendanceAction({ id: selectedAttendance._id, data: formData })
      );
      setShowModal(false);
      setSelectedAttendance(null);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleEdit = (attendance) => {
    setSelectedAttendance(attendance);
    setFormData({
      status: attendance.status,
      notes: attendance.notes || "",
      workHours: attendance.workHours || 0,
      overtime: attendance.overtime || 0,
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      present: "success",
      absent: "danger",
      late: "warning",
      "half-day": "info",
      "on-leave": "secondary",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const todayAttendance = myAttendance.find(
    (a) => new Date(a.date).toDateString() === new Date().toDateString()
  );

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
          <h2>Attendance Management</h2>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="attendance" title="Attendance Records">
          <Row className="mb-3">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h4>Filter by Date</h4>
                  <Form>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                startDate: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                endDate: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            {user.role !== "admin" && user.role !== "hr" && (
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <h4>Today's Attendance</h4>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {todayAttendance ? (
                          <div>
                            <p>
                              <strong>Status:</strong>{" "}
                              {getStatusBadge(todayAttendance.status)}
                            </p>
                            <p>
                              <strong>Check-in:</strong>{" "}
                              {todayAttendance.checkIn
                                ? formatTime(todayAttendance.checkIn.time)
                                : "Not checked in"}
                            </p>
                            <p>
                              <strong>Check-out:</strong>{" "}
                              {todayAttendance.checkOut
                                ? formatTime(todayAttendance.checkOut.time)
                                : "Not checked out"}
                            </p>
                          </div>
                        ) : (
                          <p>No attendance record for today</p>
                        )}
                      </div>
                      <div>
                        <Button
                          variant="success"
                          className="me-2"
                          onClick={handleCheckIn}
                          disabled={todayAttendance && todayAttendance.checkIn}
                        >
                          <FaCheck className="me-1" /> Check In
                        </Button>
                        <Button
                          variant="danger"
                          onClick={handleCheckOut}
                          disabled={
                            !todayAttendance ||
                            !todayAttendance.checkIn ||
                            todayAttendance.checkOut
                          }
                        >
                          <FaTimes className="me-1" /> Check Out
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <h3>
                    {user.role === "admin" || user.role === "hr"
                      ? "All Attendance Records"
                      : "My Attendance Records"}
                  </h3>
                  <Table responsive>
                    <thead>
                      <tr>
                        {(user.role === "admin" || user.role === "hr") && (
                          <th>Employee</th>
                        )}
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Work Hours</th>
                        <th>Overtime</th>
                        <th>Status</th>
                        <th>Notes</th>
                        {(user.role === "admin" || user.role === "hr") && (
                          <th>Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(user.role === "admin" || user.role === "hr"
                        ? attendance
                        : myAttendance
                      ).map((record) => (
                        <tr key={record._id}>
                          {(user.role === "admin" || user.role === "hr") && (
                            <td>
                              {record.employee
                                ? `${record.employee.firstName} ${record.employee.lastName}`
                                : "N/A"}
                            </td>
                          )}
                          <td>{formatDate(record.date)}</td>
                          <td>
                            {record.checkIn
                              ? formatTime(record.checkIn.time)
                              : "N/A"}
                          </td>
                          <td>
                            {record.checkOut
                              ? formatTime(record.checkOut.time)
                              : "N/A"}
                          </td>
                          <td>{record.workHours || 0}</td>
                          <td>{record.overtime || 0}</td>
                          <td>{getStatusBadge(record.status)}</td>
                          <td>{record.notes || "N/A"}</td>
                          {(user.role === "admin" || user.role === "hr") && (
                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleEdit(record)}
                              >
                                Edit
                              </Button>
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
        </Tab>

        {(user.role === "admin" || user.role === "hr") && (
          <Tab eventKey="stats" title="Attendance Statistics">
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <h3>Attendance Overview</h3>
                    <div className="d-flex justify-content-around mb-4">
                      <div className="text-center">
                        <h5>Present</h5>
                        <div className="display-4 text-success">
                          {
                            attendance.filter((a) => a.status === "present")
                              .length
                          }
                        </div>
                      </div>
                      <div className="text-center">
                        <h5>Absent</h5>
                        <div className="display-4 text-danger">
                          {
                            attendance.filter((a) => a.status === "absent")
                              .length
                          }
                        </div>
                      </div>
                      <div className="text-center">
                        <h5>Late</h5>
                        <div className="display-4 text-warning">
                          {attendance.filter((a) => a.status === "late").length}
                        </div>
                      </div>
                      <div className="text-center">
                        <h5>Half Day</h5>
                        <div className="display-4 text-info">
                          {
                            attendance.filter((a) => a.status === "half-day")
                              .length
                          }
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        )}
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Attendance Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateAttendance}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                required
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
                <option value="on-leave">On Leave</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Work Hours</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.workHours}
                onChange={(e) =>
                  setFormData({ ...formData, workHours: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Overtime Hours</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.overtime}
                onChange={(e) =>
                  setFormData({ ...formData, overtime: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Attendance;
