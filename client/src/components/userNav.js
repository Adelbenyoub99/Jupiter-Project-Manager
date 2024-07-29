import React,{useState} from "react";
import { Navbar, Nav } from "react-bootstrap";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from '@mui/material/Badge';
import SendIcon from "@mui/icons-material/Send";
import HelpIcon from "@mui/icons-material/Help";
import LayersIcon from "@mui/icons-material/Layers";

export default function UserNav({ setActiveView, activeView,unreadNotificationsCount  }) {
  
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
            href="#calendar"
            className={`d-flex flex-column align-items-center navLink ${activeView === "calendar" ? "active" : ""}`}
            onClick={() => handleNavClick("calendar")}
          >
            <CalendarMonthIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Calendrier</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#projects"
            className={`d-flex flex-column align-items-center navLink ${activeView === "projects" ? "active" : ""}`}
            onClick={() => handleNavClick("projects")}
          >
            <LayersIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Projets</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#requests"
            className={`d-flex flex-column align-items-center navLink ${activeView === "requests" ? "active" : ""}`}
            onClick={() => handleNavClick("requests")}
          >
            <SendIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Demandes</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#notifications"
            className={`d-flex flex-column align-items-center navLink ${activeView === "notifications" ? "active" : ""}`}
            onClick={() => handleNavClick("notifications")}
          >  
          
          <Badge badgeContent={unreadNotificationsCount} color="primary">
         <NotificationsIcon className="navIcon" />
           </Badge>
            
            <span className="d-none d-sm-block navLabel">Notifications</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#settings"
            className={`d-flex flex-column align-items-center navLink ${activeView === "settings" ? "active" : ""}`}
            onClick={() => handleNavClick("settings")}
          >
            <ManageAccountsIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Paramètres</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center">
          <Nav.Link
            href="#help"
            className={`d-flex flex-column align-items-center navLink ${activeView === "help" ? "active" : ""}`}
            onClick={() => handleNavClick("help")}
          >
            <HelpIcon className="navIcon" />
            <span className="d-none d-sm-block navLabel">Aide</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}
