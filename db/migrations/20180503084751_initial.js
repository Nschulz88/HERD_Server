
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('organizers', function (table) {
      table.increments('id'),
      table.varchar('organization', 255),
      table.text('org_details'),
      table.varchar('org_name', 255),
      table.varchar('org_email', 255),
      table.varchar('org_password', 255)
    }),
    knex.schema.createTable('events', function (table) {
      table.increments('id'),
      table.integer('organizer_id').references('id').inTable('organizers'),
      table.integer('volunteer_id').references('id').inTable('volunteers'),
      table.varchar('event_size', 255),
      table.varchar('location', 255),
      table.varchar('event_description', 255),
      table.varchar('criteria', 255),
      table.date('event_date'),
      table.time('event_time')
    }),
    knex.schema.createTable('volunteers', function (table) {
      table.increments('id'),
      table.varchar('vol_name', 255),
      table.varchar('vol_email', 255),
      table.varchar('vol_hours', 255),
      table.varchar('vol_password', 255),
      table.integer('hours')
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('organizers'),
    knex.schema.dropTable('events'),
    knex.schema.dropTable('volunteers')
  ])
};
