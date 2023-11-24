import  jwt from "jsonwebtoken";
import { errorHandling } from "./error.js";

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;

    if (!token) return next(errorHandling(401,'Unauthorized'));
    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        if (err) return next(errorHandling(403,'Forbidden'));
        req.user = user;
        next();
    })
}