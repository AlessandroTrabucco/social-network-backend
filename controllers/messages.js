const { validationResult } = require('express-validator');

const io = require('../socket');
const User = require('../models/user');
const Message = require('../models/message');

exports.postMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    return next(error);
  }
  const message = req.body.message;
  const userId1 = req.body.userId1;
  const userId2 = req.body.userId2;

  try {
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const newMessage = new Message({
      message: message,
      userId1: userId1,
      userId2: userId2,
    });

    await newMessage.save();

    const socket = io.getSocket(userId2);

    console.log(socket);

    if (socket) socket.emit('message', newMessage);

    res.status(201).json({
      message: 'Message sended successfully!',
      message: newMessage,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  const userId1 = req.query.userId1;
  const userId2 = req.query.userId2;

  try {
    const messages = await Message.find({
      $or: [
        { userId1: userId1, userId2: userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    }).sort({ createdAt: 1 });
    return res.status(200).json({ messages });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
