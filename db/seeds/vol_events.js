
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('vol_events').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('vol_events').insert({
          id: 1,
          event_id: 1,
          vol_id: 1
        }),
        knex('vol_events').insert({
          id: 2,
          event_id: 2,
          vol_id: 2
        }),
        knex('vol_events').insert({
          id: 3,
          event_id: 3,
          vol_id: 3
        }),
      ]);
    });
};

