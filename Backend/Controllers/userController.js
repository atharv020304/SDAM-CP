import {asyncHandler} from "../Middlewares/asyncHandler.js"
import { errorMiddleware } from "../Middlewares/errormiddleware.js"
import { errHandler } from "../Middlewares/errormiddleware.js";
import {User} from "../Models/user.js"
import {v2 as cloudinary} from "cloudinary"
import { sendToken } from "../Utils/jwtToken.js";



export const UserRegister = asyncHandler(async(req,res,next) => {
   
    const {name,email,phone,password,address,role,firstDomain,secondDomain,thirdDomain,coverLetter} = req.body;

    if(!name || !email || !phone || !address || !password || !role){
        return next(new errHandler(400,"This field is required"))   
    }

    if(role === "Employee" && (!firstDomain || !secondDomain || !thirdDomain)){
        return next(new errHandler(400,"provide all domains"))
    }

    const UserExists = await User.findOne({email});

    if(UserExists){
        return next(new errHandler(400,"email already registerd"))
    }

    const user = {
        name,email,phone,password,address,role,
        domains: {
            firstDomain,secondDomain,thirdDomain,
        },
        coverLetter
    };

    if(req.files && req.files.resume){
        const {resume} = req.files;
        if(resume){

            const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath,
            {folder :"Job_seekers_resume"});

            if(!cloudinaryResponse || cloudinaryResponse.error){
                return next(new errHandler(500,"failed to upload"));
            }

            user.resume = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            }
        }
    }

    const userRes = await User.create(user);
    sendToken(userRes,201,res,"User registered")
    // res.status(200).json({
    //     success:true,
    //     message:"User created successfully",
    // })
})


export const Login = asyncHandler(async(req,res,next)=>{
    const {role,email,password} = req.body;
   
    if(!role || !email || !password){
        return next(new errHandler(400,"required filed should be filled"));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new errHandler(400,"Invalid email or password"))
    }

    const isPassword = await user.comparePassword(password);
    if(!isPassword){
        return next(new errHandler(400,"Invalid email or password"))
    }

    if(user.role !== role){
        return next(new errHandler(400,"Invalid role"))
    }

    sendToken(user,200,res,"User logged in Successfully")

})


export const Logout = asyncHandler(async(req,res,next)=>{
    //delete cookie to logout the user
    res.status(200).cookie("token","",{
        expires: new Date(
            Date.now()
        ),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully",
    })
})


export const GetUser = asyncHandler(async(req,res,next)=>{
    // this user we are accessing from auth middleware -->mahitisathichi comment
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })

})


export const UpdateProfile = asyncHandler(async(req,res,next)=>{
    const newData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        coverLetter: req.body.coverLetter,
        domains:{
            firstDomain :req.body.firstDomain,
            secondDomain:req.body.secondDomain,
            thirdDomain:req.body.thirdDomain
        }
    }

    const {firstDomain,secondDomain,thirdDomain} = newData.domains;

    if(req.user.role === "Employee" && (!firstDomain || ! secondDomain || !thirdDomain)){
        return next(errHandler(400,"All domains required"))
    }

    //new resume upload
    if(req.files){
      const resume = req.files.resume
      if(resume){
        const currResumeId = req.user.resume.public_id;
        if(currResumeId){
            await cloudinary.uploader.destroy(currResumeId)
        }

        const newResume = await cloudinary.uploader.upload(resume.tempFilePath,{
            folder: "Job_seekers_resume"
        });

        newData.resume = {
            public_id: newResume.public_id,
            url: newResume.secure_url
        }
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id,newData,{
        new:true,
        runValidators: true, //Makes Mongoose run schema validators during update.
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
        message: "User updated"
    })



})


export const UpdatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new errHandler(400, "Old password is incorrect"));
    }
    
    if (req.body.newPassword !== req.body.confirmPassword) { // Fixed typo here
        return next(new errHandler(400, "Passwords do not match"));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res, "Password updated successfully");
});
