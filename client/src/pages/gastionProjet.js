import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectByUrl } from "../fetchRequests/projet/gestion/projet";
import { Tab, Tabs, Container } from "react-bootstrap";
import TacheProjet from "../components/gestionProjet/taches";
import Membres from "../components/gestionProjet/membres";
import Documents from "../components/gestionProjet/documents";
import Demandes from "../components/gestionProjet/demandes";
import ProjectSettings from "../components/gestionProjet/projetctSetting";
import Discussion from "../components/gestionProjet/descussion";
import "../cssStyle/gestionProjet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faUsersGear,
  faFileAlt,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import VerifiedIcon from "@mui/icons-material/Verified";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
export default function GestionProjet() {
  const { projectUrl } = useParams();
  const [project, setProject] = useState(null);
  const [idProjet, setIdProjet] = useState();
  const [userRole, setUserRole] = useState();
    const fetchProject = async () => {
      try {
        const data = await getProjectByUrl(projectUrl);
        setProject(data.project);
        setIdProjet(data.project.idProjet)
        setUserRole(data.userRole);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

  useEffect(() => {
  
    fetchProject();
  }, [projectUrl]);

  return (
    
    <Container fluid >
      {project ? (
        <>
        <div className="gestion">
          <div className="d-flex justify-content-start align-items-center mb-2 pt-3">
            <Link to="/WorkSpace" state={{ activeView: "projects" }} className="backArrow">
              <ArrowBackIosIcon  />
            </Link>

            <h3 className="me-3 mt-1">
              Projet {" : " + project.nomProjet}
            </h3>
            {userRole === "ChefProjet" ? (
              <LocalPoliceIcon />
            ) : userRole === "Adjoint" ? (
              <VerifiedIcon />
            ) : (
              <GroupsIcon />
            )}
          </div>

          <div>
          <Tabs defaultActiveKey="taches" id="project-tabs" className="tabHdr">
      <Tab
        eventKey="taches"
        title={
          <span>
            <FontAwesomeIcon icon={faTasks} /> Tâches
          </span>
        }
      >
        <div className="tabContent">
          <TacheProjet projectId={project.idProjet} role={userRole} />
        </div>
      </Tab>
      <Tab
        eventKey="membres"
        title={
          <span>
            <FontAwesomeIcon icon={faUsersGear} /> Membres
          </span>
        }
      >
        <div className="tabContent">
          <Membres projectId={project.idProjet} role={userRole} />
        </div>
      </Tab>
      <Tab
        eventKey="demandes"
        title={
          <span>
            <GroupAddIcon /> Demandes
          </span>
        }
      >
        <div className="tabContent">
          <Demandes projectId={project.idProjet} role={userRole} />
        </div>
      </Tab>
      <Tab
        eventKey="documents"
        title={
          <span>
            <FontAwesomeIcon icon={faFileAlt} /> Documents
          </span>
        }
      >
        <div className="tabContent">
          <Documents projectId={project.idProjet}  role={userRole}  />
        </div>
      </Tab>
      <Tab
        eventKey="settings"
        title={
          <span>
            <FontAwesomeIcon icon={faCog} /> Général
          </span>
        }
      >
        <div className="tabContent">
          <ProjectSettings projectId={project.idProjet}  role={userRole} projectUrl={projectUrl} />
        </div>
        
      </Tab>
       
    </Tabs>
    

          </div>
        </div>
         <Discussion projectId={idProjet}/></>
      ) : (
        <p>Loading project details...</p>
      )}
    
    </Container>
  );
}
