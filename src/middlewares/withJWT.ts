import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
if(!secret){
    throw new Error(" [WithJWT] Secret token for jwt is required");
}

export function withJWT(req: Request, res: Response, next: NextFunction){
    const token = req.header("Authorization");
    if(!token){
        console.log(" [WithJWT] Access Denied: No token provided ")
        return res.status(401).json({ error: 'Access Denied, provide token in Authorization header' });
    }
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
        //TODO: add user or session to req object
        next();
    } catch (error) {
        console.log(" [WithJWT] Invalid token: ",token)
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export function generateJWT(userPayload: Object | string, ttl?: number){

    return jwt.sign(userPayload,secret,{ expiresIn: ttl });
}