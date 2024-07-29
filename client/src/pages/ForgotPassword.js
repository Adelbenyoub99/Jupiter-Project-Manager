import React, { useState } from 'react';
import { forgotPassWord } from '../fetchRequests/user/userAccount';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await forgotPassWord(email);
        setMessage('Email de réinitialisation envoyé avec succès. Vérifiez votre boîte mail.');
      } catch (error) {
        setMessage('Erreur lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer plus tard.');
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      }
  };

  return (
    <div className="container-fluid bg d-flex align-items-center">
  <div className='loginModel' style={{minHeight:"400px"}}>
 <h2>Mot de passe oublié</h2>
   <div className='d-flex flex-column align-items-center mt-2 p-5'>
  <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">Adresse email valide :</label>
        <input
          type="email"
          className="form-control" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn" type="submit">Envoyer le lien de réinitialisation</button>
      </form>
      {message && <p>{message}</p>}
   </div>
    
  </div>
     
    </div>
  );
}

export default ForgotPassword;
