const express = require('express');
const app = express();
const port = 5000;
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
    origin: '*',
  }
});

// Exposer io pour qu'il soit accessible dans d'autres parties de l'application
module.exports.io = io;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
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
  origin: ['http://localhost:3000', 'http://localhost:5000','ws://localhost:5000'], 
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
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Import des routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const assignerRoutes = require('./routes/assignerRoutes');
const demandeAdhesionRoutes = require('./routes/demandeAdhesionRoutes');
const dossierRoutes = require('./routes/dossierRoutes');
const fichierRoutes = require('./routes/fichierRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const participerRoutes = require('./routes/ParticiperRoutes');
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
    console.log(`Server is listening at port :${port}`);
});
