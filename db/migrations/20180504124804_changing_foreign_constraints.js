exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('events', function (table) {
      table.increments('id'),
      //table.foreign('organizer_id').references('organizers.id'),
      table.json('GMaps_API_location')
      table.varchar('location', 255)
      table.varchar('event_size', 255),
      table.varchar('event_description', 255),
      table.varchar('criteria', 255),
      table.date('event_date'),
      table.time('event_time')
      table.integer('duration')
    }),
    knex.schema.createTable('organizers', function (table) {
      table.increments('id'),
      table.varchar('organization_name', 255),
      table.varchar('organization_details', 255),
      table.varchar('organizer_name', 255),
      table.varchar('organizer_email', 255),
      table.varchar('organizer_password', 255)
    }),
    knex.schema.createTable('volunteers', function (table) {
      table.increments('id'),
      table.varchar('vol_name', 255),
      table.varchar('vol_email', 255),
      table.varchar('vol_hours', 255),
      table.varchar('vol_password', 255),
      table.integer('hours')
    }),
    knex.schema.createTable('vol_events', function (table) {
      table.increments('id')
      //table.foreign('vol_id').references('volunteers.id'),
      //table.foreign('event_id').references('events.id')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('organizers'),
    knex.schema.dropTable('events'),
    knex.schema.dropTable('volunteers'),
    knex.schema.dropTable('vol_events')
  ])
};
