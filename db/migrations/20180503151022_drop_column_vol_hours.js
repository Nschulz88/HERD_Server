exports.up = function(knex, Promise) {
  return knex.schema.table('volunteers', function (t){
    t.dropColumn('vol_hours')
   })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('events', function (t){
    t.varchar('vol_hours');
  })
};
