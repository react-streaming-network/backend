
exports.seed = function(knex, Promise) {
  return knex('users')
    .truncate()
    .then(() => {
      return knex('users').insert([
        {
          id: 1, 
          username: 'Kieran', 
          password: '$2a$12$4PMcBwNteqVm9YO5hwlKGOW8DiH8qgGJp8AWVb6jqGKsmWZlx.Jra', 
          email: 'kieranvieira@live.com',
          role: 'admin'
        },
      ]);
    });
};
