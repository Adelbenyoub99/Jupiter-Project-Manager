import React, { useState } from "react";
import { Deconnect } from "../fetchRequests/user/userAccount";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Modal } from "react-bootstrap";

export default function Logout() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleLogout = () => {
    Deconnect();
    navigate("/");
  };

  return (
    <>
      <div className="logout" onClick={() => setShowModal(true)}>
        <LogoutIcon className="logoutIcon" />
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton />

        <Modal.Body>
          <Modal.Title>Déconnexion</Modal.Title>
          <p> Êtes-vous sûr de vouloir vous déconnecter ? </p>
          <div className="d-flex align-items-center justify-content-end ">
            <Button
              variant="btn btn-no-hover addProjectBtn "
              onClick={handleLogout}
            >
              Confirmer
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
