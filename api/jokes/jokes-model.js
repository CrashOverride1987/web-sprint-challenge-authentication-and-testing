const db = require('./jokes-data');

function find() {
 return db('jokes')
 .select('id', 'joke')
}

function findBy(filter) {
 return db('jokes')
 .select('id', 'joke')
  .where(filter)
}

function findById(id) {
  return db('jokes')
  .select('id', 'joke')
  .where('id', id).first()
}


module.exports = {
  find,
  findBy,
  findById,
};
