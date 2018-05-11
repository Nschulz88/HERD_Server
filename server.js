require('dotenv').config();

const {createServer} = require('http');
const express = require('express');
const corsPrefetch = require('cors-prefetch-middleware');
console.log(corsPrefetch)
const imagesUpload = require('images-upload-middleware');
const compression = require('compression');
// const morgan = require('morgan');
const path = require('path');

const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);
const ENV = process.env.ENV || "development";
const app = express();
const dev = app.get('env') !== 'production';

const bodyParser  = require("body-parser");
app.use('/static', express.static('./static'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({}));
app.use(corsPrefetch.default);

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

app.use(knexLogger(knex));
app.use(express.static(path.join(__dirname, '/build')));

// app.get('/volunteers/:id')

app.get('/api/events/:id', (req, res) => {
  console.log(req.params.id);
  knex('events')
    .select('*')
    .where({
      id : req.params.id
    })
    .then(event =>{
      res.json(event)
    })
})

app.post('/api/events/:id', (req, res) =>{
  const id = req.params.id;
  const vol = req.session.user_id;
  knex('vol_events')
    .insert({
      vol_id    : vol,
      event_id  : id
    })
    .then(join =>{
      res.json(join)
    })
})

app.get('/api/organizers', (req, res) => {
  console.log("organizers");
  knex('organizers')
    .select('*')
    .then(organizers => {
      res.json(organizers);
    });
});

// If logged in, shows name, error handling for name or organizer for email registered
app.post('/api/register/organizers', (req, res) => {
  console.log("posted to organizers!")
  console.log(req.body)
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
          .returning('id')
          .insert({
            organization_name     :req.body.organization,
            organizer_name        :req.body.full_name,
            organizer_email       :req.body.username,
            organizer_password    :bcrypt.hashSync(req.body.unhashed_pass, 10),
          }).then(id => {
            req.session.user_id = id[0];
            req.session.vol_org = 'organizer';
            console.log('login as organizer should set cookie');
            console.log(req.session);
            res.json(id);
          }).catch(err =>{
            console.error
          })
        }
    })
})

app.get('/api/volunteers/:id', (req, res) => {
  console.log("volunteer id endpoint hit");
  console.log(req.params);
  knex('volunteers')
    .select('*')
    .where({
      id: 2
    })
    .then(volunteers => {
      console.log(volunteers);
      res.json(volunteers);
    });
})

app.get('/api/volunteers', (req, res) => {
  console.log("volunteers");
  knex('volunteers')
    .select('*')
    .then(volunteers => {
      res.json(volunteers);
    });
});

app.post('/api/register/volunteers', (req, res) => {
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
          .returning('id')
          .insert({
            vol_name        :req.body.full_name,
            vol_email       :req.body.username,
            vol_password    :bcrypt.hashSync(req.body.unhashed_pass, 10),
          })
          .then(id => {
            console.log(typeof id[0]);
            req.session.user_id = id[0];
            req.session.vol_org = 'volunteer';
            console.log('login as vol should set cookie');
            console.log(req.session);
            res.json(id);
          })
          .catch(err =>{
            throw err;
          })
      }
    })
    .catch(err =>{
      throw err;
    })
})

app.post('/api/login', (req, res) => {
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
            delete volunteer[0].vol_password;
            volunteer[0].vol_org = 'volunteer';
            res.json({user: volunteer[0]});
          } else {
            res.status(401).json({});
          }
        });
      })
      .catch(err =>{
        console.error
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
            console.log("ORGANIZER PASSWORDS MATCHED!")
            console.log(organizer)
            req.session.user_id = organizer[0].id;
            req.session.vol_org = 'organizer';
            delete organizer[0].organizer_password;
            organizer[0].vol_org = 'organizer';
            res.json({user: organizer[0]});
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

app.post('/api/logout', (req, res) => {
  console.log("getting to server endpoint")
  req.session = null;
  return res.status(200).json({});
});


app.post('/api/events', (req, res) => {
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
      duration            :req.body.duration,
      organizer_id        :req.session.user_id
    }).then(organizers => {
      res.json(organizers)
    }).catch(err =>{
      throw err
    })
})

app.get('/api/events', (req, res) => {
  console.log("events");
  console.log(req.session)
  let today = new Date()
  knex('events')
    .select('*')
    .where('event_date', '>=', today)
    .then(allEvents => {
      res.json(allEvents)
    })
});

app.get('/api/events/:id', (req, res) => {
  console.log(req.params.id)
  knex('events')
    .select('*')
    .where({
      id : req.params.id
    }).then(event =>{
      res.json(event)
    })
})

app.post('/notmultiple', imagesUpload.default(
    './static/files',
    'http://localhost:3001/static/files'
));

app.get('*', (req, res) => {
  res.sendFile('index.html', { root : __dirname+'/build'});
});

app.listen(3001);
const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;

  console.log('Server started, yeyyy!');
})
