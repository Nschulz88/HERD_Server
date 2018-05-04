require('dotenv').config();

const {createServer} = require('http');
const express = require('express');
const compression = require('compression');
// const morgan = require('morgan');
const path = require('path');

const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);
const ENV = process.env.ENV || "development";
const app = express();
const dev = app.get('env') !== 'production'
const bodyParser  = require("body-parser");

const knexConfig  = require("./knexfile");
//const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

// Log knex SQL queries to STDOUT as well

// app.use(morgan);

const knex = require('knex')(knexConfig[ENV])({
  client: 'pg',
  connection: {
    database: 'herd'
  }
});
app.use(express.static('public'));
app.get('/volunteers', (req, res) => {
  console.log("lksjfkajfkljdflkjafd");
  knex('volunteers')
    .select('*')
    .then(volunteers => {
      res.json(volunteers);
    });
});

app.use(knexLogger(knex));

app.listen(3001);

const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;

  console.log('Server started, yeyyy!');
})