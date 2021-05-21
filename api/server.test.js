const server = require('./server')
describe('sanity', () => {
  test('if server exists', () => {
    expect(server).toBeDefined()
  })
})
