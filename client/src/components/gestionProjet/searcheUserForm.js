import React, { useState } from 'react';
import { searchUser, addUserToProject } from '../../fetchRequests/projet/gestion/membres';
import { Form, Button, Modal, ListGroup, Alert } from 'react-bootstrap';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddIcon from '@mui/icons-material/Add';

export default function SearchUserForm({ projectId, onUserAdded }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showNoUsersAlert, setShowNoUsersAlert] = useState(false); // Ajout de l'état pour l'alerte
  const [showAlreadyMemberAlert, setShowAlreadyMemberAlert] = useState(false);
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('Token');
      const results = await searchUser(token, searchTerm);
      
      if (results.length === 0) {
        // Aucun utilisateur trouvé, afficher l'alerte
        setShowNoUsersAlert(true);
      } else {
        // Utilisateurs trouvés, réinitialiser l'alerte et mettre à jour les résultats de la recherche
        setShowNoUsersAlert(false);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddUser = async (userId) => {
    try {
      const token = localStorage.getItem('Token');
      const data = await addUserToProject(token, projectId, userId);
      if (data && data.message === "L'utilisateur est déjà membre de ce projet.") {
        setShowAlreadyMemberAlert(true);
      } else {
        onUserAdded(data);
      setShowModal(false);
      }

    } catch (error) {
      console.error('Error adding user to project:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const resetSearchResults = () => {
    setSearchResults([]);
    setSearchTerm(null)
    setShowNoUsersAlert(false)
    setShowAlreadyMemberAlert(false)
  };

  return (
    <div>
      <button
        className='dropDownTrie btn d-flex ms-1 me-auto'
        onClick={() => setShowModal(true)}
      >
        <h5 className='me-2'> Ajouter</h5>
        <GroupAddIcon />
      </button>

      <Modal show={showModal} onHide={() => { setShowModal(false); resetSearchResults(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un membre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='d-flex justify-content-center align-items-center searchForm searchUser mt-0'>
              <Form.Control
                type="search"
                placeholder="Rechercher un utilisateur"
                className="searchInput"
                aria-label="Recherche"
                value={searchTerm}
                onKeyPress={handleKeyPress}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="btn btn-no-hover"
                className="searchBtn me-auto"
                onClick={handleSearch}
              >
                Recherche
              </Button>
            </div>
          </Form>
          {showNoUsersAlert && ( // Affichage conditionnel de l'alerte
            <Alert variant="warning" className="mt-3">
              Aucun utilisateur trouvé
            </Alert>
          )}
           {showAlreadyMemberAlert && (
            <Alert variant="warning" className="mt-3">
              L'utilisateur est déjà membre de ce projet.
            </Alert>
          )}
          <ListGroup className="mt-3">
            {searchResults.map((user) => (
              <ListGroup.Item key={user.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <img
                      src={`http://localhost:5000/uploadsIMG/${user.image}`}
                      alt=""
                      className="imageProfile"
                      thumbnail
                      crossOrigin="anonymous"
                    />
                    <span className="ms-1">{user.nomUtilisateur}</span>
                    <div>({user.nom} {user.prenom})</div>
                  </div>
                  <AddIcon className='actionIcon' onClick={() => handleAddUser(user.idUtilisateur)} />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
}
