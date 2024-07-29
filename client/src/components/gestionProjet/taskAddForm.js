import React, { useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { createTask } from '../../fetchRequests/projet/gestion/tache';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export default function TaskForm({ membres, idProjet, onTaskAdded }) {
  const [newTask, setNewTask] = useState({
    nomTache: '',
    dateDebut: '',
    dateFin: '',
    priorite: '',
    idUtilisateur: '',
  });

  const [selectedMembre, setSelectedMembre] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem('Token');
      const createdTask = await createTask(token, idProjet, newTask);
      onTaskAdded(createdTask);
      // Reset task form
      setNewTask({
        nomTache: '',
        dateDebut: '',
        dateFin: '',
        priorite: '',
        idUtilisateur: '',
      });
      setSelectedMembre('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleSelectMembre = (idUtilisateur, nomUtilisateur) => {
    setNewTask({ ...newTask, idUtilisateur });
    setSelectedMembre(nomUtilisateur);
  };

  return (
    <tr>
      <td>
        <Form.Control
          type="text"
          name="nomTache"
          placeholder="Nom de la tâche"
          value={newTask.nomTache}
          onChange={handleInputChange}
        />
      </td>
      <td className="col-2 position-relative">
        <Dropdown onSelect={(eventKey, event) => handleSelectMembre(eventKey, event.target.textContent)}>
          <Dropdown.Toggle
            className="dropDownBtn no-caret pt-3"
          >
            {selectedMembre ? <span className='selected-member me-1'>{selectedMembre }</span>: <></>} <PersonAddAlt1Icon />
          </Dropdown.Toggle>
          <Dropdown.Menu className='dropdown-menu-left'>
            {membres.map((membre) => (
              <Dropdown.Item key={membre.idUtilisateur} eventKey={membre.idUtilisateur}>
                {membre.nomUtilisateur}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </td>
      <td>
        <Form.Control
          type="date"
          name="dateDebut"
          value={newTask.dateDebut}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type="date"
          name="dateFin"
          value={newTask.dateFin}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          as="select"
          name="priorite"
          value={newTask.priorite}
          onChange={handleInputChange}
        >
          <option value="">Priorité</option>
          <option value="Eleve">Élevée</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Basse">Basse</option>
        </Form.Control>
      </td>
      <td className='d-flex justify-content-center'>
        <Button className='addBtn' onClick={handleAddTask}>+ Ajouter</Button>
      </td>
    </tr>
  );
}
