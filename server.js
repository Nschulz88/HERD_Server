require('dotenv').config();

const {createServer} = require('http');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const corsPrefetch = require('cors-prefetch-middleware');
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

const AWS = require('aws-sdk');
var s3 = new AWS.S3();
AWS.config.loadFromPath('./config.json');

var myBucket = 'profilepics-herd';
var myKey = 'static/image';

const upload = multer({
  storage: multer.memoryStorage(),
});

console.log(upload);

app.post('/api/upload', upload.single('profilepic'), (req, res) => {
  console.log("EYYYYYY");

  req.pause();

  console.log(req.file);

  var params = {
    Bucket: myBucket,
    Key : myKey,
    ACL: 'public-read',
    Body: req.file.buffer,
  };

  s3.upload(params, function (err, data) {
    //handle error
    if (err) {
      console.log("Error", err);
    }
    //success
    else{
      console.log('File uploaded to s3');
    }
  })
});


// app.post('/notmultiple', imagesUpload.default(
//     './static/files',
//     'https://s3.console.aws.amazon.com/s3/buckets/profilepics-herd'
// ));

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
  console.log(req.session.user_id)
  knex('events')
    .select('*')
    .where({
      event_id : req.params.id
    })
    .join('vol_events', 'events.id', 'vol_events.event_id')
    .then(event =>{
      console.log(event)
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
      email: req.body.email
    })
    .then(match => {
      if (match.length >= 1){
        console.log('email already entered'); // in this case we need to send info back to front end to show falash message!!!
      } else {
        knex('organizers')
          .returning('*')
          .insert({
            organization_name     :req.body.organization,
            name        :req.body.full_name,
            email       :req.body.email,
            password    :bcrypt.hashSync(req.body.unhashed_pass, 10),
          }).then(response => {
            console.log("RESPONSEEEEEEE", response)
            req.session.user_id = response[0].id;
            req.session.vol_org = 'organizer';
            console.log('registration of organizer, send back data to front', );
            console.log(req.session);
            res.json({user: response[0]});  // this is not sending to FRONT!!!!
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
      email: req.body.email
    })
    .then(match => {
      if (match.length >= 1){
        console.log('email already entered')
      } else {
        knex('volunteers')
          .returning('id')
          .insert({
            name        :req.body.full_name,
            email       :req.body.email,
            password    :bcrypt.hashSync(req.body.unhashed_pass, 10),
          })
          .then(id => {
            console.log(typeof id[0]);
            req.session.user_id = id[0];
            req.session.vol_org = 'volunteer';
            console.log('login as vol should set cookie');
            console.log(req.session);
            res.json({user: id[0]});
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
        email     : req.body.email
      })
      .then(volunteer => {
        bcrypt.compare(req.body.password, volunteer[0].password, function(err, result) {
          if(result === true){
            req.session.user_id = volunteer[0].id;
            req.session.vol_org = 'volunteer';
            delete volunteer[0].password;
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
        email     : req.body.email
      })
      .then(organizer => {
        bcrypt.compare(req.body.password, organizer[0].password, function(err, result) {
          if(result === true){
            console.log("ORGANIZER PASSWORDS MATCHED!")
            console.log(organizer)
            req.session.user_id = organizer[0].id;
            req.session.vol_org = 'organizer';
            delete organizer[0].password;
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

app.get('/api/rsvps/:id', (req, res) => {
  console.log('endpoint hit')
  knex('vol_events')
    .select('*')
    .where('event_id', '=', req.params.id)
    .then(response =>{
      res.json(response)
      console.log(response)
    })
})

app.get('/api/events', (req, res) => {
  console.log("events");
  console.log(req.session)
  let today = new Date()
  knex('events')
    .select('*')
    .where('event_date', '>=', today)
    //.fullOuterJoin('vol_events', 'events.id', 'vol_events.event_id')
    .then(organizers => {
      console.log(organizers)
      res.json(organizers)
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

app.get('*', (req, res) => {
  res.sendFile('index.html', { root : __dirname+'/build'});
});

app.listen(3001);
const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;

  console.log('Server started, yeyyy!');
})
