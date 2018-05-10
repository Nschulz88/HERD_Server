
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('events', function (t){
      t.varchar('event_type', 255)
    }),
    knex.schema.table('volunteers', function (t){
      t.varchar('profile_pic_url', 255)
      t.dropColumn('hours')
    })
    knex.schema.table('organizers', function (t){
      t.dropColumn('organization_details')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('events', function (t){
      t.dropColumn('event_type')
    }),
    knex.schema.table('volunteers', function (t){
      t.dropColumn('profile_pic_url')
      t.integer('hours')
    })
    knex.schema.table('organizers' function (t){
      t.varchar('organizer_details', 255)
    })
  ])
};
