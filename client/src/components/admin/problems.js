import React, { useState, useEffect } from "react";
import {
  getAllSignals,
  answerSignal,
  deleteSignal
} from "../../fetchRequests/admin/adminSignal";
import { Form, Button, Container, Table, Modal } from "react-bootstrap";
import HelpIcon from '@mui/icons-material/Help';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from "@mui/icons-material/Delete";

export default function Problems() {
  const [signals, setSignals] = useState([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const token = localStorage.getItem("Token");
      const data = await getAllSignals(token);
      setSignals(data);
    } catch (error) {
      console.error("Error fetching signals:", error);
    }
  };

  const handleAnswerSignal = async (signalId) => {
    try {
      const token = localStorage.getItem("Token");
      await answerSignal(token, response,signalId);
      setShowResponseModal(false);
      setResponse("");
      fetchSignals();
    } catch (error) {
      console.error("Error answering signal:", error);
    }
  };

  const handleDeleteSignal = async (signalId) => {
    try {
      const token = localStorage.getItem("Token");
      await deleteSignal(token, signalId);
      fetchSignals();
    } catch (error) {
      console.error("Error deleting signal:", error);
    }
  };

  const renderSignalsTable = (signals, isTreated) => (
    <Table bordered  className="mb-2">
      <tbody>
        {signals.map((signal) => (
          <tr  key={signal.idSignal}>
            <td>
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center">
                    <img
                      src={"http://localhost:5000/uploadsIMG/" + signal.User.image}
                      alt="Profile"
                      className="imageProfile"
                      crossOrigin="anonymous"
                    />
                    <h5 className="ms-2 mt-2">{signal.User.nomUtilisateur}</h5>
                    <h6 className="ms-2 mt-2">({signal.typeSignal})</h6>
                  </span>
                  <span>{new Date(signal.createdAt).toLocaleDateString()}</span>
                </div>
                <div>{signal.descSignal}</div>
                {isTreated ? (
                  <div className="mt-2">
                    <strong>Réponse:</strong> {signal.reponse}
                  </div>
                ) : (
                  <div className="d-flex justify-content-end mt-2">
                    <Button
                      className="me-2 addBtn"
                      onClick={() => {
                        setSelectedSignal(signal);
                        setShowResponseModal(true);
                      }}
                    >
                      Répondre <ReplyIcon className="ms-1"/>
                    </Button>
                    <Button
                      className="desactive"
                      onClick={() => handleDeleteSignal(signal.idSignal)}
                    >
                      Supprimer <DeleteIcon className="ms-1"/>
                    </Button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const enregistrésSignals = signals.filter((signal) => signal.reponse === null);
  const traitésSignals = signals.filter((signal) => signal.reponse !== null);

  return (
    <div className="mainDiv">
      <div className="pb-5 m-4 pt-4 ">
        <h3 className="ms-3">Signalements enregistés <HelpIcon className='ms-2'/></h3>
        {renderSignalsTable(enregistrésSignals, false)}

        <h3 className="ms-3">Signalements traités <CheckBoxIcon className='ms-2'/> </h3>
        {renderSignalsTable(traitésSignals, true)}

        <Modal
          show={showResponseModal}
          onHide={() => setShowResponseModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Répondre au Signalement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="responseTextArea">
              <Form.Label>Réponse</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => handleAnswerSignal(selectedSignal.idSignal)}
            >
              Répondre
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
