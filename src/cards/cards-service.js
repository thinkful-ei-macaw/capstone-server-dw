const xss = require('xss')

const CardsService = {
  getAllCards(db,project_id) {
    return db
      .from('flash_cards as cards').select('*').where({project_id})
  },
  insert(db,card){
      return db("flash_cards")
      .insert(card)
      
  },
  serializeCard(card) {
    return {
      id: card.id,
      question: xss(card.question),
      answer: xss(card.answer),
      project_id: card.project_id,
    //   project_name: xss(card.project_name),
      date_created: new Date(card.date_created),
      date_modified: new Date(card.date_modified)||null
    }
},
deleteCard(knex,id){
  return knex 
  .from('flash_cards')
  .where('id',id)
  .delete()
},
}
module.exports=CardsService;
