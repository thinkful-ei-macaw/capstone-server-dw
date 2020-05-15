
  
  function makeProjectsArray() {
    return [
      {
        id: 1,
        project_name: 'First test post!',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      } 
    ]
  }
  
  function makeCardsArray(projects) {
    return [
      {
        id: 1,
        question: 'First test comment!',
        answer: 'Sample answer',
        project_id: projects[0].id,
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
     
    ];
  }
  
  // function makeExpectedProject() {
  //   const author = users
  //     .find(user => user.id === article.author_id)
  
  //   const number_of_comments = comments
  //     .filter(comment => comment.article_id === article.id)
  //     .length
  
  //   return {
  //     id: article.id,
  //     style: article.style,
  //     title: article.title,
  //     content: article.content,
  //     date_created: article.date_created.toISOString(),
  //     number_of_comments,
  //     author: {
  //       id: author.id,
  //       user_name: author.user_name,
  //       full_name: author.full_name,
  //       nickname: author.nickname,
  //       date_created: author.date_created.toISOString(),
  //       date_modified: author.date_modified || null,
  //     },
  //   }
  // }
  
  // function makeExpectedArticleComments(users, articleId, comments) {
  //   const expectedComments = comments
  //     .filter(comment => comment.article_id === articleId)
  
  //   return expectedComments.map(comment => {
  //     const commentUser = users.find(user => user.id === comment.user_id)
  //     return {
  //       id: comment.id,
  //       text: comment.text,
  //       date_created: comment.date_created.toISOString(),
  //       user: {
  //         id: commentUser.id,
  //         user_name: commentUser.user_name,
  //         full_name: commentUser.full_name,
  //         nickname: commentUser.nickname,
  //         date_created: commentUser.date_created.toISOString(),
  //         date_modified: commentUser.date_modified || null,
  //       }
  //     }
  //   })
  // }
  
  function makeMaliciousProject() {
    const maliciousArticle = {
      id: 911,
      date_created: new Date(),
      project_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    }
    // const expectedArticle = {
    //   ...makeExpectedArticle([user], maliciousArticle),
    //   title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    //   content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    // }
    return {
      maliciousProject,
    }
  }
  
  function makeProjectsFixtures() {
    const testProjects = makeProjectsArray()
    const testCards = makeCardsArray(testProjects)
    return { testProjects, testCards}
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          flash_projects,
          flash_cards
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE flash_projects_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE flash_cards_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('flash_projects_id_seq', 0)`),
          trx.raw(`SELECT setval('flash_cards_id_seq', 0)`),
        ])
      )
    )
  }
  
  function seedProjectsTables(db, projects, cards=[]) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('flash_projects').insert(projects)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('flash_projects_id_seq', ?)`,
        [projects[projects.length - 1].id],
      )
      // only insert comments if there are some, also update the sequence counter
      if (cards.length) {
        await trx.into('flash_cards').insert(cards)
        await trx.raw(
          `SELECT setval('flash_cards_id_seq', ?)`,
          [cards[cards.length - 1].id],
        )
      }
    })
  }
  
  function seedMaliciousProjects(db, projects) {
    return seedUsers(db)
      .then(() =>
        db
          .into('flash_projects')
          .insert([projects])
      )
  }
  
 
  
  module.exports = {
  
    makeProjectsArray,
    makeMaliciousProject,
    makeCardsArray,
    makeProjectsFixtures,
    cleanTables,
    seedProjectsTables,
    seedMaliciousProjects,
  
  }