import React from "react";
import moment from "moment";
import JupiterIcon from "../images/JupiterIcon.png";
import { Tooltip } from "react-tooltip";
import Contact from "./contactToolTip";

export default function ProjetPublicCard({
  projet,
  demandeUser,
  envoyerDemande,
  annulerDemande,
  projectRole,
}) {
  const {
    idProjet,
    nomProjet,
    visibiliteProjet,
    membersCount,
    Chef,
    createdAt,
  } = projet;
  const demandeState = demandeUser ? demandeUser.etatDemande : null;
  const isButtonDisabled =
    demandeState === "En cours" ||
    demandeState === "Acceptée" ||
    demandeState === "Refusée" ||
    demandeState === "Annulée";

  const duration = moment.duration(moment().diff(moment(createdAt)));

  // Function to get the most significant unit
  const getSignificantDuration = (duration) => {
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (days > 0) {
      return `${days} jours`;
    } else if (hours > 0) {
      return `${hours} heures`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const significantDuration = getSignificantDuration(duration);
  const handleSendDemand = () => {
    if (!isButtonDisabled) {
      envoyerDemande(idProjet);
    }
  };
  const handleCancelDemand = () => {
    if (demandeUser) {
      annulerDemande(demandeUser.idDemande);
    }
  };
  return (
    <div className="card mb-4 shadow-sm rounded-lg h-100">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <div className="d-flex align-items-center">
          <img src={JupiterIcon} className="userProfil mr-3" alt="Profile" />
          <div>
            <div>
              {/* eslint-disable-next-line */}
              <a id={`clickable-${idProjet}`} href="#" className="userName">
                <strong className="my-anchor-element  userName">
                  {Chef.nomUtilisateur}
                </strong>
              </a>
              <Tooltip
                anchorSelect={`#clickable-${idProjet}`}
                className="custom-tooltip"
                place="top"
                clickable
                delayHide={700}
              >
                <Contact Chef={Chef} />
              </Tooltip>
            </div>

            <p className="mb-0 text-muted small">
              Il y a {significantDuration}
            </p>
          </div>
        </div>
        <span className={visibiliteProjet==="Public"? "custom-badge": "custom-badgeR"}>{visibiliteProjet}</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{nomProjet}</h5>
        <p className="card-text text-muted flex-grow-1">{projet.descProjet}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted small mt-2">{membersCount} membres</span>
          <div>
            {projectRole ? (
              <>
                <button className="btn btnPP btn-sm" disabled="true">
                  Vous êtes {projectRole}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btnPP btn-sm"
                  disabled={isButtonDisabled}
                  onClick={handleSendDemand}
                >
                  {isButtonDisabled
                    ? demandeUser.etatDemande
                    : "Envoyer demande"}
                </button>

                {demandeState && demandeState === "En cours" ? (
                  <button
                    className="btn btnPP btn-sm ms-1"
                    onClick={handleCancelDemand}
                  >
                    Annuler
                  </button>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
