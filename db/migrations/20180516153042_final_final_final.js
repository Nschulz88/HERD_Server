exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('events', function (t){
     t.varchar('phone_number', 255)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('events', function (t){
     t.dropColumn('phone_number')
    })
  ])
};
