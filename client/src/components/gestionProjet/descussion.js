import React, { useEffect, useState, useRef } from 'react';
import { Popover, Box, List, ListItem, ListItemText,Badge } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { getMessages, getUserProjectMsg, createMessage } from '../../fetchRequests/projet/mesages';
import chatIcon from '../../icons/projectNav/chat.png';
import '../../cssStyle/gestionProjet.css';
import FormControl from 'react-bootstrap/FormControl';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Discussion({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const listRef = useRef(null); // Reference for the message list
  const [unreadSocketMessages, setUnreadSocketMessages] = useState(0); 

     const [projetId, setProjetId] = useState(projectId);

  // Function to fetch all messages
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await getMessages(token, projetId);
      setMessages(response);
    } catch (error) {
      console.error('Error fetching Messages:', error);
    }
  };

  // Function to fetch user-specific messages
  const fetchUserMessages = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await getUserProjectMsg(token, projetId);
      setUserMessages(response);
    } catch (error) {
      console.error('Error fetching User Messages:', error);
    }
  };
  const handleSocketMessage = () => {
    
      setUnreadSocketMessages(prevCount => prevCount + 1);
    
    
  };
  // Function to handle message submission
  const handleMessageSubmit = async () => {
    try {
      const token = localStorage.getItem('Token');
      await createMessage(token, projetId, inputMessage);
      setInputMessage(''); // Clear input after sending message
      fetchMessages();
fetchUserMessages();
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };
 useEffect(() => {
    if (projectId) {
      setProjetId(projectId); // Update projetId state
    }
  }, [projectId]);
  // Effect to fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    fetchUserMessages();
  }, []);
   // Effect to fetch messages on component mount and when projectId changes
 
  // Effect to scroll to bottom of the list when popover opens or messages update
  useEffect(() => {
    if (listRef.current && anchorEl) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [anchorEl, messages, userMessages]);

  // Function to open popover on chat icon click
  const handleClick = (event) => {
    fetchMessages();
    fetchUserMessages();
    setAnchorEl(event.currentTarget);
    setUnreadSocketMessages(0);
  };

  // Function to close popover
  const handleClose = () => {
    setAnchorEl(null);
    setUnreadSocketMessages(0);

  };

  // Boolean to check if popover is open
  const open = Boolean(anchorEl);

  // Combine and filter messages to avoid duplicates
  const combinedMessages = [
    ...messages.filter(message => !userMessages.some(userMessage => userMessage.idMsg === message.idMsg)),
    ...userMessages
  ].sort((a, b) => new Date(a.dateEnvoi) - new Date(b.dateEnvoi));

// Function to send message via WebSocket
const sendMessage = () => {
  socket.emit('chat message', inputMessage);
};

// Listen for incoming messages via WebSocket
useEffect(() => {
  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
    // Update state or fetch messages again to update chat interface
    fetchMessages();
    fetchUserMessages();
  });
 
    socket.on('chat message', handleSocketMessage);
  
  
  return () => {
    socket.off('chat message');
  };
}, []);



  return (
    <div>
      <div className='chatDiv'>
      { !anchorEl && <Badge badgeContent={unreadSocketMessages}  className='chatBdg' color="primary" overlap="circular"/>}
      <img src={chatIcon} className="iconDiscussion" onClick={handleClick} />
      </div>
    
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        className="discussionPopover"
      >
        <Box p={2} style={{ width: '400px' }}>
          <List ref={listRef} sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {/* Render combined messages */}
            {combinedMessages.map((message) => (
              <ListItem
                key={message.idMsg}
                sx={{ display: 'flex', width: '70%' }}
                className={userMessages.some(msg => msg.idMsg === message.idMsg) ? 'myMsg ms-auto' : 'otherMsg'}
              >
                {!userMessages.some(msg => msg.idMsg === message.idMsg) && (
                  <img
                    src={"http://localhost:5000/uploadsIMG/" + message.User.image}
                    alt="Profile"
                    height={'30px'}
                    width={'30px'}
                    crossOrigin="anonymous"
                  />
                )}
                <ListItemText
                  primary={
                    userMessages.some(msg => msg.idMsg === message.idMsg) ? (
                      message.contenuMsg
                    ) : (
                      <>
                        <span className='membre'>{message.User.nomUtilisateur}</span>
                        <br />
                        {message.contenuMsg}
                      </>
                    )
                  }
                  className='ms-2'
                />
              </ListItem>
            ))}
          </List>
          <Box mt={2}>
            <div className='d-flex align-items-center justify-content-center'>
              <FormControl
                placeholder="Ecrire un message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className='textFiled'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); 
                    handleMessageSubmit();  sendMessage();
                  }
                }}
              />
               <SendIcon className='ms-2 actionIcon' onClick={() => { handleMessageSubmit(); sendMessage(); }} />
            </div>
          </Box>
        </Box>
      </Popover>
    </div>
  );
}
