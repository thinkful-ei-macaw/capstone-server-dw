Welcome to Version 1 of my very first full-stack educational app, Flash. With Flash, a user can create a project and upload flash cards to it. A user can then view flash cards, as well as update and delete an existing project or card. This app was deployed with Zeit on the client side and Heroku on the back end. This app is a React App developed with JS,NodeJs with Express,Postgresql, Knex, and Vanilla CSS. Testing was completed with Chai/Mocha.

Visit here at https://flash-delta.now.sh !!
Database Hosted at https://gentle-atoll-30518.herokuapp.com

API Documentation:

Projects Endpoints:
GET/api/projects
-Returns an array of created flash projects

[{
    "id":1,
    "project_name":"test project",
    "date_created": "2020-04-24T01:32:36.537Z",
    "date_modified": null
}]

POST/api/projects
-Creates a new flash project

{
    "project_name":"test project"

}

DELETE/api/projects/:projectId
-deletes a  flash project

Card Endpoints:
GET/api/cards/:projectId
-returns an array of flash cards

[{
    "id":1,
    "question":"Capitol of Georgia?",
    "answer":"Atlanta",
    "date_created": "2020-04-24T01:32:36.537Z",
    "date_modified": null
}]

POST/api/cards/:projectId

-Create a flash card for your flash project

{
    "question":"What is React?",
    "answer":"A JS library for constructing UI's"
}

DELETE/api/cards/:projectId
-Delete a flash card from your project


![Screenshot (30)](https://user-images.githubusercontent.com/59489905/82004274-71cbce00-9630-11ea-88fc-2087b4befd86.png)
