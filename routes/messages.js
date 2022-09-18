const express = require('express');

const { body } = require('express-validator');

const messagesController = require('../controllers/messages');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post(
  '/message',
  isAuth,
  body('message').isString(),
  messagesController.postMessage
);

router.get('/', isAuth, messagesController.getMessages);

module.exports = router;
