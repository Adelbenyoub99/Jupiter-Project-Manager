import React from 'react'
import { Modal, Button } from 'react-bootstrap';
export default function ModalConfirmation({ show, onHide, messageText, actionText, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered>
    <Modal.Body>{messageText}</Modal.Body>
    <Modal.Footer>
      <Button className="addBtn" onClick={onHide}>
        Annuler
      </Button>
      <Button className="refus" onClick={onConfirm}>
        {actionText}
      </Button>
    </Modal.Footer>
  </Modal>

  )
}
