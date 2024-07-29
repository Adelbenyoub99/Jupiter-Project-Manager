import React, { useEffect,useState } from "react";
import { Navbar, Nav,  Button, Collapse } from "react-bootstrap";


export default function SideNav({projects}) {
  const [open, setOpen] = useState({});

  useEffect(() => {
    
  }, []);
  const toggleCollapse = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index]
    }));
  };
  return (
    <Navbar bg="transparent" expand="lg" className="flex-column m-2">
    <Nav className="flex-column">
      {projects.map((proj, index) => (
        <div key={index}>
          <Button
            onClick={() => toggleCollapse(index)}
            aria-controls={`collapse-text-${index}`}
            aria-expanded={open[index]}
            className="w-100 text-left mb-2"
          >
            {proj.nomProjet}
          </Button>
          <Collapse in={open[index]}>
            <div id={`collapse-text-${index}`} className="pl-3">
              <Nav.Link href="#tasks">Tâches</Nav.Link>
              <Nav.Link href="#members">Membres</Nav.Link>
              <Nav.Link href="#documents">Documents Généraux</Nav.Link>
              <Nav.Link href="#discussion">Discussion</Nav.Link>
            </div>
          </Collapse>
        </div>
      ))}
    </Nav>
  </Navbar>
  );
}
