## Getting Started

An api builded with Express + Typescript +  MongoDB + Mongoose + JWT Auth + node cache + Excel reader

Features:
- Cached elements for fast responses with node-cache
- Mode cluster for better performance
- Swagger API docs
- Excel reader to preload users information
- Generated log for a better debug

Live demo: https://blog-example-gules-pi.vercel.app/
#### Prerequisites:
- Node.js 18 or higher
- MongoDB Server installed

#### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGOOSE_URI` mongodb://USER:PASSWORD@HOST:PORT/DB_NAME
`JWT_SECRET` mongodb://USER:PASSWORD@HOST:PORT/DB_NAME
`NODE_ENV`  development | production 


Steps to launch locally 
1. Clone this repo
2. Add .env variables as needed
3. Run ‘npm install’ command
4. After dependencies installation, run ‘npm run build’ command to generate dist folter
5. Run ‘npm start’ command to start the server
6. Go to http://localhost:3000/docs to read API documentation


#### Notes

 - src/data/dummy_users.xlsx contains a list of dummy users in order to fill database, add rows as needed, to disable this function set NODE_ENV=production in .env file
 - Swagger documentation should be available in non production enviorment, set NODE_ENV=production in .env file to disable it.
