import { Router } from "express";
import { generateJWT } from "../middlewares";
const authRoutes = Router();
/**
 * @swagger
 * /auth/token:
 *    get:
 *      summary: Get a JWT token
 *      responses:
 *       '200':
 *         description: Get a 1 hour valid token to test the protected endpoints
 *       '5XX':
 *         description: Unexpected error.
 * 
 * 
*/
authRoutes.get("/token", async(req,res)=>{
        //Generates a token that expires in 1 hour
        const token = generateJWT({ role: "root" }, 60*60);
        return res.status(200).send({ token })
});
export default authRoutes;