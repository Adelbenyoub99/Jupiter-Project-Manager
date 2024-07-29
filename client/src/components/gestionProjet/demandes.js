import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Image } from "react-bootstrap";
import { format } from "date-fns";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  getProjectDemandes,
  accepterDemande,
  refuserDemande,
} from "../../fetchRequests/projet/gestion/demandes";

export default function Demandes({ projectId, role }) {
  const [demandesEnregistres, setDemandesEnregistres] = useState([]);
  const [demandesTraites, setDemandesTraites] = useState([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const token = localStorage.getItem("Token");
        const demandes = await getProjectDemandes(token, projectId);
        // Filtrer les demandes enregistrées et traitées
        const enregistres = demandes.filter(demande => demande.etatDemande !== "Acceptée" && demande.etatDemande !== "Refusée");
        const traites = demandes.filter(demande => demande.etatDemande === "Acceptée" || demande.etatDemande === "Refusée");
        
        setDemandesEnregistres(enregistres);
        setDemandesTraites(traites);
      } catch (error) {
        console.error("Error fetching demandes:", error);
      }
    };

    fetchDemandes();
  }, [projectId]);

  const handleAcceptDemande = async (idDemande) => {
    try {
      const token = localStorage.getItem("Token");
      await accepterDemande(token, projectId, idDemande);
      const updatedDemandes = await getProjectDemandes(token, projectId);
      const enregistres = updatedDemandes.filter(demande => demande.etatDemande !== "Acceptée" && demande.etatDemande !== "Refusée");
      const traites = updatedDemandes.filter(demande => demande.etatDemande === "Acceptée" || demande.etatDemande === "Refusée");
      setDemandesEnregistres(enregistres);
      setDemandesTraites(traites);
    } catch (error) {
      console.error("Error accepting demande:", error);
    }
  };

  const handleRefuseDemande = async (idDemande) => {
    try {
      const token = localStorage.getItem("Token");
      await refuserDemande(token, projectId, idDemande);
      const updatedDemandes = await getProjectDemandes(token, projectId);
      const enregistres = updatedDemandes.filter(demande => demande.etatDemande !== "Acceptée" && demande.etatDemande !== "Refusée");
      const traites = updatedDemandes.filter(demande => demande.etatDemande === "Acceptée" || demande.etatDemande === "Refusée");
      setDemandesEnregistres(enregistres);
      setDemandesTraites(traites);
    } catch (error) {
      console.error("Error refusing demande:", error);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <Container fluid>
      <div className="d-flex align-items-center pt-1">
        <h4 className="ms-2 text-dark">Demandes enregistrées</h4>
        <hr className="flex-grow-1 ms-2" />
      </div>
      <Row className="justify-content-center">
        {demandesEnregistres.map((demande) => (
          <Col key={demande.idDemande} xs={12} className="mb-4">
            <Card className="mx-auto" style={{ width: "95%" }}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={2} className="text-center">
                    <Image
                      src={"http://localhost:5000/uploadsIMG/" + demande.User.image}
                      className="imageProfileD"
                      alt="Profile"
                      crossOrigin="anonymous"
                      roundedCircle
                      fluid
                    />
                  </Col>
                  <Col xs={10}>
                    <div className="d-flex align-items-center justify-content-between">
                      <Card.Title>
                        <span className="nomUser">{demande.User.nomUtilisateur}</span> a demandé de joindre l'équipe de ce projet
                      </Card.Title>
                      <h6>{formatDate(demande.createdAt)}</h6>
                    </div>
                    <Card.Text>
                      {demande.User.nom} {demande.User.prenom} : {demande.User.descProfile || "Pas de description de profil"}
                    </Card.Text>
                    <Row>
                      <Col xs={8}>
                        <div className="d-flex align-items-center justify-content-start">
                          <span className="text-center">
                            <EmailIcon /> <strong>{demande.User.email}</strong>
                          </span>
                          <span className="ms-3">
                            <PhoneIcon /> <strong>{demande.User.numTel}</strong>
                          </span>
                        </div>
                      </Col>
                      {role === "ChefProjet" && (
                        <Col xs={4} className="text-end">
                          <Button
                            onClick={() => handleAcceptDemande(demande.idDemande)}
                            className="me-2 addBtn"
                          >
                            Accepter
                          </Button>
                          <Button
                            className="me-2 refus"
                            onClick={() => handleRefuseDemande(demande.idDemande)}
                          >
                            Refuser
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {demandesTraites.length > 0 && (
        <div className="mt-4">
          <h4 className="ms-2 text-dark">Demandes Traitées</h4>
          <hr className="flex-grow-1 ms-2" />
          <Row  className="justify-content-start" style={{ width: "95%", margin: "0 auto" }}>
            {demandesTraites.map((demande) => (
              <Col key={demande.idDemande} xs={12} md={6} lg={6} className="mb-4">
                <Card >
                  <Card.Body>
                    <Row className="align-items-start">
                      <Col xs={3} className="text-center">
                        <Image
                          src={"http://localhost:5000/uploadsIMG/" + demande.User.image}
                          roundedCircle
                          fluid
                          className="imageProfileF"
                          alt="Profile"
                          crossOrigin="anonymous"
                        />
                      </Col>
                      <Col xs={9}>
                        <div className="d-flex align-items-center justify-content-between">
                          <Card.Title>{demande.User.nomUtilisateur}</Card.Title>
                          <span
                            className={
                              demande.etatDemande === "Acceptée"
                                ? "custom-badge"
                                : "custom-badgeR"
                            }
                          >
                            {demande.etatDemande}
                          </span>
                        </div>
                        <Card.Text>envoyé le : {formatDate(demande.createdAt)}</Card.Text>
                        <Row>
                          <div className="d-flex align-items-center justify-content-start">
                            <span className="text-center">
                              <EmailIcon /> <strong>{demande.User.email}</strong>
                            </span>
                            <span className="ms-3">
                              <PhoneIcon /> <strong>{demande.User.numTel}</strong>
                            </span>
                          </div>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <p>
                        {demande.etatDemande === "Acceptée"
                          ? "Accepter le : " + formatDate(demande.updatedAt)
                          : demande.etatDemande === "Refusée"
                          ? "Refuser le : " + formatDate(demande.updatedAt)
                          : ""}
                      </p>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="mt-4">
            <p className="text-muted text-center pb-3">
              Les demandes traitées seront automatiquement supprimées après 30 jours.
            </p>
          </div>
        </div>
      )}
    </Container>
  );
}
