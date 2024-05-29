const logger = require('../utils/logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');

const requestLogger = (req, res, next) => {
  logger.info('Method', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const unknownEndPoints = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error collection')
  ) {
    return res
      .status(409)
      .send({ error: 'username already exists and should be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token missing or invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  }

  next(error);
};

const tokeExtractor = (req, res, next) => {
  const getToken = () => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }

    return null;
  };
  req.token = getToken();
  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }
  const user = await User.findById(decodedToken.id);
  req.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndPoints,
  errorHandler,
  tokeExtractor,
  userExtractor,
};
