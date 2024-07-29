import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { searchFile } from '../../fetchRequests/projet/gestion/fichiers';

export default function SearchFileForm({ projectId, onSearchResults ,onSearchChange  }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
   
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query); 

    if (query.length === 0) {
      onSearchChange(e); 
      onSearchResults([]); 
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('Token');
      if (searchTerm.trim() !== '') {
        const results = await searchFile(token, projectId, searchTerm);
        if (results.length > 0) {
          onSearchResults(results);
         
          setErrorMessage('');
        } else {
          onSearchResults([{ message: 'Aucun résultat trouvé.' }]);
       
          setErrorMessage('');
        }
      } else {
        onSearchResults([]);
  
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error searching files:', error);
      setErrorMessage('Failed to fetch search results');
      onSearchResults([]);
      
    }
  };

  return (
    <div>
      <Form onSubmit={handleSearch}>
        <div className='d-flex justify-content-center align-items-center searchForm searchUser mt-0'>
          <Form.Control
            type="search"
            placeholder="Rechercher un fichier"
            className="searchInput"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <Button
            type='submit'
            variant="btn btn-no-hover"
            className="searchBtn me-auto  "
          >
            Recherche
          </Button>
        </div>
      </Form>
      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}
