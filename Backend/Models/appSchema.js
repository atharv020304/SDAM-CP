import mongoose from "mongoose";
import validator from "validator";

const appSchema = new mongoose.Schema({
    employeeInfo:{
        id: {
            type : mongoose.Schema.ObjectId,
            ref:"User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            validate: [validator.isEmail,"provide valid email"]
        },
        phone:{
            type: Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        resume:{
            public_id: String,
            url: String
        },
        coverLetter: {
            type:String,
            required: true,
        },
        role:{
            type:String,
            enum: ["Employee"]
        }

    },

    employerInfo:{
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        role:{
            type:String,
            enum:["Employer"],
            required: true,
        }
    },

    jobInfo:{
        jobId: {
            type: mongoose.Schema.ObjectId,
            ref: "Job",
            required: true,
        },
        jobTitle:{
            type:String,
            required:true
        }
    },

    deletedBy:{
        jobSeeker:{
            type: Boolean,
            default:false,
        },
        employer:{
            type:Boolean,
            default: false,
        },
    },

})

export const Application = mongoose.model("Application",appSchema)