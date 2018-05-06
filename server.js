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
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

// Log knex SQL queries to STDOUT as well

// app.use(morgan);

app.use(express.static('public'));
app.use(knexLogger(knex));

app.get('/volunteers', (req, res) => {
  console.log("volunteers");
  knex('volunteers')
    .select('*')
    .then(volunteers => {
      res.json(volunteers);
    });
});

app.get('/organizers', (req, res) => {
  console.log("organizers");
  knex('organizers')
    .select('*')
    .then(organizers => {
      res.json(organizers);
    });
});

app.post('/organizers', (req, res) => {
  console.log("posted to organizers!")
})

app.get('/events', (req, res) => {
  console.log("events");
  knex('volunteers')
    .join('vol_events', 'vol_events.vol_id', '=', 'volunteers.id')
    .join('events', 'vol_events.event_id', '=', 'events.id')
    .select('*')
    .then(relevantVolunteers => {
      relevantVolunteers.forEach((e) => {
        console.log(`${e.vol_name} has volunteered to go ${e.event_description}`)
      })
      res.json(relevantVolunteers);
    });
});

app.listen(3001);

const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;

  console.log('Server started, yeyyy!');
})
