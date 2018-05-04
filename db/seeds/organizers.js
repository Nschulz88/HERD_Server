
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
  return knex('organizers').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('organizers').insert({
          id: 1,
          organization: 'BC Childrens',
          org_details: 'We are a very charitable organization. That needs a veritable HERD of volunteers',
          org_name: 'BC Childrens',
          org_email: 'sally@bcchildrens.ca',
          org_password: 'very_secure_hashed_password'
        }),
      ]);
    });
};
