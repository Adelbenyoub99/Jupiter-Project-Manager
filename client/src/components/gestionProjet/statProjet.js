import React, { useState, useEffect } from "react";
import { getMembres } from "../../fetchRequests/projet/gestion/membres";
import { getProjectTask } from "../../fetchRequests/projet/gestion/tache";
import { getAllFiles } from '../../fetchRequests/projet/gestion/fichiers';
import { getProjectById } from '../../fetchRequests/projet/gestion/projet';
import ProgressBar from "react-bootstrap/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faUsers, faChartPie, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const StatistiqueProjet = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [membres, setMembres] = useState([]);
  const [files, setFiles] = useState([]);
  const [projet, setProjet] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await getProjectTask(token, projectId);
      const tasksData = response.taches;
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await getProjectById(token, projectId);
     // console.log(response);
      setProjet(response);
    } catch (error) {
      console.error("Error fetching project info:", error);
    }
  };

  const fetchMembres = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await getMembres(token, projectId);
      const membresData = response;
      setMembres(membresData);
    } catch (error) {
      console.error("Error fetching membres:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await getAllFiles(token, projectId);
      setFiles(response);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchMembres();
    fetchFiles();
  }, [projectId]);

  if (!projet) {
    return <div>Loading...</div>;
  }

  // Calcul des statistiques
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.statutTache === "Terminé").length;
  const inProgressTasks = tasks.filter(task => task.statutTache === "En cours").length;
  const pendingTasks = tasks.filter(task => task.statutTache === "En attente").length;

  // Calcul du pourcentage de tâches terminées
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Détermination de la couleur de la barre de progression en fonction du pourcentage
  let progressBarVariant = "success"; // par défaut
  if (progressPercentage < 30) {
    progressBarVariant = "danger";
  } else if (progressPercentage < 50) {
    progressBarVariant = "warning";
  } else if (progressPercentage < 80) {
    progressBarVariant = "info";
  }

  // Calculer la durée restante du projet
  const calculateRemainingDays = (startDate, duration) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + duration);

    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Calculer la durée passée du projet
  const calculateElapsedDays = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const projectDuration = projet.dureeProjet ? parseInt(projet.dureeProjet.split(" ")[0]) : 0;
  const remainingDays = calculateRemainingDays(projet.createdAt, projectDuration);
  const elapsedDays = calculateElapsedDays(projet.createdAt);

  // Calculer le pourcentage de la durée passée
  const elapsedPercentage = projectDuration > 0 ? (elapsedDays / (projectDuration * 30)) * 100 : 0;

  return (
    <>
      <div className="d-flex align-items-center pt-1">
        <h4 className="ms-2 text-dark">
          Avancement de projet
          <FontAwesomeIcon icon={faBarsProgress} className="ms-2 mt-1" />
        </h4>
        <hr className="flex-grow-1 ms-2" />
      </div>
      <div className="d-flex flex-column align-items-center ">
        <div className="statDiv">
          <ProgressBar
            animated
            now={progressPercentage}
            variant={progressBarVariant}
            label={`${progressPercentage}%`}
            className="mb-3 mt-3 progressBar"
          />

          <Row>
            <Col>
              <Card bg="light" text="dark" className="mb-3">
                <Card.Body>
                  <Card.Title>{totalTasks} tâches <FormatListBulletedIcon /> </Card.Title>
                  <Card.Text>Total de tâches dans le projet</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="tacheDone mb-3">
                <Card.Body>
                  <Card.Title>{completedTasks} tâches <DoneAllIcon /> </Card.Title>
                  <Card.Text>Tâches complétées dans le projet</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="tacheCours mb-3">
                <Card.Body>
                  <Card.Title>{inProgressTasks} tâches <ModelTrainingIcon /> </Card.Title>
                  <Card.Text>Tâches en cours dans le projet</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="tacheAtt mb-3">
                <Card.Body>
                  <Card.Title>{pendingTasks} tâches <HourglassEmptyIcon /> </Card.Title>
                  <Card.Text>Tâches en attente dans le projet</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div className="d-flex align-items-center pt-1">
        <h4 className="ms-2 text-dark">
          Ressources du projet
          <FontAwesomeIcon icon={faChartPie} className="ms-2 mt-1 me-2" />
        </h4>
        <hr className="flex-grow-1 ms-2" />
      </div>
      <div className="d-flex flex-column align-items-center ">
        <div className="statDiv">
          <Row>
            <Col>
              <Card bg="light" text="dark" className="mb-3">
                <Card.Body>
                  <Card.Title>Durée de projet {projet.dureeProjet && ": "+projet.dureeProjet}</Card.Title>
                  <ProgressBar className="progressBar">
                    <ProgressBar
                      now={elapsedPercentage}
                      className="progresDaysPassed"
                      label={`${elapsedDays} jours passés`}
                      key={1}
                    />
                    <ProgressBar
                      now={100 - elapsedPercentage}
                      label={`${remainingDays} jours restants`}
                      key={2}
                      className="progresDaysleft"
                    />
                  </ProgressBar>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card bg="light" text="dark" className="mb-3">
                <Card.Body>
                  <Card.Title>Membres de projet
                    <FontAwesomeIcon icon={faUsers} className="ms-2 mt-1 me-2" />
                  </Card.Title>
                  <Card.Text>{membres.length} membres</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card bg="light" text="dark" className="mb-3">
                <Card.Body>
                  <Card.Title>Fichiers partagés
                    <FontAwesomeIcon icon={faFolderOpen} className="ms-2 mt-1 me-2" />
                  </Card.Title>
                  <Card.Text>{files.length} fichiers</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default StatistiqueProjet;
