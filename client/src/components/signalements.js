import React, { useState, useEffect } from "react";
import { createSignal, getUserSignal } from "../fetchRequests/user/signal";
import { Dropdown, Form, Button, Container, Row, Col } from "react-bootstrap";
import "../cssStyle/signal.css";
export default function SignalementsAide() {
  const [typeProbleme, setTypeProbleme] = useState("probleme_technique");
  const [description, setDescription] = useState("");
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [nomProjet, setNomProjet] = useState("");
  const [userSignals, setUserSignals] = useState([]);
   
  const typeDescriptions = {
    probleme_technique: "Problème technique",
    probleme_user: "Problème lie aux utilisateurs",
    probleme_projet: "Problème lie aux projets",
  };

  const handleTypeChange = (selectedType) => {
    setTypeProbleme(selectedType);
  };

  const handleCreateSignal = async (e) => {
    e.preventDefault();
    const newSignal = {
      typeSignal: typeProbleme,
      descSignal: description,
      nomUtilisateur: typeProbleme === "probleme_user" ? nomUtilisateur : null,
      nomProjet: typeProbleme === "probleme_projet" ? nomProjet : null,
    };
    try {
      const token = localStorage.getItem("Token");
      await createSignal(token, newSignal);
      // Refresh user signals after creation
      fetchUserSignals(token);
      // Reset form fields
      setDescription("");
      setNomUtilisateur("");
      setNomProjet("");
    } catch (error) {
      console.error("Error creating signal:", error);
    }
  };

  const fetchUserSignals = async (token) => {
    try {
      const signals = await getUserSignal(token);
      setUserSignals(signals);
    } catch (error) {
      console.error("Error fetching user signals:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    fetchUserSignals(token);
  }, []);

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col lg={8} className="pe-3 ">
          <div className="container  colSig">
            <h3 className="pt-4 ">Signalements enregistrés</h3>
            <Row className="d-flex flex-column align-items-center justify-content-center">
              {userSignals.map((signal, index) => (
                <Row key={index} className=" mb-2 ">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-title">
                        <strong>{typeDescriptions[signal.typeSignal]}{" "}
                        {signal.nomProjet && `(${signal.nomProjet}) `}
                        {signal.nomUtilisateur && `(${signal.nomUtilisateur}) `}
                          
                          </strong> {" : "}{signal.descSignal}
                      </p>
                      <div className="d-flex justify-content-between align-itmes-center"> 
                      <p className="card-text">
          {signal.reponse ? `Réponse : ${signal.reponse}` : "Signalement pas encore traité"}
        </p>
                        <p className=" ms-auto">
                      envoyé le : {new Date(signal.createdAt).toLocaleDateString()}
                      </p>
                      </div>
                      
                    </div>
                  </div>
                </Row>
              ))}
            </Row>
          </div>
        </Col>

        <Col lg={4} className=" formRow">
          <Form onSubmit={handleCreateSignal}>
            <div className="d-flex justify-content-end align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="btn " id="dropdown-type">
                  {typeProbleme === "probleme_technique"
                    ? "Problème technique"
                    : typeProbleme === "probleme_user"
                    ? "Problème d'utilisateur"
                    : "Problème de projet"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleTypeChange("probleme_technique")}
                  >
                    Problème technique
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleTypeChange("probleme_user")}
                  >
                    Problème d'utilisateur
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleTypeChange("probleme_projet")}
                  >
                    Problème de projet
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <Form.Group controlId="formDescription">
              <Form.Label>Signaler un problème</Form.Label>
              <Form.Control
                as="textarea"
                rows={typeProbleme === "probleme_technique" ? 6 : 3}
                placeholder="Quel problème vous rencontrer ?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            {typeProbleme === "probleme_user" && (
              <Form.Group controlId="formNomUtilisateur">
                <Form.Label>Nom de l'utilisateur</Form.Label>
                <Form.Control
                  type="text"
                  value={nomUtilisateur}
                  onChange={(e) => setNomUtilisateur(e.target.value)}
                />
              </Form.Group>
            )}
            {typeProbleme === "probleme_projet" && (
              <Form.Group controlId="formNomProjet">
                <Form.Label>Nom du projet</Form.Label>
                <Form.Control
                  type="text"
                  value={nomProjet}
                  onChange={(e) => setNomProjet(e.target.value)}
                />
              </Form.Group>
            )}
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Button variant="btn btnSearch" className="" type="submit">
                Envoyer
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
