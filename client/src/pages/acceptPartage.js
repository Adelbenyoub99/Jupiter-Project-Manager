import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinProject, getProjectByUrl } from '../fetchRequests/share';
import { Button, Alert } from 'react-bootstrap';

export default function AcceptPartage() {
  const { projectUrl } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('Token');
    if (!token) {
      setAlertMessage("Vous devez être connecté pour accepter ou refuser l'invitation.");
      return;
    }

    const fetchProject = async () => {
      try {
        const data = await getProjectByUrl(projectUrl);
        setProject(data.project);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectUrl]);

  const handleAccepter = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        setAlertMessage("Vous devez être connecté pour accepter ou refuser l'invitation.");
        return;
      }
      const data = await joinProject(token, project.idProjet);
      if (data && data.message === "L'utilisateur est déjà membre de ce projet.") {
        // Optionally handle the case where the user is already a member
      } else {
        navigate(`/gestionProjet/${projectUrl}`);
      }
    } catch (error) {
      console.error('Error adding user to project:', error);
    }
  };

  const handleRefuser = () => {
    navigate('/');
  }

  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg">
      <div className="p-4 rounded bg-light shadow loginModel">
        {alertMessage && (
          <Alert variant="danger">
            {alertMessage}
          </Alert>
        )}
        {project && !alertMessage && (
          <div>
            <h5>
              {project.nomProjet}
            </h5>
            <p>
              Le chef de ce projet vous a demandé de rejoindre son équipe.
            </p>
          </div>
        )}
        <div className='d-flex justify-content-center'>
          {alertMessage ? (
            <Button className="btn-sm mx-2" onClick={handleLogin}>
              Login
            </Button>
          ) : (
            <>
              <Button className="btn-sm refus mx-2" onClick={handleRefuser}>
                Refuser
              </Button>
              <Button className="btn-sm addBtn mx-2" onClick={handleAccepter}>
                Accepter
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
