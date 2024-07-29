import React, { useState } from "react";
import { Button, Popover, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/Download';
import { renameFile, deleteFile, downloadFile } from "../../fetchRequests/projet/gestion/fichiers";
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import ModalConfirmation from "./modalConfirm";

export default function DetailFile({ file, role, onUpdate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFileName, setNewFileName] = useState(file.nomFichier);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setIsEditing(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Function to format the createdAt date
  const formatCreatedAtDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownload = () => {
    downloadFile(file.url);
  };

  const handleRenameClick = () => {
    setIsEditing(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveRename();
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('Token');
      const projectId = file.idProjet;
      const fileId = file.idFichier;
      await deleteFile(token, projectId, fileId);
      setShowDeleteModal(false);
      onUpdate(); // Trigger update
      console.log('File deleted successfully:');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const openDeleteModal = (idFile) => {
    setFileToDelete(idFile);
    setShowDeleteModal(true);
    handlePopoverClose();
  };

  const handleSaveRename = async () => {
    try {
      const token = localStorage.getItem('Token');
      const projectId = file.idProjet;
      const fileId = file.idFichier;
      const response = await renameFile(token, projectId, fileId, newFileName);
      console.log('File renamed successfully:', response);
      setIsEditing(false);
      onUpdate(); // Trigger update
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  const handleCancelRename = () => {
    setNewFileName(file.nomFichier);
    setIsEditing(false);
  };

  return (
    <>
      <div className="actions">
        <Button
          variant="text"
          aria-owns={open ? "file-popover" : undefined}
          aria-haspopup="true"
          onClick={handlePopoverOpen}
          className="moreIcon"
        >
          <MoreVertIcon />
        </Button>
      </div>
      <Popover
        id="file-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="popover-content">
          <div className="d-flex justify-content-between align-items-center">
            <p className="user-info">
              <img
                src={"http://localhost:5000/uploadsIMG/" + file.User.image}
                alt="User"
                className="user-image"
                thumbnail
                crossOrigin="anonymous"
              />
              <strong className="me-2">{file.User.nomUtilisateur}</strong> a partagé
            </p>
            <DownloadIcon style={{ cursor: 'pointer' }} onClick={handleDownload} />
          </div>

          {isEditing ? (
            <form>
              <InputGroup className="mb-3 ms-auto">
                <FormControl
                  value={newFileName}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                  className="searchInput"
                />
                <Button onClick={handleCancelRename}>
                  <CloseIcon className="icon moreIcon pt-1" />
                </Button>
              </InputGroup>
            </form>
          ) : (
            <Typography variant="body1" className="file-name">
              {file.nomFichier}
            </Typography>
          )}

          <Typography variant="body2" className="file-date">
            {formatCreatedAtDate(file.createdAt)}
          </Typography>

          {["Adjoint", "ChefProjet"].includes(role) && (
            <div className="action-buttons">
              {!isEditing && (
                <button className="detailActionBtn" onClick={handleRenameClick}>
                  Renommer <BorderColorIcon className="iconDetail" />
                </button>
              )}
              <button className="detailActionBtn"
                onClick={() => openDeleteModal(file.idFichier)}
              >
                Supprimer <DeleteForeverIcon className="iconDetail" />
              </button>
            </div>
          )}
        </div>
      </Popover>

      <ModalConfirmation
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        messageText={`Voulez-vous supprimer ce fichier ?`}
        actionText="Supprimer"
        onConfirm={handleDelete}
      />
    </>
  );
}
