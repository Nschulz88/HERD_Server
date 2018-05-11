
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('organizers', function (t){
     t.dropColumn('organization_details')
     t.renameColumn('organizer_name', 'name')
     t.renameColumn('organizer_email', 'email')
     t.renameColumn('organizer_password', 'password')
    }),
    knex.schema.table('volunteers', function (t){
      t.varchar('pic_url', 255)
      table.renameColumn('vol_name', 'name'),
      table.renameColumn('vol_email', 'email'),
      table.dropColumn('vol_hours'),
      table.renameColumn('vol_password', 'password'),
    })
    knex.schema.table('events', function (t){
      t.varchar('event_type', 100)
      //nothing else changes
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('organizers', function (t){
      t.varchar('organization_details', 255)
      t.varchar('organizer_name', 255),
      t.varchar('organizer_email', 255),
      t.varchar('organizer_password', 255)
    }),
    knex.schema.table('volunteers', function (t){
      t.dropColumn('pic_url'),
      t.varchar('vol_name', 255),
      t.varchar('vol_email', 255),
      t.varchar('vol_hours', 255),
      t.varchar('vol_password', 255)
    })
    knex.schema.table('events', function (t){
      t.dropColumn('event_type')
    })
  ])
};