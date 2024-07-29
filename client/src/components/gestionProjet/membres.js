import React, { useState, useEffect } from "react";
import {
  getMembres,
  deleteMembre,
  updateToAdj,
  updateToCol,
} from "../../fetchRequests/projet/gestion/membres";
import { Container, Row, Col, Card } from "react-bootstrap";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ReplyIcon from "@mui/icons-material/Reply";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchUserForm from "./searcheUserForm";
import ModalConfirmation from "./modalConfirm";

export default function Membres({ projectId, role }) {
  const [membres, setMembres] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberToUpdate, setMemberToUpdate] = useState(null);
  const [updateAction, setUpdateAction] = useState(null); // 'promote' or 'demote'

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const token = localStorage.getItem("Token");
        const fetchedMembres = await getMembres(token, projectId);
        setMembres(fetchedMembres);
      } catch (error) {
        console.error("Error fetching project members:", error);
      }
    };

    fetchMembres();
  }, [projectId]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("Token");
      await deleteMembre(token, projectId, memberToDelete);
      setMembres(
        membres.filter((membre) => membre.idParticipation !== memberToDelete)
      );
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (updateAction === 'promote') {
        await updateToAdj(token, projectId, memberToUpdate);
        setMembres((prevMembres) =>
          prevMembres.map((membre) =>
            membre.idUtilisateur === memberToUpdate
              ? { ...membre, role: "Adjoint" }
              : membre
          )
        );
      } else if (updateAction === 'demote') {
        await updateToCol(token, projectId, memberToUpdate);
        setMembres((prevMembres) =>
          prevMembres.map((membre) =>
            membre.idUtilisateur === memberToUpdate
              ? { ...membre, role: "Collaborateur" }
              : membre
          )
        );
      }
      setShowConfirmModal(false);
      setMemberToUpdate(null);
      setUpdateAction(null);
    } catch (error) {
      console.error("Error updating member role:", error);
    }
  };

  const openDeleteModal = (idParticipation) => {
    setMemberToDelete(idParticipation);
    setShowDeleteModal(true);
  };

  const openConfirmModal = (idUser, action) => {
    setMemberToUpdate(idUser);
    setUpdateAction(action);
    setShowConfirmModal(true);
  };

  const handleUserAdded = (newMember) => {
    console.log(newMember)
    setMembres([...membres, newMember]);
  };

  return (
    <Container fluid>
      <div className="d-flex align-items-center pt-1">
        <h4 className="ms-2 text-dark">Moderateurs de Projet</h4>
        <hr className="flex-grow-1 ms-2" />
      </div>
      <Row>
        {membres
          .filter((membre) => membre.role === "ChefProjet")
          .map((membre) => (
            <Col
              key={membre.idParticipation}
              xs={12}
              md={6}
              lg={3}
              className="mb-4"
            >
              <Card className="profile-card">
                <Card.Body>
                  <div className="d-flex align-itmes-center roleTxtCH">
                    <LocalPoliceIcon /> <p>Chef de projet </p>
                  </div>
                  <div className="image-container">
                    <img
                      src={
                        "http://localhost:5000/uploadsIMG/" + membre.User.image
                      }
                      alt="Profile"
                      thumbnail
                      crossOrigin="anonymous"
                    />
                  </div>
                  <Card.Title className="text-center titleM">
                    {membre.User.nomUtilisateur}
                  </Card.Title>
                  <Card.Text className="descM">
                    {membre.User.nom} {membre.User.prenom} 
                    {membre.User.descProfile && <> : {membre.User.descProfile} </>}
                  </Card.Text>
                  <Card.Text>
                    <span className="text-center contactM">
                      <EmailIcon /> {membre.User.email}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        {membres
          .filter((membre) => membre.role === "Adjoint")
          .map((membre) => (
            <Col
              key={membre.idParticipation}
              xs={12}
              md={6}
              lg={3}
              className="mb-4"
            >
              <Card className="profile-card">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-itmes-center roleTxtAD">
                      <VerifiedIcon /> <p>Adjoint </p>
                    </div>
                    <div>
                      {role === "ChefProjet" && (
                        <ReplyIcon
                          variant="warning"
                          className="rotate-down "
                          sx={{fontSize:'35px'}}
                          onClick={() =>
                            openConfirmModal(membre.idUtilisateur, 'demote')
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="image-container">
                    <img
                      src={
                        "http://localhost:5000/uploadsIMG/" + membre.User.image
                      }
                      alt="Profile"
                      thumbnail
                      crossOrigin="anonymous"
                    />
                  </div>
                  <Card.Title className="text-center titleM">
                    {membre.User.nomUtilisateur}
                  </Card.Title>
                  <Card.Text className="descM">
                    {membre.User.nom} {membre.User.prenom} 
                    {membre.User.descProfile && <> :" " {membre.User.descProfile} </>}
                    
                  </Card.Text>
                  <Card.Text className="d-flex justify-content-between align-items-center">
                    <span className="text-center contactM">
                      <EmailIcon /> {membre.User.email}
                    </span>
                    <div>
                      {role === "ChefProjet" && (
                        <PersonRemoveIcon
      
                        className="actionIcon "
                          variant="danger"
                          onClick={() => openDeleteModal(membre.idParticipation)}
                        />

                      )}
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      <div className="d-flex align-items-center pt-1 mb-2">
        <h4 className="ms-2 text-dark">
          Collaborateurs <GroupsIcon />
        </h4>
        <hr className="flex-grow-1 ms-2" />
        {role==='ChefProjet' &&  <SearchUserForm projectId={projectId} onUserAdded={handleUserAdded} />}
       
      </div>
      <Row>
      {membres
        .filter((membre) => membre.role === "Collaborateur")
        .map((membre) => (
          <Col
            key={membre.idParticipation}
            xs={12}
            md={6}
            lg={3}
            className="mb-4"
          >
            <Card className="profile-card">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-end">
                  {role === "ChefProjet" && (
                    <ReplyIcon
                      variant="warning"
                      className="rotate-up "
                      sx={{fontSize:'35px'}}
                      onClick={() => openConfirmModal(membre.idUtilisateur, 'promote')}
                    />
                  )}
                </div>
                <div className="image-container">
                  <img
                    src={"http://localhost:5000/uploadsIMG/" + membre.User.image}
                    alt="Profile"
                    thumbnail
                    crossOrigin="anonymous"
                  />
                </div>
                <Card.Title className="text-center titleM">
                  {membre.User.nomUtilisateur}
                </Card.Title>
                <Card.Text className="descM">
                  {membre.User.nom} {membre.User.prenom} 
                  {membre.User.descProfile && <> : {membre.User.descProfile} </>}
                </Card.Text>
                <Card.Text className="d-flex justify-content-between align-items-center">
                  <span className="text-center contactM">
                    <EmailIcon /> {membre.User.email}
                  </span>
                  <div>
                    {role === "ChefProjet" && (
                      <PersonRemoveIcon
                        className="actionIcon"
                        variant="danger"
                        onClick={() => openDeleteModal(membre.idParticipation)}
                      />
                    )}
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <ModalConfirmation
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        messageText="Voulez-vous supprimer ce membre du projet ?"
        actionText="Supprimer"
        onConfirm={handleDelete}
      />
      <ModalConfirmation
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        messageText={`Voulez-vous ${updateAction === 'promote' ? 'promouvoir en adjoint cet utilisateur ?' : 'Rétrograder cet adjoint'} `}
        actionText={updateAction === 'promote' ? 'Promouvoir' : 'Rétrograder'}
        onConfirm={handleConfirmUpdate}
      />
    </Container>
  );
}
