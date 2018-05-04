exports.up = function(knex, Promise) {
  return knex.schema.table('events', function (t){
    t.integer('event_duration')
   })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('events', function (t){
    t.dropColumn('event_duration');
  })
};

