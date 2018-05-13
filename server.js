require('dotenv').config();

const {createServer} = require('http');
const express = require('express');
const fs = require('fs');
const http = require('http');
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

const upload = multer({
  storage: multer.memoryStorage(),
});

console.log(upload);

function downloadFile(absoluteUrl) {
 var link = document.createElement('a');
 link.href = absoluteUrl;
 link.download = 'true';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
};



app.post('/api/upload', upload.single('profilepic'), (req, res) => {
  console.log("EYYYYYY");

  console.log(req.file);

  var number = Math.floor(Math.random() * 10000000);
  var str = number.toString();

  "https://s3-us-west-2.amazonaws.com/profilepics-herd/+ "

  var params = {
    Bucket: 'profilepics-herd',
    Key : str,
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

  var params = {
    Bucket: 'profilepics-herd',
    Key: str,
    ACL: 'public-read',
    ContentLanguage: 'STRING_VALUE',
    ContentType: 'STRING_VALUE',
  };
  s3.createMultipartUpload(params, function(err, data) {
    if (err) {console.log(err, err.stack); // an error occurred
    } else {
      console.log(data);
    } // successful response
  });
});


app.use(cookieSession({
  name: 'session',
  keys: ['yaherd'],
}));

// Log knex SQL queries to STDOUT as well

// app.use(morgan);
app.use(knexLogger(knex));
app.use(express.static(path.join(__dirname, '/build')));
// app.get('/volunteers/:id')

app.delete('/api/events/:id/cancel', (req, res) => {
  console.log('delete endpoint hit')
  const event = req.params.id;
  const vol = req.session.user_id;
  console.log('3rd down is vol')
  console.log(req.params)
  console.log(event)
  console.log(vol)
  console.log(typeof vol)
  knex('events')
    .where({
      id        : event
    })
    .then(event => {
      let hours = Number(event[0].duration)
      knex.raw(`UPDATE volunteers SET hours = hours - ${hours} WHERE id = ${vol}`, {
      }).catch(function(err){
        throw err;
      });
    })
  knex('vol_events')
    .select('*')
    .where({
      event_id  : req.params.id,
      vol_id    : req.body.vol_id
    })
    .del()
    .then(response => {
      console.log(response)
      res.json(response)
    })
})


app.get('/api/events/:id', (req, res) => {
  console.log('api/events/:id endpoint hit')
  console.log(req.params.id);
  console.log(req.session.user_id)
  knex('vol_events')
    .where('vol_events.id', req.params.id)
    .then(vol_events_query => {
      console.log('gets here')
      if (vol_events_query.length === 0){
        knex('events')
          .select('*')
          .where('events.id', req.params.id)
          .then(event =>{
            console.log('first condish')
            console.log(event)
            res.json(event)
          })
      } else {
        knex('events')
          .select('*')
          .where('events.id', req.params.id)
          //need to check if anything in vol events for event before completeing join
          .join('vol_events', 'events.id', 'vol_events.event_id')
          .then(event =>{
            console.log('second condish HERE HERE HERE HERE')
            console.log(event)
            res.json(event)
          })
      }
    })
  // knex('events')
  //   .select('*')
  //   .where('events.id', req.params.id)
  //   //need to check if anything in vol events for event before completeing join
  //   .join('vol_events', 'events.id', 'vol_events.event_id')
  //   .then(event =>{
  //     console.log('event below HERE HERE HERE HERE')
  //     console.log(event)
  //     res.json(event)
  //   })
});

app.post('/api/events/:id', (req, res) =>{
  const event = req.params.id;
  const vol = req.session.user_id;
  console.log(event)
  console.log(vol)
  //adds from event to user profile hours on signup
  console.log('got here')
  knex('events')
    .select('*')
    .where('id', '=', event)
    .then(event => {
      let hours = Number(event[0].duration)
      console.log(hours)
      // knex.raw(`UPDATE volunteers SET hours = hours + ${hours} WHERE id = ${vol}`, {
      // }).catch(function(err){
      //   throw err;
      // });
    }).then(notusing => {
      console.log(notusing)
      console.log('vol & event')
      console.log(vol)
      console.log(event)
      knex('vol_events')
        .insert({
          vol_id    : vol,
          event_id  : event
        })
        .then(join =>{
          res.json(join)
        })
    .catch(err =>{
          console.log('this error')
          console.log(err)
        })
        .catch(err =>{
          console.log('this error')
          console.log(err)
        })
    })
});

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
        console.log('email already entered');
        res.status(401).send('E-mail already registered');
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
            res.json({user: response[0]});
          }).catch(error =>{
            console.log("Failure after trying to register new organizer")
          })
        }
    })
});

app.get('/api/volunteers/:id', (req, res) => {
  console.log("volunteer id endpoint hit");
  console.log(req.params);
  knex('volunteers')
    .select('*')
    .where({
      id: req.params.id
    })
    .then(volunteers => {
      console.log(volunteers);
      res.json(volunteers);
    });
});

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
      console.log("THIS IS THE MATCH", match)
      if (match.length >= 1){
        console.log('email already entered');
        res.status(401).send('E-mail already registered');
      } else {
        knex('volunteers')
          .returning('*')
          .insert({
            name        :req.body.full_name,
            email       :req.body.email,
            password    :bcrypt.hashSync(req.body.unhashed_pass, 10),
            hours       :0
          })
          .then(response => {
            req.session.user_id = response[0].id;
            req.session.vol_org = 'volunteer';
            console.log('login as vol should set cookie');
            console.log(req.session);
            res.json({user: response[0]});
          })
          .catch(error =>{
            console.log("Failiure after trying to register new organizer")
          })
        }
    })
});

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
            res.send(401, 'Invalid email or password');
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
            res.send(401, 'Invalid email or password');
          }
        })
      })
      .catch(err =>{
        throw err
      })
  }
});

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
      organizer_id        :req.session.user_id,
      event_type          :req.body.event_type
    }).then(organizers => {
      res.json(organizers)
    }).catch(err =>{
      console.err
    })
});

app.get('/api/rsvps/:id', (req, res) => {
  console.log('endpoint hit')
  console.log(req.params.id)
  knex('vol_events')
    .select('*')
    .where('event_id', '=', req.params.id)
    .then(response =>{
      res.json(response)
    })
});

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
});

app.get('*', (req, res) => {
  res.sendFile('index.html', { root : __dirname+'/build'});
});

app.listen(3001);
const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;

  console.log('Server started, yeyyy!');
});
