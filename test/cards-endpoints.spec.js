const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Cards Endpoints', function() {
  let db

  const {
    testProjects,
    testCards,
  } = helpers.makeProjectsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/cards/projectId`, () => {
    beforeEach('insert projects', () =>
      helpers.seedProjectsTables(
        db,
        testProjects,
        testCards,
      )
    )

    it(`creates an card, responding with 201 and the new card`, function() {
      this.retries(3)
      const testProject = testProjects[0]
      const newCard = {
        question: 'Test new card',
        answer:'Test new card',
        project_id: testProject.id,
       
      }
      return supertest(app)
        .post(`/api/cards/${testProject.id}`)
        .send(newCard)
        .expect(201)
        .expect(res => {console.log(res.body)
          expect(res.body.rowCount).to.equal(1)
        
        })
        .expect(res =>
          db
            .from('flash_cards')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.question).to.eql(newCard.question)
              expect(row.question).to.eql(newCard.question)
              expect(row.project_id).to.eql(newCard.project_id)
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })
  })
})