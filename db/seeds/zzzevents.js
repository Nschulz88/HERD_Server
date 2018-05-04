
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('events').insert({
          id: 1,
          organizer_id: 1,
          volunteer_id: 1,
          event_size: 60,
          location: 'Stanley Park',
          event_description: '5k run to defeat smallpox',
          criteria: 'Bring sunscreen it will be hot!',
          event_date: '2016-06-23',
          event_time: '18:30',
          event_duration: 2
        }),
      ]);
    });
};
