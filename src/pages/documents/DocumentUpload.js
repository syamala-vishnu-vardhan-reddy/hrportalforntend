import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    file: null,
  });
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file,
      });
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.file) {
      setError("Please fill in all required fields and select a file");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/documents");
      }, 2000);
    }, 1500);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Upload Document</h2>
          <p>Upload a new document to the company repository</p>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success">
              Document uploaded successfully! Redirecting to documents list...
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Document Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter document title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Policy">Policy</option>
                <option value="Forms">Forms</option>
                <option value="Benefits">Benefits</option>
                <option value="Training">Training</option>
                <option value="Reports">Reports</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter document description"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>File *</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="No file selected"
                  value={fileName}
                  readOnly
                />
                <label className="input-group-text" htmlFor="file-upload">
                  Browse
                </label>
                <input
                  type="file"
                  id="file-upload"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>
              <Form.Text className="text-muted">
                Supported file types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG,
                PNG
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/documents")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || success}
              >
                {loading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DocumentUpload;
