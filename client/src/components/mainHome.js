import React from 'react'
import '../cssStyle/home.css'
import MyNavbar from './navbar'
import SearchForm from './searchForm';
import { Container, Row, Col } from 'react-bootstrap';

export default function MainHome(props) {
  return (

    <div className='main container-fluid'>
    
       <MyNavbar role={props.role} validToken={props.validToken}/>
       <div className='d-flex flex-column justify-content-center align-items-center '>
        <h1>JUPITER</h1>
        <h2>Outil de gestion de projet</h2>
        <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={12} className="text-center">
          <h6>Plateforme complète pour une gestion de projet simple et efficace.</h6>
        </Col>
        <Col xs={12} md={12} className="text-center">
          <h6>Conçu pour booster votre productivité et mener vos projets vers le succès.</h6>
        </Col>
      </Row>
    </Container>
         <SearchForm titre='Recherche projets' role={props.role}/>
       </div>
       <div className="custom-shape-divider-bottom-1717149053">
      <svg data-name="Layer 1"  viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
      </svg>
      </div>
    
    </div>
    
  )
}
