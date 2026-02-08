import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPSW } from '../fetchRequests/user/userAccount';

export default function ReserPassWord() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await resetPSW(email, newPassword);
      setMessage(`Mot de passe pour ${email} réinitialisé avec succès !`);
      navigate('/WorkSpace'); // Redirection vers WorkSpace après succès
    } catch (error) {
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    }
  };

  return (
    <div className="container-fluid bg  d-flex align-items-center">
      <div className='loginModel' style={{minHeight:"400px"}}>
        <h2>Réinitialisation de mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email :</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">Nouveau mot de passe :</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmer le nouveau mot de passe :</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Réinitialiser le mot de passe</button>
          {message && <p>{message}</p>}
        </form>  
      </div>
    </div>
  );
}
