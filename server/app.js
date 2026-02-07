const express = require('express');
require('dotenv').config();
const logger = require('./utils/logger');
const app = express();
const port = process.env.PORT || 5000;
const helmet = require('helmet');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Exposer io pour qu'il soit accessible dans d'autres parties de l'application
module.exports.io = io;

io.on('connection', (socket) => {
  logger.info('Socket.io: User connected', { socketId: socket.id });

  socket.on('disconnect', () => {
    logger.info('Socket.io: User disconnected', { socketId: socket.id });
  });

  socket.on('chat message', (msg) => {
    logger.debug('Socket.io: Message received', { message: msg });
    io.emit('chat message', msg); // Broadcast message to all clients
  });
 
});




// Charger les informations de configuration Cloudinary depuis le fichier JSON
const cloudinaryConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'cloudinary_config.json')));
cloudinary.config(cloudinaryConfig);


// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:5000','ws://localhost:5000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));

// Vérifier si le répertoire d'uploads existe, sinon le créer
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique pour éviter les collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

// Import des routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const assignerRoutes = require('./routes/assignerRoutes');
const demandeAdhesionRoutes = require('./routes/demandeAdhesionRoutes');
const dossierRoutes = require('./routes/dossierRoutes');
const fichierRoutes = require('./routes/fichierRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const participerRoutes = require('./routes/participerRoutes');
const projetRoutes = require('./routes/projetRoutes');
const signalRoutes = require('./routes/signalRoutes');
const tacheRoutes = require('./routes/tacheRoutes');
const filesRoutes = require('./routes/fichiersRoutes')
// middleWare Important/////
const getRole = require('./middlewares/adminORuser');
app.get('/getRole', getRole);
// Utilisation des routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/assigner', assignerRoutes);
app.use('/demande-adhesion', demandeAdhesionRoutes);
app.use('/files',filesRoutes)
app.use('/dossier', dossierRoutes);
app.use('/fichier', fichierRoutes);
app.use('/message', messageRoutes);
app.use('/participer', participerRoutes);
app.use('/projet', projetRoutes);
app.use('/notifications', notificationRoutes);
app.use('/signal', signalRoutes);
app.use('/tache', tacheRoutes);
app.use('/uploads', express.static(uploadDirectory));
app.use('/uploadsIMG', express.static(path.join(__dirname, 'uploadsIMG')));




// Écoute du serveur sur le port défini
server.listen(port, () => {
    logger.info(`Server is listening at port :${port}`);
});
