# System Configuration 
NODE VERSION = 18.17.0

# Project set up
1. Clone the project from giturl : https://github.com/mohitpandey37/task_management 
2. Install required dependecies with commnad : "npm install"
3. start project with command: "npm run dev"  (note: make sure socket and database connection are established successfully )
4. run an additional command only once in a new terminal: "npm run doc"
5. To access the api docs : http://localhost:3000/api-doc/

# Project Details
1. All project requirements are completed (User's CRUD operation, Task's CRUD operation, Project's CRUD operation).
2. Tasks are mapped with projects as considered they are related to a particular project. 
3. Soft delete functionality is used here as it will only inactive any data not fully remove.
4. Document add, edit end delete access is only limited to the admin. Task status update api is accesible by user. 
5. Real time notification for task status update will be shown here : http://localhost:3000/homepage
