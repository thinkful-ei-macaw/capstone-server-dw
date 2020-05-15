const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Projects Endpoints', function(){
    let db

    const{
        testProjects,
        testCards
    }= helpers.makeProjectsFixtures()

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
    
      describe(`GET /api/projects`, () => {
        context(`Given no projects`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/projects')
              .expect(200, [])
          })
        })
      })
      describe(`POST /api/projects`, () => {
        beforeEach('insert projects', () =>
          helpers.seedProjectsTables(
            db,
            testProjects,
            testCards,
          )
        )
    
        it(`creates an project, responding with 201 and the new project`, function() {
          this.retries(3)
          const testProject = testProjects[0]
          const newProject = {
            name: 'Test Project',
          }
          return supertest(app)
            .post(`/api/projects`)
            .send(newProject)
            .expect(201)
            .expect(res => {console.log(res.body)
              expect(res.body.rowCount).to.equal(1)
            
            })
            .expect(res =>
              db
                .from('flash_projects')
                .select('*')
                .where({ id: res.body.id })
                .first()
                .then(row => {
                  expect(row.name).to.eql(newProject.name)
                  const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                  const actualDate = new Date(row.date_created).toLocaleString()
                  expect(actualDate).to.eql(expectedDate)
                })
            )
        })
      })
})