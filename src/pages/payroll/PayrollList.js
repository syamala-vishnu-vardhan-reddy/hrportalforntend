import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Simulate fetching payroll data
    setTimeout(() => {
      const mockPayrolls = [
        {
          id: 1,
          employeeId: 101,
          employeeName: "John Doe",
          department: "IT",
          position: "Developer",
          month: "January",
          year: "2023",
          basicSalary: 5000,
          allowances: 800,
          deductions: 600,
          netSalary: 5200,
          paymentStatus: "Paid",
          paymentDate: "2023-01-31",
        },
        {
          id: 2,
          employeeId: 102,
          employeeName: "Jane Smith",
          department: "Marketing",
          position: "Marketing Specialist",
          month: "January",
          year: "2023",
          basicSalary: 4500,
          allowances: 700,
          deductions: 500,
          netSalary: 4700,
          paymentStatus: "Paid",
          paymentDate: "2023-01-31",
        },
        {
          id: 3,
          employeeId: 101,
          employeeName: "John Doe",
          department: "IT",
          position: "Developer",
          month: "February",
          year: "2023",
          basicSalary: 5000,
          allowances: 800,
          deductions: 600,
          netSalary: 5200,
          paymentStatus: "Paid",
          paymentDate: "2023-02-28",
        },
        {
          id: 4,
          employeeId: 102,
          employeeName: "Jane Smith",
          department: "Marketing",
          position: "Marketing Specialist",
          month: "February",
          year: "2023",
          basicSalary: 4500,
          allowances: 700,
          deductions: 500,
          netSalary: 4700,
          paymentStatus: "Paid",
          paymentDate: "2023-02-28",
        },
        {
          id: 5,
          employeeId: 101,
          employeeName: "John Doe",
          department: "IT",
          position: "Developer",
          month: "March",
          year: "2023",
          basicSalary: 5000,
          allowances: 900,
          deductions: 600,
          netSalary: 5300,
          paymentStatus: "Pending",
          paymentDate: null,
        },
      ];
      setPayrolls(mockPayrolls);
      setLoading(false);
    }, 1000);
  }, []);

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
      <span className="badge bg-success">Paid</span>
    ) : (
      <span className="badge bg-warning">Pending</span>
    );
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 3; i <= currentYear; i++) {
    years.push(i.toString());
  }

  const filteredPayrolls = payrolls.filter((payroll) => {
    const matchesMonth = filterMonth === "" || payroll.month === filterMonth;
    const matchesYear = filterYear === "" || payroll.year === filterYear;

    // If user is not admin or HR, only show their own payrolls
    if (user?.role !== "admin" && user?.role !== "hr") {
      return matchesMonth && matchesYear && payroll.employeeId === user.id;
    }

    return matchesMonth && matchesYear;
  });

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

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Payroll Management</h2>
          <p>View and manage employee payroll information</p>
        </Col>
        {(user?.role === "admin" || user?.role === "hr") && (
          <Col xs="auto">
            <Button variant="primary" as={Link} to="/payroll/generate">
              Generate Payroll
            </Button>
          </Col>
        )}
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                {(user?.role === "admin" || user?.role === "hr") && (
                  <th>Employee</th>
                )}
                <th>Month/Year</th>
                <th>Basic Salary</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayrolls.map((payroll) => (
                <tr key={payroll.id}>
                  <td>{payroll.id}</td>
                  {(user?.role === "admin" || user?.role === "hr") && (
                    <td>{payroll.employeeName}</td>
                  )}
                  <td>
                    {payroll.month} {payroll.year}
                  </td>
                  <td>{formatCurrency(payroll.basicSalary)}</td>
                  <td>{formatCurrency(payroll.netSalary)}</td>
                  <td>{getStatusBadge(payroll.paymentStatus)}</td>
                  <td>{formatDate(payroll.paymentDate)}</td>
                  <td>
                    <Button
                      variant="outline-info"
                      size="sm"
                      as={Link}
                      to={`/payroll/${payroll.id}`}
                      className="me-2"
                    >
                      View
                    </Button>
                    {(user?.role === "admin" || user?.role === "hr") &&
                      payroll.paymentStatus === "Pending" && (
                        <Button variant="outline-primary" size="sm">
                          Process
                        </Button>
                      )}
                  </td>
                </tr>
              ))}
              {filteredPayrolls.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      user?.role === "admin" || user?.role === "hr" ? 8 : 7
                    }
                    className="text-center"
                  >
                    No payroll records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PayrollList;
