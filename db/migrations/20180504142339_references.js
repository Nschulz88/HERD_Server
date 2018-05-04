
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('vol_events', function (t){
      t.integer('vol_id')
      t.foreign('vol_id').references('volunteers.id');
      t.integer('event_id')
      t.foreign('event_id').references('events.id');
    }),
    knex.schema.table('events', function (t){
      t.integer('organizer_id')
      t.foreign('organizer_id').references('organizers.id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('vol_events', function (t){
      t.dropColumn('vol_id').references('volunteers.id');
      t.dropColumn('event_id').references('events.id');
    }),
    knex.schema.table('events', function (t){
      t.dropColumn('organizer_id').references('organizers.id');
    })
  ])
};