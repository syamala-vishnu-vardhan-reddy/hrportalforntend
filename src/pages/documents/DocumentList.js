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

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Simulate fetching documents
    setTimeout(() => {
      const mockDocuments = [
        {
          id: 1,
          title: "Employee Handbook",
          category: "Policy",
          uploadedBy: "HR Manager",
          uploadDate: "2023-01-15",
          fileSize: "2.5 MB",
          fileType: "PDF",
          downloadUrl: "#",
        },
        {
          id: 2,
          title: "Health Insurance Policy",
          category: "Benefits",
          uploadedBy: "HR Manager",
          uploadDate: "2023-02-10",
          fileSize: "1.8 MB",
          fileType: "PDF",
          downloadUrl: "#",
        },
        {
          id: 3,
          title: "Vacation Request Form",
          category: "Forms",
          uploadedBy: "HR Manager",
          uploadDate: "2023-03-05",
          fileSize: "0.5 MB",
          fileType: "DOCX",
          downloadUrl: "#",
        },
        {
          id: 4,
          title: "Expense Reimbursement Form",
          category: "Forms",
          uploadedBy: "Finance Manager",
          uploadDate: "2023-03-20",
          fileSize: "0.7 MB",
          fileType: "XLSX",
          downloadUrl: "#",
        },
        {
          id: 5,
          title: "Code of Conduct",
          category: "Policy",
          uploadedBy: "HR Manager",
          uploadDate: "2023-04-12",
          fileSize: "1.2 MB",
          fileType: "PDF",
          downloadUrl: "#",
        },
      ];
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "📄";
      case "docx":
      case "doc":
        return "📝";
      case "xlsx":
      case "xls":
        return "📊";
      case "pptx":
      case "ppt":
        return "📑";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(documents.map((doc) => doc.category))];

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
          <h2>Document Management</h2>
          <p>View and download company documents</p>
        </Col>
        {(user?.role === "admin" || user?.role === "hr") && (
          <Col xs="auto">
            <Link to="/documents/upload">
              <Button variant="primary">Upload Document</Button>
            </Link>
          </Col>
        )}
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
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
                <th>Type</th>
                <th>Title</th>
                <th>Category</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>{getFileIcon(doc.fileType)}</td>
                  <td>{doc.title}</td>
                  <td>{doc.category}</td>
                  <td>{doc.uploadedBy}</td>
                  <td>{formatDate(doc.uploadDate)}</td>
                  <td>{doc.fileSize}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      href={doc.downloadUrl}
                      className="me-2"
                    >
                      Download
                    </Button>
                    {(user?.role === "admin" || user?.role === "hr") && (
                      <Button variant="outline-danger" size="sm">
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No documents found
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

export default DocumentList;
