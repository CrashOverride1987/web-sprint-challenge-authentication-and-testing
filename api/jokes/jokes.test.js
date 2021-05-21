const request = require('supertest')
const db = require('../../data/dbConfig')
const server = require('../server')

beforeAll(async ()=> {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async ()=> {
    await db('jokes')
})