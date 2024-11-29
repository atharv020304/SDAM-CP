

import express from "express"
import {config} from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import {connection} from "./Database/connection.js"
import { errorMiddleware } from "./Middlewares/errormiddleware.js";
import fileUpload from "express-fileupload";
import userRouter from "./Routes/userRoutes.js";
import jobRouter from "./Routes/jobRouter.js";
import appRouter from "./Routes/appRouter.js";
import { newsLetterCron } from "./MailSendFunc/newsLetterCron.js";


const app = express();
config({path: "./config/config.env"})
const corsOrigin = "http://localhost:5173"


//middleware to connect fend and bend
app.use(cors({
    origin: corsOrigin,
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
})
);

// to get access to tokens 
app.use(cookieParser())


// to check type of data
app.use(express.json())
app.use(express.urlencoded({extended:true}));


app.use(
    fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
})
);

app.use("/api/v1/user",userRouter);
app.use("/api/v1/job",jobRouter);
app.use("/api/v1/application",appRouter);


newsLetterCron()

connection()

app.use(errorMiddleware)

export default app;