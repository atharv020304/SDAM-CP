import express from "express"
import { isAuth, isAuthorized } from "../Middlewares/authMiddleware.js";
import { deleteApplication, EmployeeGetAllApplication, EmployerGetAllApplicaton, postApplication } from "../Controllers/appController.js";

const appRouter = express.Router();

// appRouter.post("/post/:id",isAuth,isAuthorized("Employer"),postApplication);
appRouter.post("/post/:id",isAuth,isAuthorized("Employee"),postApplication);
appRouter.get("/employer/getall",isAuth,isAuthorized("Employer"),EmployerGetAllApplicaton);
appRouter.get("/employee/getall",isAuth,isAuthorized("Employee"),EmployeeGetAllApplication);
// appRouter.get("/employee/getall",isAuth,isAuthorized("Employee"),EmployeeGetAllApplication);
appRouter.delete("/delete/:id",isAuth,deleteApplication)

export default appRouter