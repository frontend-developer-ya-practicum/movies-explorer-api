require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/limiter');

const { DB_URI } = require('./constants/db');
const { DEFAULT_PORT } = require('./constants/conn');

mongoose.set('strictQuery', false);
mongoose.connect(DB_URI, { useNewUrlParser: true });

const { PORT = DEFAULT_PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors);

app.use(requestLogger);

app.use(helmet());
app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(require('./middlewares/error-handling'));

app.listen(PORT);
