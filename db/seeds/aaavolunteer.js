
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('volunteers').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('volunteers').insert({
          id: 1,
          vol_name: `Sam Schantz`,
          vol_email: 'samvschantz@gmail.com',
          hours: 68,
          vol_password: 'hashed_password_very_secure'
        }),
        knex('volunteers').insert({
          id: 2,
          vol_name: `Dominic Bartlomowicz`,
          vol_email: 'dbart@gmail.com',
          hours: 33,
          vol_password: 'hashed_password_very_secure'
        }),
        knex('volunteers').insert({
          id: 3,
          vol_name: `Natalie Schultz`,
          vol_email: 'natschultz@gmail.com',
          hours: 45,
          vol_password: 'hashed_password_very_secure'
        }),
      ]);
    });
};
