import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Table,
  Modal,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllProjects,
  deleteProject,
  searchProject,
  getProjectUsers,
} from "../../fetchRequests/admin/adminProjet";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [term, setTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [viewingProject, setViewingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("Token");
      const data = await getAllProjects(token);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (term.trim() === "") {
        fetchProjects();
      } else {
        const data = await searchProject(token, term);
        setProjects(data);
      }
    } catch (error) {
      console.error("Error searching projects:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (selectedProject) {
        await deleteProject(token, selectedProject.idProjet);
        fetchProjects();
        setShowConfirmationModal(false);
        setSelectedProject(null);
      
        
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleRowClick = async (projectId) => {
    try {
      const token = localStorage.getItem("Token");
      const data = await getProjectUsers(token, projectId);
      setProjectMembers(data);
      setViewingProject(projectId); // Set the project being viewed
    } catch (error) {
      console.error("Error fetching project members:", error);
    }
  };

  const renderMembersModal = () => (
    <Modal
      show={viewingProject !== null}
      onHide={() => setViewingProject(null)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Membres du Projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {projectMembers.map((member) => (
            <li key={member.idUtilisateur}>
              <img
                src={"http://localhost:5000/uploadsIMG/" + member.image}
                alt="Profile"
                thumbnail="true"
                crossOrigin="anonymous"
                className="imageProfile"
              />
              {member.nomUtilisateur}
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="mainDiv">
      <Container className="pb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="mt-4 ms-1">Projets</h2>
          <div className="d-flex justify-content-center align-items-center searchForm">
            <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <Form.Control
                type="search"
                placeholder="Recherche Projet"
                className="searchInput"
                aria-label="Recherche"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </Form>
            <Button
              variant="btn btn-no-hover"
              className="searchBtn me-auto"
              onClick={handleSearch}
            >
              Recherche
            </Button>
          </div>
        </div>

        <Table bordered hover className="mb-5">
          <tbody>
            {projects.map((project) => (
              <tr key={project.idProjet}>
                <td onClick={() => handleRowClick(project.idProjet)}>
                  <div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center">
                        <h5>{project.nomProjet}</h5>
                        <span
                          className={
                            project.visibiliteProjet === "Public"
                              ? "custom-badge ms-3"
                              : "custom-badgeR ms-3"
                          }
                        >
                          {project.visibiliteProjet}
                        </span>
                      </span>

                      <div className="d-flex">
                        <img
                          src={
                            "http://localhost:5000/uploadsIMG/" +
                            project.Chef.image
                          }
                          alt="Profile"
                          thumbnail="true"
                          crossOrigin="anonymous"
                          className="imageProfile"
                        />{" "}
                        <h6 className="me-3 mt-1 ms-1">
                          {project.Chef.nomUtilisateur} (
                          {new Date(project.createdAt).toLocaleDateString()})
                        </h6>
                      </div>
                    </div>

                    {project.descProjet}
                  </div>
                </td>

                <td>
                  <Button
                    className="desactive"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowConfirmationModal(true);
                    }}
                  >
                    Supprimer <DeleteIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderMembersModal()}

        {/* Confirmation Modal */}
        <Modal
          show={showConfirmationModal}
          onHide={() => setShowConfirmationModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmation de Suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer ce projet ?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="addBtn"
              onClick={() => setShowConfirmationModal(false)}
            >
              Annuler
            </Button>
            <Button className="desactive" onClick={handleDeleteProject}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
