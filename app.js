const path = require('path');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI;

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  }
  cb(null, false);
};

app.use(express.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/messages', messagesRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    const server = app.listen(process.env.PORT);
    const io = require('./socket').init(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.use((socket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
          socket.handshake.query.token,
          process.env.SECRET,
          (err, decoded) => {
            if (err) return next(new Error('Authentication error'));

            socket.decoded = decoded;
            next(err);
          }
        );
      } else {
        next(new Error('Authentication error'));
      }
    }).on('connection', function (socket) {
      require('./socket').addSocket(socket.decoded.userId, socket);
      console.log(
        'Client connected ' +
          require('./socket').getSocket(socket.decoded.userId).id
      );
    });
  })
  .catch(error => {
    console.log(error);
  });
