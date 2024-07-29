import React, { useState } from 'react';
import jupiterLogo from '../images/JupiterNoBG.png';
import close from '../icons/close.png'
import { Link, useNavigate } from 'react-router-dom';
import { Login } from '../fetchRequests/user/userAccount';
import { LoginAdmin } from '../fetchRequests/admin/adminAccount';
export default function LoginModel(props) {
  const [nomAdmin, setnomAdmin] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await Login(email, password);
      if (response) {
        // Clear the error message if login is successful
        setErrorMessage('');
        navigate('/WorkSpace');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.status === 401) {
        setErrorMessage('Email ou mot de passe invalide. Veuillez réessayer.');
      } else if (error.status === 403) {
        setErrorMessage('Compte suspendu. Veuillez contacter l\'administrateur.');
      } else {
        setErrorMessage('Erreur interne du serveur. Veuillez réessayer plus tard.');
      }
    }
  };
  const loginAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await LoginAdmin(nomAdmin, password);
      if (response) {
        // Clear the error message if login is successful
        setErrorMessage('');
        navigate('/AdminDashBoard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Email ou mot de passe invalide. Veuillez réessayer.'); // Set the error message
    }
  };
  return ( 
    <div className='loginModel container ms-4'>
      <div className='d-flex justify-content-between align-items-center'>
         <img className='logo img-fluid' src={jupiterLogo} alt="Jupiter Logo" />
         <img className='closeIcon img-fluid mb-auto' src={close} alt="close" onClick={() => navigate('/')} style={{cursor:'pointer'}} />
      </div>
     
      <div className='d-flex flex-column'>
        <h3 className='hdr d-flex justify-content-center align-items-center'>
          {props.role ? 'Connexion Admin' : 'Connexion'}
          </h3>
        <form className='ms-2 me-2' onSubmit={props.role ? loginAdmin : login}>
        {props.role ? 
         <div>
            <label htmlFor="nomAdmin" className="form-label">Nom d'administarteur</label>
            <input 
              type="text" 
              className="form-control" 
              id="nomAdmin" 
              placeholder="" 
              value={nomAdmin} 
              onChange={(e) => setnomAdmin(e.target.value)} 
              required 
            />
          </div>
     :
     <div>
            <label htmlFor="email" className="form-label">Adresse email</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
     } 
          <div>
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            <p className="text-start mt-0">
              {props.role ? <></>: <Link to="/forgotpassword" className="link">Mot de passe oublié ?</Link>}
              
            </p>
          </div>
          {errorMessage && ( // Conditionally render the error message
            <p className="text-danger" >
              {errorMessage}
            </p>
          )}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-no-hover">Se connecter</button>
          </div>
          {props.role ? <></> :
           <div className='d-flex flex-column justify-content-center align-items-center'> 
            <hr className='createAccountSeparator' />
            <h6>Vous n'avez pas de compte ? 
              <Link to="/register" className='link'> S'inscrire ici !</Link>
            </h6>
          </div>}
          
        </form>
      </div>
    </div>
  );
}
