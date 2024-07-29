import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

export default function SearchForm({
  titre,
  onSearch,
  initialValue = "",
  role,
}) {
  const [SearchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(SearchTerm);
    } else {
      navigate(`/ProjetsPublics?search=${encodeURIComponent(SearchTerm)}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center searchForm">
      <Form>
        <Form.Control
          type="search"
          placeholder={titre}
          className="searchInput"
          aria-label="Recherche"
          value={SearchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <Button
      
        variant="btn btn-no-hover"
        className="searchBtn  me-auto"
        onClick={handleSearch}
        disabled={role === "admin" ? true:false}
      >
        Recherche
      </Button>
    </div>
  );
}
