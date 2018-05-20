require('dotenv').config();

const {createServer} = require('http');
const express = require('express');
const fs = require('fs');
const http = require('http');
const multer = require('multer');
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const corsPrefetch = require('cors-prefetch-middleware');
const imagesUpload = require('images-upload-middleware');
const compression = require('compression');
// const morgan = require('morgan');
const path = require('path');

const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);
const ENV = process.env.NODE_ENV || "development";
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
AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
});

app.use(cookieSession({
  name: 'session',
  keys: ['yaherd'],
}));


// app.use(morgan);
app.use(knexLogger(knex));
if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, '/build')));
}

app.post('/api/twilio', (req,res) => {
  client.messages.create({
    to: '+1'+req.body.phone_number,
    from: '+16042568028',
    body: 'Hey, awesome... '+req.body.name+' just signed up for your Event No.'+req.body.event_id+'!', 
  }, function(err, data) {
    if(err) {
      console.log(err)
    }
  });
  res.redirect("/")
});

app.post('/api/upload/:id', upload.single('profilepic'), (req, res) => {
  var number = Math.floor(Math.random() * 10000000);
  var str = number.toString();

  var oneParams = {
    Bucket: 'profilepics-herd',
    Key : str,
    Body: req.file.buffer,
  };

  s3.upload(oneParams, function (err, data) {
    //error
    if (err) {
      console.log("Error in s3 upload", err);
    }
    //success
    else{
      console.log('File uploaded to s3');
    }
  })

  const profileurl = ("https://s3-us-west-2.amazonaws.com/profilepics-herd/"+str);
  knex('volunteers')
      .where({
        id: req.params.id
      })
      .update({
        pic_url: profileurl,
      })
      .then(response => {
        res.json(response)
      }) .catch(err =>{
        console.log("ERROR after upload to s3 ", err)
      })
});

app.delete('/api/events/:id/cancel', (req, res) => {
  const event = req.params.id;
  const vol = req.session.user_id;
  knex('events')
    .select('*')
    .where('id', '=', event)
    .then(event => {
      let hours = Number(event[0].duration)
      knex.raw(`UPDATE volunteers SET hours = hours - ${hours} WHERE id = ${vol}`, {
      }).catch(function(err){
        throw err;
      });
    }).then(notusing => {
      knex('vol_events')
        .where({
          vol_id    : vol,
          event_id  : event
        })
        .del()
        .then((cancel) =>{
          res.json(cancel)
        })
        .catch(err =>{
          console.log(err)
        })
    })
})

app.post('/api/events/:id', (req, res) =>{
  const event = req.params.id;
  const vol = req.session.user_id;
  knex('events')
    .select('*')
    .where('id', '=', event)
    .then(event => {
      let hours = Number(event[0].duration)
      knex.raw(`UPDATE volunteers SET hours = hours + ${hours} WHERE id = ${vol}`, {
      }).catch(function(err){
        throw err;
      });
    }).then(notusing => {
      knex('vol_events')
        .insert({
          vol_id    : vol,
          event_id  : event
        })
        .then(join =>{
          res.json(join)
        })
        .catch(err =>{
          console.log(err)
        })
    })
});


app.get('/api/events/:id', (req, res) => {
  knex('vol_events')
    .where('vol_events.event_id', req.params.id)
    .then(vol_events_query => {
      if (vol_events_query.length === 0){
        knex('events')
          .select('*')
          .where('events.id', req.params.id)
          .then(event =>{
            res.json(event)
          })
      } else {
        knex('events')
          .select('*')
          .where('events.id', req.params.id)
          //need to check if anything in vol events for event before completeing join
          .join('vol_events', 'events.id', 'vol_events.event_id')
          .join('volunteers', 'volunteers.id', 'vol_events.vol_id')
          .then(event =>{
            res.json(event)
          })
      }
    })
});

app.get('/api/organizers', (req, res) => {
  knex('organizers')
    .select('*')
    .then(organizers => {
      res.json(organizers);
    });
});

// If logged in, shows name, error handling for name or organizer for email registered
app.post('/api/register/organizers', (req, res) => {
  knex('organizers')
    .select('*')
    .where({
      email: req.body.email
    })
    .then(match => {
      if (match.length >= 1){
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
            req.session.user_id = response[0].id;
            req.session.vol_org = 'organizer';
            res.json({user: response[0]});
          }).catch(error =>{
            console.log("Failure after trying to register new organizer", error)
          })
        }
    })
});

app.get('/api/volunteers/:id', (req, res) => {
  knex('vol_events')
    .select('*')
    .where('vol_events.vol_id','=', req.params.id)
    .then(vol_events_query => {
      if(vol_events_query.length === 0){
        knex('volunteers')
          .select('*')
          .where('id','=', req.params.id)
          .then(volunteers => {
            res.json(volunteers);
          });
      } else {
        knex('volunteers')
          .select('*')
          .where('volunteers.id', req.params.id)
          .join('vol_events', 'volunteers.id', 'vol_events.vol_id')
          .join('events', 'events.id', 'vol_events.event_id')
          .then(volunteers => {
            res.json(volunteers);
            res.end()
          });
      }
    })
});

app.get('/api/volunteers', (req, res) => {
  knex('volunteers')
    .select('*')
    .then(volunteers => {
      res.json(volunteers);
    });
});

app.post('/api/register/volunteers', (req, res) => {
  knex('volunteers')
    .select('*')
    .where({
      email: req.body.email
    })
    .then(match => {
      if (match.length >= 1){
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
            response[0].vol_org = 'volunteer';
            res.json({user: response[0]});
          })
          .catch(error =>{
            console.log("Failiure after trying to register new organizer", error)
          })
        }
    })
});

app.post('/api/login', (req, res) => {
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
  req.session = null;
  return res.status(200).json({});
});


app.post('/api/events', (req, res) => {
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
      event_type          :req.body.event_type,
      phone_number        :req.body.phone_number,
    }).then(organizers => {
      res.json(organizers)
    }).catch(err =>{
      console.err
    })
});

app.get('/api/rsvps/:id', (req, res) => {
  knex('vol_events')
    .select('*')
    .where('event_id', '=', req.params.id)
    .then(response =>{
      res.json(response)
    })
});

app.get('/api/events', (req, res) => {
  let today = new Date()
  knex('events')
    .select('*')
    .where('event_date', '>=', today)
    .then(organizers => {
      res.json(organizers)
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
