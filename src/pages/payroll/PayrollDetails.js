import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PayrollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Simulate fetching payroll details
    setTimeout(() => {
      const mockPayroll = {
        id: parseInt(id),
        employeeId: 101,
        employeeName: "John Doe",
        department: "IT",
        position: "Developer",
        month: "January",
        year: "2023",
        basicSalary: 5000,
        allowances: [
          { type: "Housing", amount: 500 },
          { type: "Transportation", amount: 300 },
        ],
        deductions: [
          { type: "Tax", amount: 400 },
          { type: "Insurance", amount: 200 },
        ],
        overtimeHours: 10,
        overtimeRate: 20,
        overtimeAmount: 200,
        grossSalary: 6000,
        netSalary: 5400,
        paymentStatus: "Paid",
        paymentDate: "2023-01-31",
        paymentMethod: "Bank Transfer",
        accountNumber: "XXXX-XXXX-XXXX-1234",
        bankName: "Example Bank",
        notes: "Regular monthly salary",
      };
      setPayroll(mockPayroll);
      setLoading(false);
    }, 1000);
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    return status === "Paid" ? (
      <Badge bg="success">Paid</Badge>
    ) : (
      <Badge bg="warning">Pending</Badge>
    );
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="alert alert-warning" role="alert">
        Payroll record not found
      </div>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Payroll Details</h2>
          <p>
            Payroll for {payroll.month} {payroll.year} - {payroll.employeeName}
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back to List
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Employee Information</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td className="fw-bold">Employee Name:</td>
                    <td>{payroll.employeeName}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Employee ID:</td>
                    <td>{payroll.employeeId}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Department:</td>
                    <td>{payroll.department}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Position:</td>
                    <td>{payroll.position}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Payment Information</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td className="fw-bold">Payment Status:</td>
                    <td>{getStatusBadge(payroll.paymentStatus)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Payment Date:</td>
                    <td>{formatDate(payroll.paymentDate)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Payment Method:</td>
                    <td>{payroll.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Bank Account:</td>
                    <td>{payroll.accountNumber}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Salary Breakdown</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6 className="mb-3">Earnings</h6>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td className="text-end">
                      {formatCurrency(payroll.basicSalary)}
                    </td>
                  </tr>
                  {payroll.allowances.map((allowance, index) => (
                    <tr key={index}>
                      <td>{allowance.type} Allowance</td>
                      <td className="text-end">
                        {formatCurrency(allowance.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      Overtime ({payroll.overtimeHours} hours @{" "}
                      {formatCurrency(payroll.overtimeRate)}/hr)
                    </td>
                    <td className="text-end">
                      {formatCurrency(payroll.overtimeAmount)}
                    </td>
                  </tr>
                  <tr className="table-active">
                    <td className="fw-bold">Gross Salary</td>
                    <td className="text-end fw-bold">
                      {formatCurrency(payroll.grossSalary)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <h6 className="mb-3">Deductions</h6>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.deductions.map((deduction, index) => (
                    <tr key={index}>
                      <td>{deduction.type}</td>
                      <td className="text-end">
                        {formatCurrency(deduction.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="table-active">
                    <td className="fw-bold">Total Deductions</td>
                    <td className="text-end fw-bold">
                      {formatCurrency(
                        payroll.deductions.reduce(
                          (total, deduction) => total + deduction.amount,
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col>
              <h5 className="mb-0">
                Net Salary: {formatCurrency(payroll.netSalary)}
              </h5>
            </Col>
          </Row>
        </Card.Footer>
      </Card>

      {(user?.role === "admin" || user?.role === "hr") && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Administrative Actions</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <Button variant="primary" className="me-2">
                  Download Payslip
                </Button>
                <Button variant="outline-primary" className="me-2">
                  Email Payslip
                </Button>
                {payroll.paymentStatus === "Pending" && (
                  <Button variant="success">Process Payment</Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PayrollDetails;
