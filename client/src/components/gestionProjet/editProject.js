import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Container, InputGroup, Row, Col } from "react-bootstrap";
import { updateProjet } from "../../fetchRequests/projet/gestion/projet";
import EditIcon from '@mui/icons-material/Edit';
export default function EditProject({ projectId, project, onUpdateProject }) {
  const [show, setShow] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({ ...project });

  useEffect(() => {
    setUpdatedProject({ ...project });
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject({ ...updatedProject, [name]: value });
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setUpdatedProject(prevState => {
      const newProject = { ...prevState, delaiProjet: value };
      return calculateDuration(value, newProject);
    });
  };

  const calculateDuration = (endDate, newProject) => {
    const currentDate = new Date();
    const delaiDate = new Date(endDate);
    const timeDiff = delaiDate - currentDate;

    if (timeDiff > 0) {
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 7) {
        return { ...newProject, dureeProjet: `${daysDiff} jours` };
      } else if (daysDiff < 30) {
        return { ...newProject, dureeProjet: `${Math.ceil(daysDiff / 7)} semaines` };
      } else if (daysDiff < 365) {
        return { ...newProject, dureeProjet: `${Math.ceil(daysDiff / 30)} mois` };
      } else {
        return { ...newProject, dureeProjet: `${Math.ceil(daysDiff / 365)} années` };
      }
    } else {
      return { ...newProject, dureeProjet: "1 jour" }; // Default to 1 jour if endDate is in the past
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('Token');
    if (token) {
      const updated = calculateDuration(updatedProject.delaiProjet, updatedProject);
      updateProjet(token, projectId, updated)
        .then(response => {
          onUpdateProject(response);
          console.log('Project updated:', response);
        })
        .catch(error => {
          console.error('Error updating project:', error);
        });
    } else {
      alert("Vous devez vous connecter pour modifier un projet");
    }

    handleClose();
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  return (
    <div>
      <Button className="addBtn" onClick={handleShow}>
        Modifier le projet 
        <EditIcon className="ms-2"/>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le projet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nomProjet">
                <Form.Label>Nom du projet</Form.Label>
                <Form.Control
                  type="text"
                  name="nomProjet"
                  value={updatedProject.nomProjet}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="descProjet" className="mt-3">
                <Form.Label>Description du projet</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descProjet"
                  value={updatedProject.descProjet}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="delaiProjet">
                    <Form.Label>Date de fin de projet</Form.Label>
                    <Form.Control
                      type="date"
                      name="delaiProjet"
                      value={updatedProject.delaiProjet}
                      onChange={handleDateChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="dureeProjet">
                    <Form.Label>Durée du projet</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        name="dureeProjet"
                        value={updatedProject.dureeProjet.split(' ')[0]} // Remove unit for editing
                        onChange={handleChange}
                        min={1}
                      />
                      <Form.Control
                        as="select"
                        name="dureeUnite"
                        value={updatedProject.dureeProjet.split(' ')[1]} // Select unit for editing
                        onChange={handleChange}
                        style={{ borderLeft: 'none' }}
                      >
                        <option value="jours">Jours</option>
                        <option value="semaines">Semaines</option>
                        <option value="mois">Mois</option>
                        <option value="années">Années</option>
                      </Form.Control>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="visibiliteProjet" className="mt-3">
                <Form.Label>Visibilité du projet</Form.Label>
                <Form.Control
                  as="select"
                  name="visibiliteProjet"
                  value={updatedProject.visibiliteProjet}
                  onChange={handleChange}
                  required
                >
                  <option value="Public">Public</option>
                  <option value="Privé">Privé</option>
                </Form.Control>
              </Form.Group>
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Button type="submit" variant="primary">
                  Enregistrer
                </Button>
              </div>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
}
