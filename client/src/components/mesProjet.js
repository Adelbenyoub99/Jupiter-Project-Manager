import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Container } from "react-bootstrap";
import { fr } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import "../cssStyle/mesProjets.css";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupsIcon from "@mui/icons-material/Groups";
import CreateProject from "./creatProject";
import { getProjectUrl } from "../fetchRequests/projet/gestion/projet";
import { getUserProjects } from "../fetchRequests/projet/userProjects";

export default function MesProjets() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchUserProject = async () => {
      if (localStorage.getItem("Token")) {
        const projets = await getUserProjects(localStorage.getItem("Token"));
        setProjects(projets);
      }
    };
    fetchUserProject();
  }, []);

  const chefProjects = projects.filter(
    (project) => project.Membres[0].Participations.role === "ChefProjet"
  );
  const adjointProjects = projects.filter(
    (project) => project.Membres[0].Participations.role === "Adjoint"
  );
  const collaborateurProjects = projects.filter(
    (project) => project.Membres[0].Participations.role === "Collaborateur"
  );

  const handleCardClick = async (projectId) => {
    if (localStorage.getItem('Token')) {
      try {
        const projectUrl = await getProjectUrl(localStorage.getItem('Token'), projectId);
        navigate(`/gestionProjet/${projectUrl}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const renderProjectCards = (projects) => {
    return projects.map((project, index) => (
      <Col key={index} md={12} className="mb-4">
        <Card className="cardP" onClick={() => handleCardClick(project.idProjet)}>
          <Card.Body>
            <div className="d-flex">
              <Card.Title className="h6 ">{project.nomProjet}</Card.Title>
              <span className={project.visibiliteProjet==="Public"? "custom-badge  ms-auto h-100": "custom-badgeR  ms-auto h-100"}>{project.visibiliteProjet}</span>
            </div>
            <Card.Text>
              {" "}
              {`Créé y a ${formatDistanceToNow(new Date(project.createdAt), {
                locale: fr,
              })}`}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <div className="d-flex mb-5 pb-5">
      <Container fluid>
        <div className="d-flex align-items-start justify-content-end me-1">
          <CreateProject onAddProject={handleAddProject} />
        </div>
        <Row>
          <Col md={4} className="project-column bgChef order-md-2 order-1">
          <div className="d-flex align-items-center justify-content-center mb-2"> 
             <h4 className="me-1">
              Chef Projet
            </h4> 
            <LocalPoliceIcon />
          </div>
           
            {chefProjects.length === 0 ? (
              <p className="text-center">Vous n'êtes chef de projet d'aucun projet.</p>
            ) : (
              <Row>{renderProjectCards(chefProjects)}</Row>
            )}
          </Col>
          <Col md={4} className="project-column bgAdjoint order-md-1 order-2">
          <div className="d-flex align-items-center justify-content-center mb-2"> 
              <h4 className="me-1">
              Adjoint 
            </h4>
            <VerifiedIcon />
            </div>
          
            {adjointProjects.length === 0 ? (
              <p className="text-center">Vous n'êtes adjoint d'aucun projet.</p>
            ) : (
              <Row>{renderProjectCards(adjointProjects)}</Row>
            )}
          </Col>
          <Col md={4} className="project-column bgColab order-md-3 order-3">
          <div className="d-flex align-items-center justify-content-center mb-2"> 
             <h4 className="me-1">
              Collaborateur
            </h4> <GroupsIcon />
            </div>
           
            {collaborateurProjects.length === 0 ? (
              <p className="text-center">Vous n'êtes collaborateur d'aucun projet.</p>
            ) : (
              <Row>{renderProjectCards(collaborateurProjects)}</Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
