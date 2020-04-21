const express = require('express')
const CardsService = require('./cards-service')
// const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()

const cardsRouter = express.Router()

cardsRouter
  .route('/:projectId')
  .get((req, res, next) => {
    CardsService.getAllCards(req.app.get('db'),req.params.projectId)
      .then(cards => {
        res.json(cards.map(CardsService.serializeCard))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req,res,next)=> {
      const {question,answer}=req.body;
      CardsService.insert(
        req.app.get('db'),
        {question,answer,project_id:req.params.projectId}
      )
      .then(card => {
          res.status(201).json(card)
      })
  })

module.exports= cardsRouter;