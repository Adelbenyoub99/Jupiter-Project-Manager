import React, { useState} from "react";
import { Button, Modal, Form, Container, InputGroup, Row, Col } from "react-bootstrap";
import { createProject } from "../fetchRequests/projet/userProjects";


export default function CreateProject({ onAddProject }) {
  const [show, setShow] = useState(false);
  const [project, setProject] = useState({
    nomProjet: "",
    descProjet: "",
    dureeProjet: "1",
    dureeUnite: "jours",
    delaiProjet: new Date().toISOString().split('T')[0],
    visibiliteProjet: "Public"
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    console.log(value); // To debug and see the selected date
    setProject(prevState => {
        const updatedProject = { ...prevState, delaiProjet: value };
        calculateDuration(value, updatedProject);
        return updatedProject;
    });
};

  

const calculateDuration = (endDate, updatedProject) => {
  const currentDate = new Date();
  const delaiDate = new Date(endDate);
  const timeDiff = delaiDate - currentDate;

  if (timeDiff > 0) {
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 7) {
          setProject({ ...updatedProject, dureeProjet: Math.ceil(daysDiff).toString(), dureeUnite: "jours" });
      } else if (daysDiff < 30) {
          setProject({ ...updatedProject, dureeProjet: Math.ceil(daysDiff / 7).toString(), dureeUnite: "semaines" });
      } else if (daysDiff < 365) {
          setProject({ ...updatedProject, dureeProjet: Math.ceil(daysDiff / 30).toString(), dureeUnite: "mois" });
      } else {
          setProject({ ...updatedProject, dureeProjet: Math.ceil(daysDiff / 365).toString(), dureeUnite: "années" });
      }
  } else {
      setProject({ ...updatedProject, dureeProjet: "1", dureeUnite: "jours" });
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const delaiDate = new Date(project.delaiProjet);
    const dureeInt = parseInt(project.dureeProjet);

    let isValid = true;

    if (project.dureeUnite === 'jours') {
      isValid = (dureeInt > 0 && currentDate.setDate(currentDate.getDate() + dureeInt) <= delaiDate);
    } else if (project.dureeUnite === 'semaines') {
      isValid = (dureeInt > 0 && currentDate.setDate(currentDate.getDate() + dureeInt * 7) <= delaiDate);
    } else if (project.dureeUnite === 'mois') {
      isValid = (dureeInt > 0 && currentDate.setMonth(currentDate.getMonth() + dureeInt) <= delaiDate);
    } else if (project.dureeUnite === 'années') {
      isValid = (dureeInt > 0 && currentDate.setFullYear(currentDate.getFullYear() + dureeInt) <= delaiDate);
    }

    const dureeFormatted = {
      value: dureeInt,
      unit: project.dureeUnite
    };

    const token = localStorage.getItem('Token');
    if (token) {
      createProject(token, { ...project, dureeFormatted })
        .then(response => {
          onAddProject(response);
          console.log('Project created:', response);
        })
        .catch(error => {
          console.error('Error creating project:', error);
        });
    } else {
      alert("Vous devez vous connecter pour créer un projet");
    }

    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setProject({ nomProjet: "",
      descProjet: "",
      dureeProjet: "1",
      dureeUnite: "jours",
      delaiProjet: new Date().toISOString().split('T')[0],
      visibiliteProjet: "Public" }); 
};
  const handleShow = () => setShow(true);
 

  return (
    <div>
      <Button variant="btn btn-no-hover addProjectBtn me-2" onClick={handleShow}>
        + Ajouter un projet
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Créer un projet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nomProjet">
                <Form.Label>Nom du projet</Form.Label>
                <Form.Control
                  type="text"
                  name="nomProjet"
                  value={project.nomProjet}
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
                  value={project.descProjet}
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
                      value={project.delaiProjet}
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
                        value={project.dureeProjet}
                        onChange={handleChange}
                        min={1}
                       
                      />
                      <Form.Control
                        as="select"
                        name="dureeUnite"
                        value={project.dureeUnite}
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
                  value={project.visibiliteProjet}
                  onChange={handleChange}
                  required
                >
                  <option value="Public">Public</option>
                  <option value="Privé">Privé</option>
                </Form.Control>
              </Form.Group>
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Button type="submit" variant="btn btn-no-hover addProjectBtn">
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
