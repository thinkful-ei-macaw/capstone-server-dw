const express = require('express')
const CardsService = require('./cards-service')
// const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()

const cardsRouter = express.Router()
function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}
cardsRouter
  .route('/:projectId')
  .all((req,res, next)=> {let id = req.params.projectId;
  if (isNormalInteger(id)){
    next();
  }else{ res.status(400).send({err:'Invalid value'})

  }})
  .get((req, res, next) => {console.log(req.params);
    CardsService.getAllCards(req.app.get('db'),req.params.projectId)
      .then(cards => {console.log(cards);
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
      .catch(next)
  })
  cardsRouter
  .route('/:cardId')
  .delete((req, res, next) => {
    CardsService.deleteCard(req.app.get('db'), req.params.cardId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

module.exports= cardsRouter;