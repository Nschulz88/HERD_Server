DROP TABLE IF EXISTS organizers CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;

CREATE TABLE organizers (
 id integer PRIMARY KEY,
 organization VARCHAR (255),
 org_details TEXT,
 org_name VARCHAR (255),
 org_email VARCHAR (255),
 org_password VARCHAR (255)
);

CREATE TABLE events (
 id integer PRIMARY KEY,
 organizer_id integer,
 volunteer_id integer,
 event_size VARCHAR (255),
 location VARCHAR (255),
 event_description VARCHAR (255),
 criteria VARCHAR (255),
 event_date DATE,
 event_time TIME
);

CREATE TABLE volunteers (
  id integer PRIMARY KEY,
  vol_name VARCHAR (255),
  email VARCHAR (255),
  hours integer,
  vol_password VARCHAR (255)
);