import React, { useState, useEffect } from 'react';
import { uploadFile, getFiles, getAllFiles } from '../../fetchRequests/projet/gestion/fichiers';
import SearchFileForm from './searchFileForm';
import { Button, Col, Container, Row, Card, Alert } from 'react-bootstrap';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileText, faFilePowerpoint, faFileImage, faFileVideo, faFileWord, faFileArchive, faCircleArrowUp, faFileCode } from "@fortawesome/free-solid-svg-icons";
import pdfFile from '../../icons/pdf.png';
import DetailFile from './detailFile';

export default function Documents({ projectId ,role }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [fileTypes] = useState(['pdf', 'txt', 'doc', 'ppt', 'images', 'videos', 'zip', 'code', 'autre']);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    handleUpload(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    if (!file) {
      setMessage('No file selected');
      return;
    }

    try {
      const token = localStorage.getItem('Token');
      setMessage('Uploading...');
      await uploadFile(token, projectId, file);
      setMessage('File uploaded successfully');
      setFile(null);
      fetchAllFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file');
    }
  };

  const fetchAllFiles = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await getAllFiles(token, projectId);
      setFiles(response);
      setFilteredResults(response);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);

  useEffect(() => {
    if (searchResults.length === 0) {
      fetchAllFiles();
    } else {
      setFilteredResults(searchResults);
    }
  }, [searchResults]);

  const handleUpdate = () => {
    fetchAllFiles();
  };

  const renderFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <img src={pdfFile} alt="PDF" style={{ width: '72px' }} />;
      case 'txt':
        return <FontAwesomeIcon icon={faFileText} className="icon" />;
      case 'doc':
      case 'docx':
        return <FontAwesomeIcon icon={faFileWord} className="icon" />;
      case 'ppt':
      case 'pptx':
        return <FontAwesomeIcon icon={faFilePowerpoint} className="icon" />;
      case 'images':
        return <FontAwesomeIcon icon={faFileImage} className="icon" />;
      case 'videos':
        return <FontAwesomeIcon icon={faFileVideo} className="icon" />;
      case 'zip':
        return <FontAwesomeIcon icon={faFileArchive} className="icon" />;
      case 'code':
        return <FontAwesomeIcon icon={faFileCode} className="icon" />;
      default:
        return <FontAwesomeIcon icon={faFile} className="icon" />;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    handleUpload(droppedFile);
    setIsDragOver(false);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setFilteredResults(results);
  };

  const handleSearchChange = (e) => {
    if (e.target.value === '') {
      setSearchResults([]);
    }
  };

  const fetchFilesByType = (type) => {
    const source = searchResults.length > 0 ? searchResults : files;
    const filtered = source.filter(file => file.Type === type);
    setFilteredResults(filtered);
  };

  const showAllFiles = () => {
    setFilteredResults(searchResults.length > 0 ? searchResults : files);
  };

  const handleCardClick = (cloudinaryUrl) => {
    window.open(cloudinaryUrl, '_blank'); 
  }

  return (
    <Container fluid>
      <div className="header">
        <h4 className="ms-2 text-dark">Fichiers partagés</h4>
        <hr className="flex-grow-1 ms-2" />
      </div>
      <Row className="d-flex align-items-center justify-content-center mb-3">
        <Col lg={5}>
          <SearchFileForm projectId={projectId} onSearchResults={handleSearchResults} onSearchChange={handleSearchChange} />
        </Col>
      </Row>
      <Row className="d-flex align-items-center justify-content-center mb-3">
        <Col lg={1} xs={4} className="d-flex justify-content-center">
          <Button className="typeBtn mb-2 me-2" onClick={showAllFiles}>Tous</Button>
        </Col>
        {fileTypes.map((type, index) => (
          <Col key={index} lg={1} xs={4} className="d-flex justify-content-center">
            <Button className="typeBtn mb-2 me-2" onClick={() => fetchFilesByType(type)}>{type}</Button>
          </Col>
        ))}
      </Row>
      {searchResults.length === 1 && searchResults[0].message ? (
        <Row className="d-flex align-items-center justify-content-center mb-3">
          <Col>
            <h5 className='text-center'>
              {searchResults[0].message}
            </h5>
          </Col>
        </Row>
      ) : (
        <Row className="d-flex align-items-center justify-content-start mt-3">
          <Col lg={2} className="mb-3">
            <Card
              className={`upload-card ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="d-none"
                id="fileUpload"
                onChange={handleFileChange}
              />
              <label htmlFor="fileUpload" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                <FontAwesomeIcon icon={faCircleArrowUp} className="icon mb-2" /> <h6>Upload</h6>
              </label>

              {file && (
                <div className="upload-status">
                  <p>{message}</p>
                </div>
              )}
            </Card>
          </Col>
          {filteredResults.map((file, index) => (
            <Col key={index} lg={2} className="mb-3">
              <Card className="file-card p-3" >
                <div className="icon" onClick={() => handleCardClick(file.url)}>{renderFileIcon(file.Type)}</div>
                <div className="file-name">{file.nomFichier}</div>
               <DetailFile file={file} role={role} onUpdate={handleUpdate}/>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
