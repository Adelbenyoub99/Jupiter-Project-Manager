import React from 'react';
import gestion from '../icons/gestion-de-projet.png';
import planification from '../icons/planificateur.png';
import equipe from '../icons/equipe.png';
import '../cssStyle/services.css';

export default function Services() {
  return (
    <div className='container my-2'>

      <div className='row'>
        <div className='col-12 col-md-6 d-flex justify-content-start mb-4'>
          <div className='d-flex flex-column align-items-center'>
            <div className='service'>
              <img className='serviceIcons img-fluid' src={gestion} alt="gestion" />
            </div>
            <h6 className='serviceFont mt-3'>Gestion</h6>
            <p className='text-center'>
              Optimisez vos processus avec des outils de gestion avancés. Suivez le progrès de vos projets, gérez les ressources et assurez la livraison à temps.
            </p>
          </div>
        </div>
        <div className='col-12 col-md-6 d-flex justify-content-end mb-4'>
          <div className='d-flex flex-column align-items-center'>
            <div className='service'>
              <img className='serviceIcons img-fluid' src={planification} alt="planification" />
            </div>
            <h6 className='serviceFont mt-3'>Planification</h6>
            <p className='text-center'>
              Organisez vos tâches et priorités avec notre interface intuitive. Créez des calendriers, définissez des échéances et assurez-vous que chaque étape est bien planifiée.
            </p>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-3 d-flex justify-content-start mb-4'></div>
        <div className='col-12 col-md-6 d-flex justify-content-start mb-4'>
          <div className='d-flex flex-column align-items-center'>
            <div className='service'>
              <img className='serviceIcons img-fluid' src={equipe} alt="equipe" />
            </div>
            <h6 className='serviceFont mt-3'>Collaboration</h6>
            <p className='text-center'>
              Travaillez en équipe de manière fluide et efficace. Partagez des fichiers, échangez des idées et communiquez en temps réel pour des projets réussis.
            </p>
          </div>
        </div>
        <div className='col-12 col-md-3 d-flex justify-content-start mb-4'></div>
      </div>
    </div>
  );
}
