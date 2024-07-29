import React, { useState, useEffect } from "react";
import {
  getUserDemandes,
  annulerDemande,
} from "../fetchRequests/projet/demandAdh";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import "../cssStyle/demandes.css";
export default function MesDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemandes = async () => {
      if (localStorage.getItem("Token")) {
        try {
          const demandes = await getUserDemandes(localStorage.getItem("Token"));
          setDemandes(Array.isArray(demandes) ? demandes : []); // Ensure `demandes` is always an array
        } catch (error) {
          console.error("Error:", error);
          setDemandes([]); // Set to empty array on error
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDemandes();
  }, []);

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="d-flex mb-5 pb-5">
    <Container  className="containerDem mb-5">
      {demandes.length === 0 ? (
        <div className="d-flex align-items-center justify-content-center">
          <h5>Aucune demande envoyée</h5>
        </div>
      ) : (
        <>
          <h3 className="d-flex align-item-center justify-content-center">
            Mes demandes{" "}
          </h3>
          <Row>
            {demandes.map((demande) => (
              <Col key={demande.idDemande} xs={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{demande.nomProjet}</Card.Title>
                    <Card.Text>{demande.descriptionProjet}</Card.Text>
                    <Card.Text>
                      <strong>Envoyée :</strong>{" "}
                      {new Date(demande.createdAt).toLocaleString()}
                    </Card.Text>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        {" "}
                        <strong>Etat :</strong> {demande.etatDemande}{" "}
                      </div>

                      {demande.etatDemande === "En cours" ? (
                        <button
                          className="btn btnPP btn-sm ms-1"
                          onClick={() =>
                            annulerDemande(
                              demande.idDemande,
                              localStorage.getItem("Token")
                            )
                          }
                        >
                          Annuler
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Card.Body>

                  
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
     
    </Container> 
   </div>
  );
}
