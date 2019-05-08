
exports.seed = function(knex, Promise) {
  return knex('streamers')
    .truncate() 
    .then(() => {
      return knex('streamers').insert([
        {
          id: 0,
          channelName: 'Sam Pepper',
          verified: false,
          discord: 'https://discord.gg/qrXRuJg',
          twitter: 'https://twitter.com/sampepper',
          youtube: 'UCdSr4xliU8yDyS1aGnCUMTA',
          donate: 'https://streamlabs.com/16bitsam',
          reddit: 'https://www.reddit.com/r/SamPepper',
          instagram: 'https://www.instagram.com/sampepper'
        },
        {
          id: 1,
          channelName: 'Jesse Wellens',
          verified: false,
          discord: '',
          twitter: '',
          youtube: 'UC6bA7BuUmGKPIS3wW2voNxg',
          donate: 'https://streamlabs.com/DownRangeGaming',
          reddit: '',
          instagram: 'https://www.instagram.com/jessewelle'
        }
      ]);
    });
};
