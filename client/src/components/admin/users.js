import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  activateAccount,
  disactivateAccount,
  reintializePSW,
  searchUser,
  createUser,
} from "../../fetchRequests/admin/adminUser";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Container } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [term, setTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function fetchUsers(term = "") {
    try {
      const token = localStorage.getItem("Token");
      const fetchedUsers = term ? await searchUser(token, term) : await getAllUsers(token);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefreshPassword = async (idUser) => {
    try {
      const token = localStorage.getItem("Token");
      await reintializePSW(token, idUser);
    } catch (error) {
      console.error("Error refreshing password:", error);
    }
  };

  const handleActivateAccount = async (idUser) => {
    try {
      const token = localStorage.getItem("Token");
      await activateAccount(token, idUser);
      fetchUsers();
    } catch (error) {
      console.error("Error activating account:", error);
    }
  };

  const handleDeactivateAccount = async (idUser) => {
    try {
      const token = localStorage.getItem("Token");
      await disactivateAccount(token, idUser);
      fetchUsers();
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(term);
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("Token");
      await createUser(token, { email, motDePasse: password });
      fetchUsers();
      setShowModal(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="mainDiv">
      <div className="mb-5 m-4 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button
            className='dropDownTrie btn d-flex mt-4 ms-1 me-auto'
            onClick={() => setShowModal(true)}
          >
            <h5 className='me-2'> Ajouter</h5>
            <GroupAddIcon />
          </button>
          <div className="d-flex justify-content-center align-items-center searchForm">
            <Form onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Recherche utilisateurs"
                className="searchInput"
                aria-label="Recherche"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </Form>
            <Button variant="btn btn-no-hover" className="searchBtn me-auto" onClick={handleSearch}>
              Recherche
            </Button>
          </div>
        </div>
        
        <Table bordered hover className="mb-5">
          <thead>
            <tr>
              <th>
                <FontAwesomeIcon icon={faAddressBook} className="me-1" />
                Utilisateurs
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.idUtilisateur}>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {`${user.nom} ${user.prenom} (${user.nomUtilisateur}) `}
                      {user.descProfile && `: ${user.descProfile}`}
                      {user.isActive ? (
                        <CheckCircleIcon className="ms-3 active" />
                      ) : (
                        <CancelIcon className="ms-2 notActive" />
                      )}
                    </div>

                    <div className="ms-5">
                      ({new Date(user.createdAt).toLocaleDateString()})
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="me-3">
                      <EmailIcon className="me-1" /> {user.email}
                    </div>
                    {user.numTel && (
                      <div>
                        <LocalPhoneIcon className="me-1" /> {`+213 ${user.numTel}`}
                      </div>
                    )}
                  </div>
                </td>

                <td className="text-center">
                  {user.isActive ? (
                    <>
                      
                      <Button className="desactive" onClick={() => handleDeactivateAccount(user.idUtilisateur)}>
                        Desactiver <DeleteIcon />
                      </Button>
                    </>
                  ) : (
                    <Button className="addBtn" onClick={() => handleActivateAccount(user.idUtilisateur)}>
                      Réactiver compte <RestoreFromTrashIcon />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Mot de Passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div className="d-flex justify-content-center align-item-center"> 
            <Button className="addBtn " onClick={handleCreateUser}>
            Enregistrer
          </Button>
          </div>
          
        </Modal.Body>
        
      </Modal>
    </div>
  );
}
