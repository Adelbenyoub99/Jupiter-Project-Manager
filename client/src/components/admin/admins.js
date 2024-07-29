import React, { useState, useEffect } from "react";
import { getAllAdmins, deleteAdmin, updateAdmin, createAdmin, getIsSuperAdmin } from "../../fetchRequests/admin/adminAccount";
import { Container, Card, Button, Form, Modal, Row, Col, Alert } from "react-bootstrap";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmins();
    fetchIsSuperAdmin();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("Token");
      const data = await getAllAdmins(token);
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchIsSuperAdmin = async () => {
    try {
      const token = localStorage.getItem("Token");
      const data = await getIsSuperAdmin(token);
      setIsSuperAdmin(data.isSuperAdmin);
    } catch (error) {
      console.error("Error checking super admin status:", error);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!isSuperAdmin) {
        throw new Error("Vous n'êtes pas autorisé à créer un admin.");
      }
      await createAdmin(token, adminName, adminPassword);
      setShowCreateModal(false);
      setAdminName("");
      setAdminPassword("");
      fetchAdmins();
    } catch (error) {
      setError(error.message);
      console.error("Error creating admin:", error);
    }
  };

  const handleUpdateAdmin = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!isSuperAdmin) {
        throw new Error("Vous n'êtes pas autorisé à modifier un admin.");
      }
      const data = { nomAdmin: adminName, motDePasse: adminPassword };
      await updateAdmin(token, selectedAdmin.idAdmin, data);
      setShowUpdateModal(false);
      setSelectedAdmin(null);
      setAdminName("");
      setAdminPassword("");
      fetchAdmins();
    } catch (error) {
      setError(error.message);
      console.error("Error updating admin:", error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem("Token");
      if (!isSuperAdmin) {
        throw new Error("Vous n'êtes pas autorisé à supprimer un admin.");
      }
      await deleteAdmin(token, adminId);
      fetchAdmins();
    } catch (error) {
      setError(error.message);
      console.error("Error deleting admin:", error);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCreateUpdateError = () => {
    if (!isSuperAdmin) {
      setError("Vous n'êtes pas autorisé à effectuer cette action.");
    }
  };

  return (
    <div className='mainDiv'>
      <Container className='mb-5 pb-5'>
        <div className="d-flex align-items-center justify-content-between pt-4">
          <h2>Administrateurs</h2>
          <button className='dropDownTrie btn d-flex' onClick={() => { setShowCreateModal(isSuperAdmin); handleCreateUpdateError(); }}>
            <h5 className='me-2'>Ajouter un admin</h5>
            <AddCircleIcon />
          </button>
        </div>

        {error && (
          <div className="d-flex align-items-center justify-content-center">
            <Alert variant="danger" onClose={handleCloseError} dismissible>
              {error}
            </Alert>
          </div>
        )}

        <Row className="d-flex align-items-center justify-content-center">
          {admins.map((admin) => (
            <Col lg={3} md={6} key={admin.idAdmin}>
              <Card className="m-2">
                <Card.Body>
                  <Card.Title>
                    {admin.isSuperAdmin ? <StarIcon className="mb-2 me-1"/> : <VerifiedUserIcon className="mb-2 me-1"/>}
                    {admin.nomAdmin}
                  </Card.Title>
                  <Card.Text>
                    Date d'ajout: {new Date(admin.createdAt).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setAdminName(admin.nomAdmin);
                      setShowUpdateModal(isSuperAdmin);
                      handleCreateUpdateError();
                    }}
                    className="mb-2 addBtn text-center"
                  >
                    Modifier <EditIcon className="ms-2"/>
                  </Button>
                  <Button
                    className="desactive"
                    onClick={() => handleDeleteAdmin(admin.idAdmin)}
                  >
                    Supprimer <DeleteIcon className="ms-2"/>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Create Admin Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Créer Admin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAdminName">
                <Form.Label>Nom Admin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer le nom"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAdminPassword" className="mt-3">
                <Form.Label>Mot de Passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrer le mot de passe"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
            <div className="d-flex align-items-center justify-content-center">
              <Button className="addBtn mt-3" onClick={handleCreateAdmin}>
                Enregistrer
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Update Admin Modal */}
        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Modifier Admin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAdminName">
                <Form.Label>Nom Admin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer le nom"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAdminPassword" className="mt-3">
                <Form.Label>Mot de Passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrer le mot de passe"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
            <div className="d-flex align-items-center justify-content-center">
              <Button className="addBtn mt-3" onClick={handleUpdateAdmin}>
                Enregistrer
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
