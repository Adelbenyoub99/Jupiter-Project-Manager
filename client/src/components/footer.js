import React from 'react'
import '../cssStyle/footer.css'
import { Nav } from 'react-bootstrap';
import footerleft from '../images/footerleft.png'
import facebook from '../icons/facebook.png'
import email from '../icons/mail.png'
import call from '../icons/call.png'
import twitter from '../icons/twitter.png'
import instagram from '../icons/instagram.png'
export default function Footer() {
  return (
    <footer className="footer_bg ">
  <div className="container-fluid">
  <div className="row align-items-center justify-content-between">
    <div className="col-md-4">
      <h3 className='F_ttr'>JUPITER</h3>
      <h4 className='F_text'>
        Donner aux équipes les moyens <br/>d'atteindre leur objectifs grâce à <br/>
        une solution de gestion de projet<br/> innovante et conviviale
      </h4>
    </div>
    <div className="col-md-4 text-center">
      <div className='d-flex flex-column lign-items-center justify-content-center'>
      <div className="container d-flex  align-items-center justify-content-between">
         <Nav.Link href="#home" className='linkNav'>Accueil</Nav.Link>
          <Nav.Link href="#link" className='linkNav'>Projets</Nav.Link>
          <Nav.Link href="#about" className='linkNav'>Support</Nav.Link>
      </div>
        <p className='mt-4 pt-2'>&copy; {new Date().getFullYear()} JUPITER Project Manager</p>
      </div> 
    </div>
    <div className="col-md-4 d-flex align-items-center justify-content-between leftside">
    <div className='d-flex flex-column align-items-center justify-content-center'>
      <div className='contact-info d-flex align-items-center mb-2'>
        <img src={email} alt="Email" className="contact-icon" />
        <span className='ml-2'>jupiterpfc2024@gmail.com</span>
      </div>
      <div className='contact-info d-flex align-items-center'>
        <img src={call} alt="Phone" className="contact-icon" />
        <span className='ml-2'>+213 (0) 562 01 14 62</span>
      </div>
      <div className='d-flex align-items-center justify-content-between mt-3'>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src={facebook} alt="Facebook" className="social-icon-img" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src={instagram} alt="Instagram" className="social-icon-img" />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src={twitter} alt="Twitter" className="social-icon-img" />
        </a>
      </div>
    </div>
    <img className=' footerleft' alt='jpm' src={footerleft} />
    </div>
    
  </div>
 
 
  </div>

</footer>
  )
}
