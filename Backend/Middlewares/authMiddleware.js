import { User } from "../Models/user.js";
import { asyncHandler } from "./asyncHandler.js";
import { errHandler } from "./errormiddleware.js";
import jwt from "jsonwebtoken"


export const isAuth = asyncHandler(async(req,res,next)=>{
    const {token} = req.cookies
    if(!token){
        return next(new errHandler(400,"User is not Authenticated"));
    }

    const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id)

    
    next()
});


//employer can post only handled 
export const isAuthorized = (...roles) => {
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new errHandler(`${req.user.role} not allowed to post jobs`))
        }
        next()
    }
}