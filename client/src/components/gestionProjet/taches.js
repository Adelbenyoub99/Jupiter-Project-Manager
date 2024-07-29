import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Dropdown, Modal } from "react-bootstrap";
import {
  getProjectTask,
  createAssignation,
  deleteAssignation,
  deleteTache,
} from "../../fetchRequests/projet/gestion/tache";
import { getProjectMembres } from "../../fetchRequests/projet/gestion/membres";
import FlagIcon from "@mui/icons-material/Flag";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TaskForm from "./taskAddForm";
import TaskEdit from "./taskEditForm";
import MesTaches from "./mesTache";

export default function TacheProjet({ projectId, role }) {
  const [taches, setTaches] = useState([]);
  const [mesTaches, setMesTaches] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membres, setMembres] = useState([]);
  const [sortBy, setSortBy] = useState("Date");
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (token) {
        const fetchedTaches = await getProjectTask(token, projectId);
        const fetchedMembres = await getProjectMembres(projectId);
        setTaches(fetchedTaches.taches);
        setMesTaches(fetchedTaches.mesTaches);
        setMembres(fetchedMembres);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [projectId]);

  const sortTasks = (criteria) => {
    let sortedTasks = [...taches];
    if (criteria === "priorite") {
      sortedTasks.sort((a, b) => {
        const priorityOrder = ["Eleve", "Moyenne", "Basse"];
        return (
          priorityOrder.indexOf(a.priorite) - priorityOrder.indexOf(b.priorite)
        );
      });
    } else if (criteria === "Etat") {
      sortedTasks.sort((a, b) => a.statutTache.localeCompare(b.statutTache));
    } else if (criteria === "Date") {
      sortedTasks.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
    }
    setTaches(sortedTasks);
    setSortBy(criteria);
  };

  const handleTaskAdded = (newTask) => {
    setTaches([...taches, newTask]);
    fetchData();
  };

  const handleDeleteAssignation = async (idTache, idMembre) => {
    try {
      const token = localStorage.getItem("Token");
      if (token) {
        const updatedTache = await deleteAssignation(
          token,
          projectId,
          idMembre,
          idTache
        );
        setTaches((prevTaches) =>
          prevTaches.map((tache) =>
            tache.idTache === idTache ? updatedTache : tache
          )
        );
        setMesTaches((prevMesTaches) =>
          prevMesTaches.filter(
            (tache) =>
              tache.idTache !== idTache ||
              !tache.Assigners.some((as) => as.idUtilisateur === idMembre)
          )
        );
         fetchData();
      }
     
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAssignation = async (idTache, idMembre) => {
    try {
      const token = localStorage.getItem("Token");
      if (token) {
        const updatedTache = await createAssignation(
          token,
          projectId,
          idTache,
          idMembre
        );

        await fetchData();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (idTache) => {
    try {
      const token = localStorage.getItem("Token");
      if (token) {
        await deleteTache(token, projectId, idTache);
        setTaches((prevTaches) =>
          prevTaches.filter((tache) => tache.idTache !== idTache)
        );
        setMesTaches((prevMesTaches) =>
          prevMesTaches.filter((tache) => tache.idTache !== idTache)
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowEditModal = (tache) => {
    setTaskToEdit(tache);
    setShowEditModal(true);
  };

  const handleHideEditModal = () => {
    setTaskToEdit(null);
    setShowEditModal(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTaches((prevTaches) =>
      prevTaches.map((tache) =>
        tache.idTache === updatedTask.idTache ? updatedTask : tache
      )
    );
    setMesTaches((prevMesTaches) =>
      prevMesTaches.map((tache) =>
        tache.idTache === updatedTask.idTache ? updatedTask : tache
      )
    );
    handleHideEditModal();
  };
  const handleUpdateTaches = (idTache, newStatus) => {
    setTaches((prevTaches) =>
      prevTaches.map((tache) =>
        tache.idTache === idTache ? { ...tache, statutTache: newStatus } : tache
      )
    );
    setMesTaches((prevMesTaches) =>
      prevMesTaches.map((tache) =>
        tache.idTache === idTache ? { ...tache, statutTache: newStatus } : tache
      )
    );
    
  };
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div className="H-100">
      <div className="d-flex justify-content-between me-1">
        <Dropdown>
          <Dropdown.Toggle className="dropDownTrie" id="dropdown-basic">
            Trier par : {sortBy}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => sortTasks("priorite")}>
              Priorité
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sortTasks("Etat")}>
              Etat
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sortTasks("Date")}>
              Date
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="d-flex align-items-center justify-content-center ">
        <Table bordered hover className="m-1  taskTable">
          <thead>
            <tr>
              <th>Tâche</th>
              <th>Assigné à</th>
              <th>Date de Début</th>
              <th>Date de Fin</th>
              <th>Priorité</th>
              <th>Etat</th>
            </tr>
          </thead>
          <tbody>
            {taches.map((tache) => (
              <tr key={tache.idTache}>
                <td>{tache.nomTache}</td>
                <td className="position-relative">
                  <Dropdown>
                    <div className="membre">
                      {tache.Assigners.length > 0 ? (
                        tache.Assigners.map((as) => (
                          <div
                            className="d-flex align-items-center justify-content-start"
                            key={as.idUtilisateur}
                          >
                            <div className="profileContainer me-2">
                              <img
                                src={
                                  "http://localhost:5000/uploadsIMG/" +
                                  as.User.image
                                }
                                className="imageProfile"
                                alt="Profile"
                                crossOrigin="anonymous"
                              />
                              <ClearIcon
                                className="deleteIcon"
                                onClick={() =>
                                  handleDeleteAssignation(
                                    tache.idTache,
                                    as.idUtilisateur
                                  )
                                }
                              />
                            </div>
                            <span>{as.User.nomUtilisateur}</span>
                          </div>
                        ))
                      ) : (
                        <span> </span>
                      )}
                    </div>
                    {["Adjoint", "ChefProjet"].includes(role) && (
                      <>
                       <Dropdown.Toggle
                      id="dropdown-basic"
                      className="dropDownBtn no-caret"
                    >
                      <AddIcon />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-left">
                      {membres
                        .filter(
                          (membre) =>
                            !tache.Assigners.some(
                              (as) => as.idUtilisateur === membre.idUtilisateur
                            )
                        )
                        .map((membre) => (
                          <Dropdown.Item
                            key={membre.idUtilisateur}
                            onClick={() =>
                              handleAssignation(
                                tache.idTache,
                                membre.idUtilisateur
                              )
                            }
                            className="drpItem"
                          >
                            <img
                              src={
                                "http://localhost:5000/uploadsIMG/" +
                                membre.image
                              }
                              className="imageProfile me-2"
                              alt="Profile"
                              crossOrigin="anonymous"
                            />
                            {membre.nomUtilisateur}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu></>
                    )}
                   
                  </Dropdown>
                </td>
                <td>{tache.dateDebut}</td>
                <td>{tache.dateFin}</td>
                <td>
                  <FlagIcon
                    style={{
                      color:
                        tache.priorite === "Eleve"
                          ? "red"
                          : tache.priorite === "Moyenne"
                          ? "orange"
                          : "green",
                    }}
                  />
                  {tache.priorite}
                </td>
                <td>
                  <div className="d-flex align-items-center justify-content-between ">
                    <span className="me-3">
                      {tache.statutTache === "En attente" ? (
                        <HourglassEmptyIcon />
                      ) : tache.statutTache === "En cours" ? (
                        <ModelTrainingIcon />
                      ) : tache.statutTache === "Terminé" ? (
                        <DoneAllIcon />
                      ) : (
                        <></>
                      )}
                      {tache.statutTache}
                    </span>

                    {["Adjoint", "ChefProjet"].includes(role) && (
                      <>
                        <EditIcon
                          className="actionIcon"
                          onClick={() => handleShowEditModal(tache)}
                        />
                        <DeleteIcon
                          className="actionIcon"
                          onClick={() => handleDeleteTask(tache.idTache)}
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {["Adjoint", "ChefProjet"].includes(role) && (
              <TaskForm
                membres={membres}
                idProjet={projectId}
                onTaskAdded={handleTaskAdded}
              />
            )}
          </tbody>
        </Table>
      </div>
      {taskToEdit && (
        <Modal show={showEditModal} onHide={handleHideEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier la Tâche</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TaskEdit
              membres={membres}
              idProjet={projectId}
              tache={taskToEdit}
              onTaskUpdated={handleTaskUpdated}
            />
          </Modal.Body>
        </Modal>
      )}
      <MesTaches mesTaches={mesTaches} onUpdateTaches={handleUpdateTaches} />
    </div>
  );
}
