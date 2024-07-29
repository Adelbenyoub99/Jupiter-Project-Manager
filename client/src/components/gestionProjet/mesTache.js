import React, { useState ,useEffect} from 'react';
import { Table } from 'react-bootstrap';
import { updateStatut } from '../../fetchRequests/projet/gestion/tache';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlagIcon from "@mui/icons-material/Flag";

export default function MesTaches({ mesTaches , onUpdateTaches}) {
  const [taches, setTaches] = useState(mesTaches);
  useEffect(() => {
    setTaches(mesTaches);
  }, [mesTaches]);
  const handleStatusChange = async (idTache, currentStatus) => {
    const newStatus = currentStatus !== 'Terminé' ? 'Terminé' : 'En cours';
    try {
      const token = localStorage.getItem('Token');
      await updateStatut(token, idTache, newStatus);
      setTaches(taches.map(tache =>
        tache.idTache === idTache ? { ...tache, statutTache: newStatus } : tache
      ));
      onUpdateTaches(idTache, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className='mb-5'>
      <div className='d-flex align-items-center mt-2'>
        <h4 className='ms-2 text-dark'>Mes Tâches</h4>
        <hr className='flex-grow-1 ms-2' />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Nom de la Tâche</th>
            <th>Date de Début</th>
            <th>Date de Fin</th>
            <th>Priorité</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {taches.map((tache, index) => (
            <tr key={index}>
              <td>
                <div className='d-flex align-items-center justify-content-center'>
                  {tache.statutTache !== 'Terminé' ? (
                    <RadioButtonUncheckedIcon
                      className={`actionIcon ${tache.statutTache === 'En attente' ? 'disabledIcon' : ''}`}
                      onClick={() => handleStatusChange(tache.idTache, tache.statutTache)}
                      style={{ pointerEvents: tache.statutTache === 'En attente' ? 'none' : 'auto' }}
                    />
                  ) : (
                    <CheckCircleOutlineIcon
                      className={`actionIcon ${tache.statutTache === 'En attente' ? 'disabledIcon' : ''}`}
                      onClick={() => handleStatusChange(tache.idTache, tache.statutTache)}
                      style={{ pointerEvents: tache.statutTache === 'En attente' ? 'none' : 'auto' }}
                    />
                  )}
                </div>
              </td>
              <td className={`col-5 ${tache.statutTache === 'Terminé' ? 'taskCompleted' : ''}`}>
                {tache.nomTache}: {tache.descTache}
              </td>
              <td>{new Date(tache.dateDebut).toLocaleDateString()}</td>
              <td>{new Date(tache.dateFin).toLocaleDateString()}</td>
              <td>
                <FlagIcon
                  style={{
                    color:
                      tache.priorite === 'Eleve'
                        ? 'red'
                        : tache.priorite === 'Moyenne'
                        ? 'orange'
                        : 'green',
                  }} 
                />
                {tache.priorite}
              </td>
              <td>{tache.statutTache}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
