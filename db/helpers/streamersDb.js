const db = require('../dbConfig.js');

const get = () => {
    return db('streamers')
}

const getById = id => {
    return db('streamers')
        .where({ id })
        .first()
}

const insert = user => {
    return db('streamers')
        .insert(user)
        .then(ids => {
            return getById(ids[0])
        })
}

const update = (id, changes) => {
    return db('streamers')
        .where({ id })
        .update(changes);
}

const remove = id => {
    return db('streamers')
        .where({ id })
        .del()
}

module.exports = {
    get,
    getById,
    insert,
    update,
    remove,
};