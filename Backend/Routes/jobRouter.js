import express from "express"
import { isAuth ,isAuthorized } from "../Middlewares/authMiddleware.js";
import { deleteJob, getAllJobs, getMyJobs, getSinglejob, PostJob } from "../Controllers/jobController.js";
const jobRouter  = express.Router();

jobRouter.post("/post",isAuth,isAuthorized("Employer"),PostJob)
jobRouter.get("/getall",getAllJobs);
jobRouter.get("/getmyjobs",isAuth,isAuthorized("Employer"),getMyJobs)
jobRouter.delete("/delete/:id",isAuth,isAuthorized("Employer"),deleteJob)
jobRouter.get("/get/:id",getSinglejob)

export default jobRouter;
