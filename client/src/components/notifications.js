import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getNotificatoin, deletNotification } from '../fetchRequests/user/notification';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import '../cssStyle/notif.css';


const Notification = ({ setUnreadNotificationsCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [deletingNotifications, setDeletingNotifications] = useState(false);
  const navigate = useNavigate();

  const fetchNotification = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await getNotificatoin(token);
      const sortedNotifications = response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching Notifications:', error);
    }
  };
useEffect(() => {
  
// Fetch notifications initially
    fetchNotification();
    setUnreadNotificationsCount(0);
}, []);


  useEffect(() => {
    // Show alert if there are more than 20 notifications
    setShowAlert(notifications.length > 20);
  }, [notifications]);

  const navigateToProject = (projectUrl) => {
    navigate(`/gestionProjet/${projectUrl}`);
  };

  const handleCardClick = (notification) => {
    if (
      !notification.titreNotif.includes('Projet supprimé') &&
      !notification.titreNotif.includes('Quitter un projet')&&
      !notification.titreNotif.includes('Supprimer de projet')
    ) {
      navigateToProject(notification.Projet.URL);
    }
  };

  const handleDeleteOldNotifications = async () => {
    const token = localStorage.getItem('Token');
    const last1=notifications.length-1
    const oldNotifications = notifications.slice(last1); // Get the oldest 20 notifications

    try {
      setDeletingNotifications(true);
      // Add swipe-out class to old notifications
      oldNotifications.forEach((notif, index) => {
        setTimeout(() => {
          document.getElementById(`notif-${notif.idNotif}`).classList.add('swipe-out');
        }, index * 50); // Add delay for staggered effect
      });

      // Wait for animation to complete
      setTimeout(async () => {
        // Delete each old notification
        for (const notif of oldNotifications) {
          await deletNotification(token, notif.idNotif);
        }
        // Fetch updated notifications list
        fetchNotification();
        setDeletingNotifications(false);
      }, oldNotifications.length * 50 + 300); // Wait for all animations to complete
    } catch (error) {
      console.error('Error deleting notifications:', error);
      setDeletingNotifications(false);
    }
  };

  return (

    
    <div className='div1'>
         <>
      {showAlert && (
          <Alert variant='warning' className='alert' onClose={() => setShowAlert(false)} dismissible>
            Vous avez plus de 20 notifications. Veuillez nettoyer pour afficher de nouvelles notifications.
          </Alert>
        )}
      <Container className=' mb-1 notif-container'> 
        <div className='notif-header d-flex align-items-center justify-content-between mb-3'>
          <h3>Notifications</h3>
          <DeleteSweepIcon
            className='cleanIcon'
            sx={{ fontSize: '40px' }}
            onClick={handleDeleteOldNotifications}
        
          />
        </div>
        <div className='notif-list'>
          {notifications.map((notification, index) => (
            <Card
              key={index}
              id={`notif-${notification.idNotif}`}
              className="mb-2 shadow-sm notif-row"
              onClick={() => handleCardClick(notification)}
            >
              <Card.Body>
                <Row>
                  <Col>
                    <div className='d-flex justify-content-between align-items-center'>
                      <Card.Title className="mb-1 ">{notification.titreNotif}</Card.Title>
                      <small className="text-muted">{new Date(notification.createdAt).toLocaleString()}</small>
                    </div>
                    <Card.Text className="notif-txt">{notification.contenuNotif}</Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
      </>
    </div>
  );
};

export default Notification;
