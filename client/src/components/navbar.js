import React from 'react'
import '../cssStyle/navbar.css'
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import jupiterLogo from '../images/JupiterNoBG.png';
import { Link } from 'react-router-dom';

export default function MyNavbar(props) {

  return (
    <>
   <Navbar bg="transparent" expand="lg" >
      <Navbar.Brand href="#home">
        <img
          src={jupiterLogo}
          className="d-inline-block align-top logo"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
        <Link to="/" className='linkNav'>Accueil</Link>

        {props.role === "admin" ? <></> :  <Link to="/ProjetsPublics" className='linkNav'>Projets</Link>}
        <Link to="/Support" className='linkNav'>Support</Link>
        </Nav>  
        {(props.validToken) ? <></> 
        : <button className='login'>
         <Link to={"/login"} className='login'>Connexion</Link>
          </button>
        }
       {props.role === "user" ? (
           <button className='login'>
            <Link to={"/WorkSpace"} className='login'>WorkSpace</Link>
           </button>
        ) : (props.role === "admin" && !props.dashBoard) ? (
            <button className='login'>
             <Link to={"/AdminDashBoard"} className='login'>DashBoard</Link>
           </button>
        ) : <></>}
         
      </Navbar.Collapse>
    </Navbar>

   </>
  )
}
