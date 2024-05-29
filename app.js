require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');
const logger = require('./utils/logger');
const {
  requestLogger,
  unknownEndPoints,
  errorHandler,
  tokeExtractor,
} = require('./utils/middleware');
const blogsRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');

logger.info(`connecting to the database...`);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to the database');
  })
  .catch((error) => {
    logger.error(error.message);
  });

mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(tokeExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use('*', unknownEndPoints);
app.use(requestLogger);
app.use(errorHandler);

module.exports = app;
