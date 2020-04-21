const express = require('express')
const ProjectsService = require('./projects-service')
// const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()

const projectsRouter = express.Router()

projectsRouter
  .route('/')
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get('db'))
      .then(projects => {
        res.json(projects.map(ProjectsService.serializeProject))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req,res,next)=> {
      const {project_name}=req.body;
      ProjectsService.insert(
        req.app.get('db'),
        {project_name}
      )
      .then(project => {
          res.status(201).json(project)
      })
  })

module.exports= projectsRouter;