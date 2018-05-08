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
const dev = app.get('env') !== 'production';

const bodyParser  = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({}));

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['yaherd'],
}))

// Log knex SQL queries to STDOUT as well

// app.use(morgan);

app.use(express.static('public'));
app.use(knexLogger(knex));

app.get('/events/:id', (req, res) => {
  console.log(req.params.id)
  knex('events')
    .select('*')
    .where({
      id : req.params.id
    }).then(event =>{
      res.json(event)
    })
})

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
  console.log(req.body.user_id)
  knex('organizers')
    .select('*')
    .where({
      organizer_email: req.body.username
    })
    .then(match => {
      if (match.length >= 1){
        console.log('email already entered');
      } else {
        knex('organizers')
          .insert({
            organization_name     :req.body.organization,
            organizer_name        :req.body.full_name,
            organizer_email       :req.body.username,
            organizer_password    :bcrypt.hashSync(req.body.unhashed_pass, 10),
          }).then(organizers => {
            res.json(organizers)
          }).catch(err =>{
            throw err
          })
      }
    })
    .catch(err =>{
      throw err
    })
})

app.get('/volunteers', (req, res) => {
  console.log("volunteers");
  knex('volunteers')
    .select('*')
    .then(volunteers => {
      res.json(volunteers);
    });
});

app.post('/volunteers', (req, res) => {
  console.log("posted to volunteers!");
  console.log(req.body);
  knex('volunteers')
    .select('*')
    .where({
      vol_email: req.body.username
    })
    .then(match => {
      if (match.length >= 1){
        console.log('email already entered')
      } else {
        knex('volunteers')
          .insert({
            vol_name        :req.body.full_name,
            vol_email       :req.body.username,
            vol_password    :bcrypt.hashSync(req.body.unhashed_pass, 10),
          }).then(volunteers => {
            res.json(volunteers);
          }).catch(err =>{
            throw err;
          })
      }
    })
    .catch(err =>{
      throw err;
    })
})

app.post('/login', (req, res) => {
  console.log(req.body);
  if (req.body.vol_org === 'vol'){
    knex('volunteers')
      .select('*')
      .where({
        vol_email     : req.body.username
      })
      .then(volunteer => {
        bcrypt.compare(req.body.password, volunteer[0].vol_password, function(err, result) {
          if(result === true){
            req.session.user_id = volunteer[0].id;
            req.session.vol_org = 'volunteer';
            res.json({});
          } else {
            res.status(401).json({});
          }
        });
      })
      .catch(err =>{
        throw err
      })
  } else {
    knex('organizers')
      .select('*')
      .where({
        organizer_email     : req.body.username
      })
      .then(organizer => {
        bcrypt.compare(req.body.password, organizer[0].organizer_password, function(err, result) {
          if(result === true){
            console.log(organizer)
            req.session.user_id = organizer[0].id;
            req.session.vol_org = 'organizer';
            res.json({});
          } else {
            res.status(401).json({});
          }
        })
      })
      .catch(err =>{
        throw err
      })
  }
})

app.post('/events', (req, res) => {
  console.log("posted to events!")
  console.log(req.body)
  knex('events')
    .insert({
      location            :req.body.location,
      GMaps_API_location  :req.body.GMaps_API_location,
      event_size          :req.body.event_size,
      event_description   :req.body.event_description,
      criteria            :req.body.criteria,
      event_date          :req.body.event_date,
      event_time          :req.body.event_time,
      duration            :req.body.duration
    }).then(organizers => {
      res.json(organizers)
    }).catch(err =>{
      throw err
    })
})

app.get('/events', (req, res) => {
  console.log("events");
  console.log(req.session)
  knex('events')
    .select('*')
    .then(allEvents => {
      res.json(allEvents)
    })
});

app.listen(3001);

const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;

  console.log('Server started, yeyyy!');
})
