import _express from "express";
import router from "./router";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import { connectToDatabase, nextSequence } from "./lib/database";
import { readExcelFile } from "./lib/excelReader";
import { User } from "./models";
import logger from "./lib/logger";

dotenv.config();

class Server {

    express: _express.Application;s
    port = process.env.PORT || 4000

    async loadDummyData(){
        const dummy_users = await readExcelFile();
        if(dummy_users.length > 0 ){
            logger.debug("Loading dummy data...");
                let success = 0;
                let updated = 0;
                let errorUsers =[]
                for await(let u of dummy_users){
                    try{
                        let updated = await User.findOneAndUpdate({
                            email: u.email.toLowerCase()
                        },{
                            $set: u,
                            $setOnInsert:{
                                id: await nextSequence("users")
                            }
                        },{
                            upsert: true
                        })
                        if(!updated){
                            success++;
                        }
                       
                    }catch(e){
                        console.log(e);
                       //Error due user insertion
                       errorUsers.push({...u, errorMessage: e.message});
                    }
                }
                //We could use insert many but if a row fails, all remaining users will fail
                // let result =  await User.insertMany(dummy_users);
            logger.debug(success, " dummy users inserted successfully");
            logger.debug(errorUsers.length, " dummy users failed to load");
        }
       
    }

    async loadDatabase(){ // Connects to database service
        try{
            await connectToDatabase();
            logger.info("Connected to MongoDB")
        }catch(e){
            logger.error("Error connecting to database: ",e.message);
        }
    }

    loadServer(){  //Initialize express server
        if(this.express){
            logger.warn(" [Server] Already initialized")
            return;
        }

        this.express = _express();

        // Add middlewares to the app
        this.express.use(_express.json());
        if(process.env.NODE_ENV != "production"){
            this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc({
                definition:{
                    openapi :"3.0.0",
                    info:{
                        version: "1.0.0",
                        title: "Wispok API Documentation",
                        description: "A basic example of CRUD for users"
                    },
                
                    servers: [
                        {
                           url:"http://localhost:"+this.port + "/v1"
                        }
                    ]
                },
                apis: [
                    "./src/routes/auth.routes.ts",
                    "./src/routes/users.routes.ts"
                ]
            })));
        }
        //Add routes to our app
        this.express.use(`/v1`, router);

        // Start the server on the specified port
		this.express.listen(Number(this.port), () => {
			logger.info(`Server :: Running @ 'http://localhost:${this.port}'`);
            if(process.env.NODE_ENV != "production")
                logger.debug(`API documentation ready @ 'http://localhost:${this.port}/docs`);
		}).on('error', (_error) => {
			return logger.error('Error starting express: ', _error.message);
            
		});
    }

}

export default new Server