import express from "express"
import { GetUser, Login, Logout, UpdatePassword, UpdateProfile, UserRegister } from "../Controllers/userController.js"
import { User } from "../Models/user.js";
import { isAuth } from "../Middlewares/authMiddleware.js";

const userRouter = express.Router();
userRouter.post('/register',UserRegister)
userRouter.post('/login',Login)
userRouter.get('/logout',isAuth,Logout)
userRouter.get('/getuser',isAuth,GetUser)
userRouter.put('/update/profile',isAuth,UpdateProfile)
userRouter.put('/update/password',isAuth,UpdatePassword)


export default userRouter;