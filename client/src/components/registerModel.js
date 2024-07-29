import React, { useState } from 'react';
import jupiterLogo from '../images/JupiterNoBG.png';
import close from '../icons/close.png';
import { Link, useNavigate } from 'react-router-dom';
import { Register } from '../fetchRequests/user/userAccount';

export default function RegisterModel() {
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const verifyEmail = async (email) => {
    try {
      const response = await fetch(`https://api.zerobounce.net/v2/validate?api_key=8dbe02941bb54c82b0f250bf8ee0b963&email=${email}`);
      const result = await response.json();
      return result.status === 'valid';
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email :', error);
      return false;
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return password.length >= minLength && specialCharacterRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const isEmailValid = await verifyEmail(userData.email);
    if (!isEmailValid) {
      setErrorMessage('L\'email fourni n\'est pas valide. Veuillez fournir un email valide.');
      return;
    }
    
    if (!validatePassword(userData.motDePasse)) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, y compris un caractère spécial !@#$%^&*()...');
      return;
    }

    try {
      const response = await Register(userData);
      if (response) {
        // Clear the error message if registration is successful
        setErrorMessage('');
        // Redirect the user to the login page after successful registration
        navigate('/WorkSpace');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      setErrorMessage('Erreur lors de l\'inscription. Veuillez réessayer.'); // Set the error message
    }
  };

  return (
    <div className='loginModel container ms-4'>
      <div className='d-flex justify-content-between align-items-center'>
        <img className='logo img-fluid' src={jupiterLogo} alt="Jupiter Logo" />
        <img className='closeIcon img-fluid mb-auto' src={close} alt="close" onClick={() => navigate('/')} style={{cursor:'pointer'}}/>
      </div>
      <div className='d-flex flex-column'>
        <h3 className='hdr d-flex justify-content-center align-items-center'>Inscription</h3>
        <form className='ms-2 me-2' onSubmit={handleRegister}>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='me-2'>
              <label htmlFor="prenom" className="form-label">Prénom</label>
              <input
                type="text"
                className="form-control"
                id="prenom"
                name="prenom"
                placeholder=""
                value={userData.prenom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="nom" className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                id="nom"
                name="nom"
                placeholder=""
                value={userData.nom}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder=""
              value={userData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="motDePasse" className="form-label">Créer un mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="motDePasse"
              name="motDePasse"
              placeholder=""
              value={userData.motDePasse}
              onChange={handleInputChange}
              required
            />
          </div>
          {errorMessage && ( 
            <p className="text-danger">
              {errorMessage}
            </p>
          )}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-no-hover">S'inscrire</button>
          </div>
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <hr className='createAccountSeparator' />
            <h6>Vous avez déjà un compte ? <Link to="/login" className='link'>Connectez-vous ici</Link></h6>
          </div>
        </form>
      </div>
    </div>
  );
}
