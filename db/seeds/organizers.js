
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
          org_name: 'Joel',
          org_email: 'joel@bcchildrens.ca',
          org_password: 'very_secure_hashed_password'
        },
        {
          id: 2,
          organization: 'Audobon Society',
          org_details: 'We like birds and making sure they survive long into the distant future when theres robots n stuff',
          org_name: 'Rohit',
          org_email: 'rohit@audobon.com',
          org_password: 'very_secure_hashed_password'
        },
        {
          id: 3,
          organization: 'Clean Beaches BC',
          org_details: 'We like our beaches like we like our forests and rivers, clean.',
          org_name: 'Nima',
          org_email: 'nima@cleanbeaches.ca',
          org_password: 'very_secure_hashed_password'
        }),
      ]);
    });
};
