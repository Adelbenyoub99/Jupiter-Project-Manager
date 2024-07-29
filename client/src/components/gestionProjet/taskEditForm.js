import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { updateTask } from '../../fetchRequests/projet/gestion/tache';

export default function TaskEdit({ membres, idProjet, tache, onTaskUpdated }) {
  const [updatedTask, setUpdatedTask] = useState({
    idTache: tache.idTache,
    nomTache: tache.nomTache,
    descTache: tache.descTache,
    dateDebut: tache.dateDebut,
    dateFin: tache.dateFin,
    priorite: tache.priorite,
    idUtilisateur: tache.Assigners.length > 0 ? tache.Assigners[0].idUtilisateur : '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({ ...updatedTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Token');
      if (token) {
        const task = await updateTask(token, idProjet, tache.idTache,updatedTask);
        onTaskUpdated(task);
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="nomTache">
        <Form.Label>Nom de la Tâche</Form.Label>
        <Form.Control
          type="text"
          name="nomTache"
          value={updatedTask.nomTache}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="descTache">
        <Form.Label>Description de la Tâche</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descTache"
          value={updatedTask.descTache}
          onChange={handleInputChange}
        />
      </Form.Group>
      <div className="row">
  <div className="col-md-6">
    <Form.Group controlId="dateDebut">
      <Form.Label>Date de Début</Form.Label>
      <Form.Control
        type="date"
        name="dateDebut"
        value={updatedTask.dateDebut}
        onChange={handleInputChange}
      />
    </Form.Group>
  </div>
  <div className="col-md-6">
    <Form.Group controlId="dateFin">
      <Form.Label>Date de Fin</Form.Label>
      <Form.Control
        type="date"
        name="dateFin"
        value={updatedTask.dateFin}
        onChange={handleInputChange}
      />
    </Form.Group>
  </div>
</div>

      <Form.Group controlId="priorite">
        <Form.Label>Priorité</Form.Label>
        <Form.Control
          as="select"
          name="priorite"
          value={updatedTask.priorite}
          onChange={handleInputChange}
        >
          <option value="Eleve">Élevée</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Basse">Basse</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="idUtilisateur">
        <Form.Label>Assigné à</Form.Label>
        <Form.Control
          as="select"
          name="idUtilisateur"
          value={updatedTask.idUtilisateur}
          onChange={handleInputChange}
        >
          {membres.map((membre) => (
            <option key={membre.idUtilisateur} value={membre.idUtilisateur}>
              {membre.nomUtilisateur}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <div className='d-flex align-items-center justify-content-center'>
        <Button className='updateBtn' type="submit">
        Mettre à jour
      </Button>
      </div>
      
    </Form>
  );
}
