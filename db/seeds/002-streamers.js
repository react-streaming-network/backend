
exports.seed = function(knex, Promise) {
  return knex('streamers')
    .truncate() 
    .then(() => {
      return knex('streamers').insert([
        {
          id: 1,
          channelName: 'Chilled Cow',
          verified: false,
          discord: '',
          twitter: '',
          youtube: 'UCSJ4gkVC6NrvII8umztf0Ow',
          donate: '',
          reddit: '',
          instagram: ''
        }
      ]);
    });
};
