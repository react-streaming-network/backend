
exports.up = function(knex, Promise) {
    return knex.schema.createTable('streamers', tbl => {
      tbl.increments();

      tbl.string('channelName').notNullable().unique('uq_streamers_channelName')
      tbl.boolean('verified').notNullable()
      tbl.string('discord')
      tbl.string('twitter')
      tbl.string('youtube').notNullable().unique('uq_streamers_youtube')
      tbl.string('donate')
      tbl.string('reddit')
      tbl.string('instagram')
      
      tbl.timestamps(true, true)
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('streamers')
};
