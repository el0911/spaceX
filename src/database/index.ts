import Knex from 'knex'
const configs = require('./knexfile')
const config = configs[process.env.NODE_ENV || 'development']

const db = Knex(config)

export default db