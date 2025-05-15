import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocuments,
  fetchMyDocuments,
  uploadDocument,
  updateDocument,
  verifyDocument,
  deleteDocument,
} from "../redux/slices/documentSlice";
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
  Tabs,
  Tab,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FaUpload, FaDownload, FaCheck, FaTrash, FaEdit } from "react-icons/fa";

const Documents = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { documents, myDocuments, loading, error } = useSelector(
    (state) => state.document
  );
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    file: null,
    tags: "",
  });
  const [activeTab, setActiveTab] = useState("documents");
  const [filter, setFilter] = useState({
    type: "",
    status: "",
  });

  useEffect(() => {
    if (user.role === "admin" || user.role === "hr") {
      dispatch(fetchDocuments(filter));
    } else {
      dispatch(fetchMyDocuments());
    }
  }, [dispatch, user.role, filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description);

      if (formData.tags) {
        formDataToSend.append(
          "tags",
          formData.tags.split(",").map((tag) => tag.trim())
        );
      }

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      if (selectedDocument) {
        await dispatch(
          updateDocument({ id: selectedDocument._id, data: formDataToSend })
        );
      } else {
        await dispatch(uploadDocument(formDataToSend));
      }

      setShowModal(false);
      setSelectedDocument(null);
      setFormData({
        title: "",
        type: "",
        description: "",
        file: null,
        tags: "",
      });
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      await dispatch(verifyDocument(id));
    } catch (error) {
      console.error("Error verifying document:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await dispatch(deleteDocument(id));
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setFormData({
      title: document.title,
      type: document.type,
      description: document.description || "",
      tags: document.tags ? document.tags.join(", ") : "",
      file: null,
    });
    setShowModal(true);
  };

  const handleView = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      archived: "warning",
      deleted: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified ? (
      <Badge bg="success">Verified</Badge>
    ) : (
      <Badge bg="secondary">Unverified</Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
          <h2>Document Management</h2>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedDocument(null);
              setFormData({
                title: "",
                type: "",
                description: "",
                file: null,
                tags: "",
              });
              setShowModal(true);
            }}
          >
            <FaUpload className="me-2" /> Upload Document
          </Button>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="documents" title="Documents">
          <Row className="mb-3">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <h4>Filter Documents</h4>
                  <Form>
                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Document Type</Form.Label>
                          <Form.Select
                            value={filter.type}
                            onChange={(e) =>
                              setFilter({ ...filter, type: e.target.value })
                            }
                          >
                            <option value="">All Types</option>
                            <option value="resume">Resume</option>
                            <option value="contract">Contract</option>
                            <option value="id_proof">ID Proof</option>
                            <option value="address_proof">Address Proof</option>
                            <option value="certificate">Certificate</option>
                            <option value="appraisal">Appraisal</option>
                            <option value="offer_letter">Offer Letter</option>
                            <option value="experience_letter">
                              Experience Letter
                            </option>
                            <option value="other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            value={filter.status}
                            onChange={(e) =>
                              setFilter({ ...filter, status: e.target.value })
                            }
                          >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4} className="d-flex align-items-end">
                        <Button
                          variant="secondary"
                          onClick={() => setFilter({ type: "", status: "" })}
                        >
                          Clear Filters
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <h3>
                    {user.role === "admin" || user.role === "hr"
                      ? "All Documents"
                      : "My Documents"}
                  </h3>
                  <Table responsive>
                    <thead>
                      <tr>
                        {(user.role === "admin" || user.role === "hr") && (
                          <th>Employee</th>
                        )}
                        <th>Title</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Uploaded On</th>
                        <th>Status</th>
                        <th>Verification</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(user.role === "admin" || user.role === "hr"
                        ? documents
                        : myDocuments
                      ).map((doc) => (
                        <tr key={doc._id}>
                          {(user.role === "admin" || user.role === "hr") && (
                            <td>
                              {doc.employee
                                ? `${doc.employee.firstName} ${doc.employee.lastName}`
                                : "N/A"}
                            </td>
                          )}
                          <td>{doc.title}</td>
                          <td>{doc.type}</td>
                          <td>{doc.description || "N/A"}</td>
                          <td>{formatDate(doc.createdAt)}</td>
                          <td>{getStatusBadge(doc.status)}</td>
                          <td>{getVerificationBadge(doc.isVerified)}</td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              className="me-1"
                              onClick={() => handleView(doc)}
                            >
                              View
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEdit(doc)}
                            >
                              <FaEdit />
                            </Button>
                            {(user.role === "admin" || user.role === "hr") &&
                              !doc.isVerified && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleVerify(doc._id)}
                                >
                                  <FaCheck />
                                </Button>
                              )}
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(doc._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
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
          <Tab eventKey="stats" title="Document Statistics">
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <h3>Document Overview</h3>
                    <div className="d-flex justify-content-around mb-4">
                      <div className="text-center">
                        <h5>Total Documents</h5>
                        <div className="display-4">{documents.length}</div>
                      </div>
                      <div className="text-center">
                        <h5>Verified Documents</h5>
                        <div className="display-4 text-success">
                          {documents.filter((doc) => doc.isVerified).length}
                        </div>
                      </div>
                      <div className="text-center">
                        <h5>Pending Verification</h5>
                        <div className="display-4 text-warning">
                          {documents.filter((doc) => !doc.isVerified).length}
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

      {/* Upload/Edit Document Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDocument ? "Edit Document" : "Upload Document"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="">Select Type</option>
                <option value="resume">Resume</option>
                <option value="contract">Contract</option>
                <option value="id_proof">ID Proof</option>
                <option value="address_proof">Address Proof</option>
                <option value="certificate">Certificate</option>
                <option value="appraisal">Appraisal</option>
                <option value="offer_letter">Offer Letter</option>
                <option value="experience_letter">Experience Letter</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="e.g. important, contract, 2023"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                File{" "}
                {selectedDocument ? "(Leave empty to keep current file)" : ""}
              </Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                required={!selectedDocument}
              />
              <Form.Text className="text-muted">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 5MB)
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedDocument ? "Update" : "Upload"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Document Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Document Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <div>
              <h4>{selectedDocument.title}</h4>
              <p>
                <strong>Type:</strong> {selectedDocument.type}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedDocument.description || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(selectedDocument.status)}
              </p>
              <p>
                <strong>Verification:</strong>{" "}
                {getVerificationBadge(selectedDocument.isVerified)}
              </p>
              <p>
                <strong>Uploaded On:</strong>{" "}
                {formatDate(selectedDocument.createdAt)}
              </p>

              {selectedDocument.isVerified && (
                <p>
                  <strong>Verified By:</strong>{" "}
                  {selectedDocument.verifiedBy
                    ? `${selectedDocument.verifiedBy.firstName} ${selectedDocument.verifiedBy.lastName}`
                    : "N/A"}
                </p>
              )}

              <p>
                <strong>Tags:</strong>{" "}
                {selectedDocument.tags && selectedDocument.tags.length > 0
                  ? selectedDocument.tags.join(", ")
                  : "No tags"}
              </p>

              {selectedDocument.file && (
                <div className="mt-3">
                  <h5>File</h5>
                  <p>
                    <strong>Original Name:</strong>{" "}
                    {selectedDocument.file.originalName}
                  </p>
                  <p>
                    <strong>Size:</strong>{" "}
                    {Math.round(selectedDocument.file.size / 1024)} KB
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedDocument.file.mimeType}
                  </p>

                  <Button variant="primary">
                    <FaDownload className="me-2" /> Download File
                  </Button>
                </div>
              )}

              {selectedDocument.history &&
                selectedDocument.history.length > 0 && (
                  <div className="mt-4">
                    <h5>Document History</h5>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>User</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocument.history.map((item, index) => (
                          <tr key={index}>
                            <td>{item.action}</td>
                            <td>
                              {item.user
                                ? `${item.user.firstName} ${item.user.lastName}`
                                : "N/A"}
                            </td>
                            <td>{formatDate(item.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Documents;
