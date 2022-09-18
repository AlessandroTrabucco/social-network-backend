const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authheader = req.get('Authorization');

  if (!authheader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  const token = authheader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    console.log('errore');
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
