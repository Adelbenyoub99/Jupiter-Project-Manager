import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  Card,
  Tabs,
  Tab,
  Modal,
  Alert,
} from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../cssStyle/user.css";
import {
  getUserInfo,
  updateUser,
  updateUserIMG,
  deleteAccount,
  Deconnect,
} from "../fetchRequests/user/userAccount";
import { Input } from "@mui/material";

export default function UserParametres() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    nomUtilisateur: "",
    nom: "",
    prenom: "",
    numTel: "",
    email: "",
    dateNaissance: "",
    descProfile: "",
  });
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (localStorage.getItem("Token")) {
        try {
          const user = await getUserInfo(localStorage.getItem("Token"));
          setUser(user);
          setUserData({
            nomUtilisateur: user.nomUtilisateur,
            nom: user.nom,
            prenom: user.prenom,
            numTel: user.numTel,
            email: user.email,
            dateNaissance: user.dateNaissance,
            descProfile: user.descProfile,
          });
          setImage(user.imageUrl);
        } catch (error) {
          console.log("Error getting user info: " + error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleImageChange = async (e) => {
    if (e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const imgResponse = await updateUserIMG(
          localStorage.getItem("Token"),
          formData
        );
        setUser(imgResponse);
        setImage(imgResponse.imageUrl);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 2000);
      } catch (error) {
        console.error("Error updating user image:", error);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 2000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...userData };
      if (password) {
        updatedData.motDePasse = password;
      }
      const response = await updateUser(
        localStorage.getItem("Token"),
        updatedData
      );
      setUser(response);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 2000);
    } catch (error) {
      console.error("Error updating user:", error);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Si la date est vide, retourner une chaîne vide
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    if (month < 10) month = "0" + month; // Ajouter un zéro devant si le mois est inférieur à 10
    let day = dateObject.getDate();
    if (day < 10) day = "0" + day; // Ajouter un zéro devant si le jour est inférieur à 10
    return `${year}-${month}-${day}`;
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(localStorage.getItem("Token"));
      Deconnect();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      setShowErrorAlert(true);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="userMainContainer ">
      {user ? (
        <Row className="d-flex align-items-start justify-content-between ">
          <Col className="user-profile-col" md={4}>
            <Card className="user-profile-card mb-2">
              <Card.Body>
                <div className="user-image-container">
                  <Image
                    src={"http://localhost:5000" + image}
                    alt="Profile Image"
                    thumbnail
                    crossOrigin="anonymous"
                  />
                  <Input
                    type="file"
                    id="imageUpload"
                    hidden
                    onChange={handleImageChange}
                  />
                  <EditIcon
                    className="edit-icon"
                    onClick={() =>
                      document.getElementById("imageUpload").click()
                    }
                  />
                </div>
                <Card.Title>
                  {user.nom} {user.prenom}
                </Card.Title>
                <Card.Text>Nom d'utilisateur: {user.nomUtilisateur}</Card.Text>

                <Card.Text>Email: {user.email}</Card.Text>
                <div className="d-flex  align-items-start justify-content-end">
                  <DeleteIcon
                    onClick={() => setShowModal(true)}
                    className="delete-button"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8} className="user-details-col ">
            <div className="d-flex flex-column w-100 justif-content-center ">
              <Tabs
                defaultActiveKey="profile"
                id="user-tabs"
                className="mb-3 tabsUser"
              >
                <Tab
                  eventKey="profile"
                  title="Profil"
                  tabClassName="custom-tab"
                >
                  <Form onSubmit={handleSubmit}>
                    <div className="form-group-row">
                      <Form.Group
                        controlId="nomUtilisateur"
                        className="flex-fill"
                      >
                        <Form.Label>Nom d'utilisateur</Form.Label>
                        <Form.Control
                          type="text"
                          name="nomUtilisateur"
                          value={userData.nomUtilisateur}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="nom" className="flex-fill">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          type="text"
                          name="nom"
                          value={userData.nom}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="prenom" className="flex-fill">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          type="text"
                          name="prenom"
                          value={userData.prenom}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </div>
                    <Form.Group controlId="dateNaissance">
                      <Form.Label>Date de naissance</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateNaissance"
                        value={formatDate(userData.dateNaissance)} // Appel de la fonction formatDate pour formater la date de naissance
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="descProfile">
                      <Form.Label>
                        Parler de vous et de vos compétences
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="descProfile"
                        value={userData.descProfile}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button type="submit" className="save-button">
                        Enregistrer
                      </Button>
                    </div>
                  </Form>
                </Tab>
                <Tab
                  eventKey="contact"
                  title="Informations de contact"
                  tabClassName="custom-tab"
                >
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="numTel">
                      <Form.Label>Numéro de téléphone</Form.Label>
                      <Form.Control
                        type="text"
                        name="numTel"
                        value={userData.numTel}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button type="submit" className="save-button">
                        Enregistrer
                      </Button>
                    </div>
                  </Form>
                </Tab>
                <Tab
                  eventKey="password"
                  title="Mot de passe"
                  tabClassName="custom-tab"
                >
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="motDePasse">
                      <Form.Label>Saisir un nouveau mot de passe</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="motDePasse"
                          value={password}
                          onChange={handlePasswordChange}
                        />
                        {!showPassword ? (
                          <VisibilityOffIcon
                            className="visiblityIcon"
                            onClick={togglePasswordVisibility}
                          />
                        ) : (
                          <VisibilityIcon
                            className="visiblityIcon"
                            onClick={togglePasswordVisibility}
                          />
                        )}
                      </div>
                    </Form.Group>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button type="submit" className="save-button">
                        Enregistrer
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="loading-message">
          Chargement des données utilisateur...
        </div>
      )}
      {/* Modal pour la confirmation de la suppression du compte */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
          irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn " onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="btn" onClick={handleDeleteAccount}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alertes Bootstrap pour les succès et les erreurs */}
      <Alert
        show={showSuccessAlert}
        variant="success"
        onClose={() => setShowSuccessAlert(false)}
        dismissible
      >
        Les modifications ont été enregistrées avec succès.
      </Alert>
      <Alert
        show={showErrorAlert}
        variant="danger"
        onClose={() => setShowErrorAlert(false)}
        dismissible
      >
        Une erreur s'est produite lors de l'enregistrement des modifications.
      </Alert>
    </Container>
  );
}
