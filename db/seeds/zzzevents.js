
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
        knex('events').insert({
          id: 2,
          organizer_id: 2,
          volunteer_id: 2,
          event_size: 500,
          location: 'Lighthouse Labs',
          event_description: 'Birdwatching',
          criteria: 'BYOBinoculars',
          event_date: '2019-12-14',
          event_time: '13:30',
          event_duration: 6
        }),
        knex('events').insert({
          id: 3,
          organizer_id: 3,
          volunteer_id: 3,
          event_size: 10,
          location: 'UBC Campus',
          event_description: 'Swimming in the fountain for charity',
          criteria: 'Get a tetanus shot that water nastay',
          event_date: '2018-02-11',
          event_time: '18:30',
          event_duration: 3
        }),
      ]);
    });
};
