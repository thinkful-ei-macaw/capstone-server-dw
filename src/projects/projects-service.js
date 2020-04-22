const xss = require('xss')

const ProjectsService = {
  getAllProjects(db) {
    return db
      .from('flash_projects as projects').select("*")
  },
  insert(db,project){
      return db("flash_projects")
      .insert(project).returning('id')
  },
  serializeProject(project) {
    return {
      id: project.id,
      project_name: xss(project.project_name),
      date_created: new Date(project.date_created),
    }
},
deleteProject(knex,id){
  return knex 
  .from('flash_projects')
  .where('id',id)
  .delete()
},
};
module.exports=ProjectsService;
