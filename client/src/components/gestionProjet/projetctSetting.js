import React, { useState } from 'react';
import DetailProjet from './detailProjet';
import StatistiqueProjet from './statProjet';
import { Button } from "react-bootstrap";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteProject, quitterProjet } from '../../fetchRequests/projet/gestion/projet';
import ModalConfirmation from './modalConfirm'
import { useNavigate } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';
export default function ProjectSettings({ projectId, role,projectUrl }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const navigate = useNavigate();
  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem('Token');
      await deleteProject(token, projectId);
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
      // Optionally: Handle error (e.g., show error message)
    } finally {
      setShowDeleteConfirmation(false); // Close modal after deletion attempt
    }
  };

  const handleLeaveProject = async () => {
    try {
      const token = localStorage.getItem('Token');
      await quitterProjet(token, projectId);
      navigate('/');
    } catch (error) {
      console.error('Error leaving project:', error);
      // Optionally: Handle error (e.g., show error message)
    } finally {
      setShowLeaveConfirmation(false); // Close modal after leaving attempt
    }
  };
  const handleShareProject = () => {
    const projectLink = `${window.location.origin}/accepterpartage/${projectUrl}`;

    // Copy projectLink to clipboard
    navigator.clipboard.writeText(projectLink)
      .then(() => alert(`Lien copié: ${projectLink}`))
      .catch((err) => console.error('Erreur lors de la copie du lien:', err));
  };
  return (
    <div className='pb-4'>
      <div className="d-flex align-items-center pt-1">
        <h4 className="ms-2 text-dark">Gérer vos projet avec JUPITER</h4>
        <hr className="flex-grow-1 ms-2" />
        {role === "ChefProjet" && (
          <Button className='dropDownTrie btn d-flex ms-1 me-3' onClick={handleShareProject}>
            Partager <ReplyIcon/>
          </Button>
        )}
      </div>

      <DetailProjet projectId={projectId} role={role} />
      <StatistiqueProjet projectId={projectId} />

      <div className="d-flex align-items-center justify-content-center pt-5">
        {role === "ChefProjet" ? (
          <>
            <Button className='refus' onClick={() => setShowDeleteConfirmation(true)}>
              Supprimer le projet <DeleteForeverIcon />
            </Button>

            {/* Delete Confirmation Modal */}
            <ModalConfirmation
              show={showDeleteConfirmation}
              onHide={() => setShowDeleteConfirmation(false)}
              messageText="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
              actionText="Supprimer"
              onConfirm={handleDeleteProject}
            />
          </>
        ) : (
          <>
            <Button className='refus' onClick={() => setShowLeaveConfirmation(true)}>
              Quitter le projet <MeetingRoomIcon />
            </Button>

            {/* Leave Confirmation Modal */}
            <ModalConfirmation
              show={showLeaveConfirmation}
              onHide={() => setShowLeaveConfirmation(false)}
              messageText="Êtes-vous sûr de vouloir quitter ce projet ?"
              actionText="Quitter"
              onConfirm={handleLeaveProject}
            />
          </>
        )}
      </div>
    </div>
  );
}
