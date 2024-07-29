import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BarChartIcon from '@mui/icons-material/BarChart';
export default function AdminNav({setActiveView, activeView}) {
  
  const handleNavClick = (view) => {
    setActiveView(view);
  };

  return (
    <Navbar
      fixed="bottom"
      bg="light"
      className="userNav d-flex justify-content-center"
    >
      <Nav className="w-100 d-flex justify-content-around">
      <Nav.Item className="text-center">
          <Nav.Link
            href="#stats"
            className={`d-flex flex-column align-items-center navLink ${activeView === "stats" ? "active" : ""}`}
            onClick={() => handleNavClick("stats")}
          >
            <BarChartIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Statistiques</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#Users"
            className={`d-flex flex-column align-items-center navLink ${activeView === "users" ? "active" : ""}`}
            onClick={() => handleNavClick("users")}
          >   
            <FontAwesomeIcon icon={faUsers} className="navIcon"/>
          
            
            <span className="d-none d-sm-block navLabel">Utilisateurs</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#Projets"
            className={`d-flex flex-column align-items-center navLink ${activeView === "projets" ? "active" : ""}`}
            onClick={() => handleNavClick("projets")}
          >
            <FontAwesomeIcon icon={faLayerGroup} className="navIcon"/>
            <span className="d-none d-sm-block navLabel">Projets</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#userhelp"
            className={`d-flex flex-column align-items-center navLink ${activeView === "userhelp" ? "active" : ""}`}
            onClick={() => handleNavClick("userhelp")}
          >
            <ContactMailIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Signalements</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#admins"
            className={`d-flex flex-column align-items-center navLink ${activeView === "admins" ? "active" : ""}`}
            onClick={() => handleNavClick("admins")}
          >
            <AdminPanelSettingsIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Administrateurs</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}
