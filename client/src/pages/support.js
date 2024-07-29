import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import MenuSupport from "../components/menuSupport";
import "../cssStyle/support.css";
import "../cssStyle/home.css";
import supportCreerProjet from "../images/supportcreerprojet.png";
import gestionDesTaches from "../images/gestiondestaches.png";
import supportProjet from "../images/supportprojet.png";
import supportMembre from "../images/gestionmembre.png";
import supportDemande from "../images/gestiondemande.png";
import supportDocument from "../images/gestiondocument.png";
import supportSignal from "../images/signalement.png";
import { getRole } from "../fetchRequests/getRole";

export default function Support() {
  const [validToken, setValidToken] = useState(true);
  const [role, setRole] = useState("");

  const isTokenValid = () => {
    const token = localStorage.getItem("Token");
    const expirationTime = localStorage.getItem("TokenExpiration");

    if (!token || !expirationTime) {
      return false;
    }

    const currentTime = new Date().getTime();

    if (currentTime > expirationTime) {
      localStorage.removeItem("Token");
      localStorage.removeItem("Prenom");
      localStorage.removeItem("TokenExpiration");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!isTokenValid()) {
      console.log(
        "Token is expired or not present. Redirecting to login page."
      );
      setValidToken(false);
    }
    const fetchRol = async () => {
      const data = await getRole(localStorage.getItem("Token"));
      setRole(data);
    };
    fetchRol();
  }, []);

  return (
    <div>
      <div className="main mainPP">
        <Navbar role={role} validToken={validToken} />
        <div className="d-flex flex-column justify-content-center align-items-center mx-5">
          <h1>Tutoriels d'utilisation</h1>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className="custom-shape-divider-bottom-1717149053PP">
            <svg
              data-name="Layer 1"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className="shape-fill"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="container-fluid support-container">
        <div className="row support-content">
          <div className="col-2 ">
            <MenuSupport />
          </div>
          <div className="col-10 ps-5">
            <div>
              <div>
                <section id="projet">
                  <div className="d-flex align-items-center ">
                    <h2 className=" text-dark">Gestion de projet</h2>
                    <hr className="flex-grow-1 ms-2" />
                  </div>
                  <h4>Créer un projet</h4>
                  <p>Description comment créer un projet</p>
                  <img
                    src={supportCreerProjet}
                    alt="Créer un projet"
                    className="support-image"
                  />
                  <h4>Page générale</h4>
                  <p>Description de la page générale du projet</p>
                  <img
                    src={supportProjet}
                    alt="Générale projet"
                    className="support-image"
                  />
                </section>
                <section id="tache">
                
                  <div className="d-flex align-items-center ">
                    <h2 className=" text-dark">Gestion des tâches</h2>
                    <hr className="flex-grow-1 ms-2" />
                  </div>
                  <p>Description de la gestion des tâches</p>
                  <img
                    src={gestionDesTaches}
                    alt="Gestion des tâches"
                    className="support-image"
                  />
                </section>
                <section id="membre">
                  
                  <div className="d-flex align-items-center ">
                    <h2 className=" text-dark">Membres et demandes d'adhésion</h2>
                    <hr className="flex-grow-1 ms-2" />
                  </div>
                  <h4>Gestion des membres</h4>
                  <p>Description de la gestion des membres</p>
                  <img
                    src={supportMembre}
                    alt="Gestion des membres"
                    className="support-image"
                  />
                  <h4>Gestion des demandes d'adhésion</h4>
                  <p>Description de la gestion des demandes d'adhésion</p>
                  <img
                    src={supportDemande}
                    alt="Gestion des demandes"
                    className="support-image"
                  />
                </section>
                <section id="document">
                 
                  <div className="d-flex align-items-center ">
                    <h2 className="text-dark">Gestion des fichiers partagés</h2>
                    <hr className="flex-grow-1 ms-2" />
                  </div>
                  <p>Description de la gestion des fichiers partagés</p>
                  <img
                    src={supportDocument}
                    alt="Document"
                    className="support-image"
                  />
                </section>
                <section id="signalement">
                 
                  <div className="d-flex align-items-center ">
                    <h2 className=" text-dark">Signalements</h2>
                    <hr className="flex-grow-1 ms-2" />
                  </div>
                  <p>Description comment signaler un problème</p>
                  <img
                    src={supportSignal}
                    alt="Signalement"
                    className="support-image"
                  />
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
