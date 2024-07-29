import React from 'react';
import { Nav } from 'react-bootstrap';
import {  FaTasks, FaUser, FaFileAlt, FaExclamationTriangle,FaLayerGroup } from 'react-icons/fa';

import '../cssStyle/menuSupport.css'; // Assurez-vous que votre fichier CSS est correctement importé

export default function MenuSupport() {
  return (
    <div className="menu-support">
      <Nav className="flex-column">
        <div className="menu-item">
          <FaLayerGroup className="icon" />
          <Nav.Link href="#projet">Projets</Nav.Link>
        </div>
        <div className="menu-item">
          <FaTasks className="icon" />
          <Nav.Link href="#tache">Tâches</Nav.Link>
        </div>
        <div className="menu-item">
          <FaUser className="icon" />
          <Nav.Link href="#membre">Membres</Nav.Link>
        </div>
        <div className="menu-item">
          <FaFileAlt className="icon" />
          <Nav.Link href="#document">Documents</Nav.Link>
        </div>
        <div className="menu-item">
          <FaExclamationTriangle className="icon" />
          <Nav.Link href="#signalement">Signalements</Nav.Link>
        </div>
      </Nav>
    </div>
  );
}
