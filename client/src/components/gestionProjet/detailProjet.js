import React, { useState, useEffect } from "react";
import { getProjectById } from '../../fetchRequests/projet/gestion/projet';
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import EditProject from "./editProject";

export default function DetailProjet({ projectId, role }) {
  const [projet, setProjet] = useState(null);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await getProjectById(token, projectId);
      //console.log(response);
      setProjet(response);
    } catch (error) {
      console.error("Error fetching project info:", error);
    }
  };
  const handleUpdateProject = (updatedProject) => {
    setProjet(updatedProject);
  };
  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (!projet) {
    return <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>;
  }

  return (
    <Card className="detail-projet-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>{projet.nomProjet}</Card.Title>
          <span className={projet.visibiliteProjet === "Public" ? "custom-badge resizedBdg ms-auto" : "custom-badgeR resizedBdg ms-auto"}>
            {projet.visibiliteProjet}
          </span>
        </div>
        <Card.Text><strong>Description:</strong> {projet.descProjet}</Card.Text>
        <Card.Text><strong>Date de création:</strong> {new Date(projet.createdAt).toLocaleDateString()}</Card.Text>
        <Card.Text><strong>Durée du projet:</strong> {projet.dureeProjet}</Card.Text>
        <div className="d-flex align-items-end justify-content-end ms-auto">
           {role === "ChefProjet" && <EditProject projectId={projectId} project={projet} onUpdateProject={handleUpdateProject} />}
        </div>
        
      </Card.Body>
    </Card>
  );
}
