
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('organizers').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('organizers').insert({
          id: 1,
          organization_name: 'BC Childrens',
          organization_details: 'We are a very charitable organization. That needs a veritable HERD of volunteers',
          organizer_name: 'Joel',
          organizer_email: 'joel@bcchildrens.ca',
          organizer_password: 'very_secure_hashed_password'
        }),
        knex('organizers').insert({
          id: 2,
          organization_name: 'Audobon Society',
          organization_details: 'We like birds and making sure they survive long into the distant future when theres robots n stuff',
          organizer_name: 'Rohit',
          organizer_email: 'rohit@audobon.com',
          organizer_password: 'very_secure_hashed_password'
        }),
        knex('organizers').insert({
          id: 3,
          organization_name: 'Clean Beaches BC',
          organization_details: 'We like our beaches like we like our forests and rivers, clean.',
          organizer_name: 'Nima',
          organizer_email: 'nima@cleanbeaches.ca',
          organizer_password: 'very_secure_hashed_password'
        }),
      ]);
    });
};
