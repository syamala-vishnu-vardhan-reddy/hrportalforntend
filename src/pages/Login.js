import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Container, Form, Button, Alert, Card, Table } from "react-bootstrap";
import { login } from "../redux/slices/authSlice";
import mockUsers from "../mockData/users";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(login(formData)).unwrap();
        // Navigation will be handled by the useEffect hook
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <Container className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <Card.Body>
            <h2 className="text-center mb-4">Welcome Back</h2>
            <p className="text-center text-muted mb-4">
              Please sign in to continue
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  isInvalid={!!formErrors.email}
                  placeholder="Enter your email"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  isInvalid={!!formErrors.password}
                  placeholder="Enter your password"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary">
                    Sign up
                  </Link>
                </p>
              </div>
            </Form>

            <div className="mt-4">
              <h5 className="text-center mb-3">Mock Users (for testing)</h5>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() =>
                        setFormData({
                          email: user.email,
                          password: user.password,
                        })
                      }
                    >
                      <td>{user.role}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p className="text-center text-muted small">
                Click on any row to auto-fill the login form
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
