import { asyncHandler } from "../Middlewares/asyncHandler.js"
import { errHandler } from "../Middlewares/errormiddleware.js"
import { Application } from "../Models/appSchema.js"
import { Job } from "../Models/job.js";
import {v2 as cloudinary} from "cloudinary";


export const postApplication = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    const {name, email, phone, address,coverLetter} = req.body;
    if(!name || !email || !phone || !address || !coverLetter){
        return next(new errHandler(400,"all fields are required "));
    }    

    const employeeInfo = {
        id: req.user._id,
        name,email,phone,address,coverLetter,role:"Employee",
    }

    const jobDetails = await Job.findById(id);
    if(!jobDetails){
        return next(new errHandler(400,"Job not Found"))
    }

    const isApplied = await Application.findOne({
        "jobInfo.jobId": id,
        "employeeInfo.id" : req.user._id
    });

    if(isApplied){
        return next(new errHandler(400,"you have already applied for this job "));
    }

    if(req.files && req.files.resume){
        const {resume} = req.files;
        try{
            const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempfilePath,{
                folder:"Job_seekers_resume"
            });

            if(!cloudinaryResponse || cloudinaryResponse.error){
                return next(new errHandler(500,"failed to upload resume 1"))
            }

            employeeInfo.resume = {
                public_id :cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }

        }catch(error){
            return next(new errHandler(500,"failed to upload resume 2"))
        }
    }else{
        if(req.user && !req.user.resume.url){
            return next(new errHandler(400,"Resume is required"))
        }

        employeeInfo.resume = {
            public_id:req.user.resume.public_id,
            url:req.user.resume.url
        }

    } 

    //employersathi
    const employerInfo = { 
        id : jobDetails.postedBy,
        role: "Employer"
    }

    //jobdetails
    const jobInfo = {
        jobId: id,
        jobTitle: jobDetails.title,
    }

    const application = await Application.create({
        employeeInfo,
        employerInfo,
        jobInfo
    })
    return res.status(201).json({
        success: true,
        message:"Application submitted successfully",
        application,
    });
});

export const EmployerGetAllApplicaton = asyncHandler(async(req,res,next)=>{
    const {_id} = req.user;
    const applications = await Application.find({
        "employerInfo.id":_id,
        "deletedBy.employer": false,     
    });

    res.status(200).json({
        success:true,
        applications
    });

})

export const EmployeeGetAllApplication = asyncHandler(async(req,res,next)=>{

    const {_id} = req.user;
    const applications = await Application.find({
        "employeeInfo.id":_id,
        "deletedBy.jobSeeker": false,     
    });

    res.status(200).json({
        success:true,
        applications
    });

})

export const deleteApplication = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const application = await Application.findById(id);
    if(!application) {
        return next(new errHandler(400,"Applicatuon not found!"));
    }

    const {role} = req.user;

    if( role === "Employee"){
        application.deletedBy.jobSeeker = true;
        await application.save();
    }else if(role === "Employer"){
        application.deletedBy.employer = true;
        await application.save();
    }

    if(application.deletedBy.employer === true && application.deletedBy.jobSeeker){
        await application.deleteOne();
    }
    res.status(200).json({
        success: true,
        message: "Application deleted"
    });

 })