import {asyncHandler} from "../Middlewares/asyncHandler.js"
import { errorMiddleware } from "../Middlewares/errormiddleware.js"
import { errHandler } from "../Middlewares/errormiddleware.js";
import { Job } from "../Models/job.js";
import {User} from "../Models/user.js"

export const PostJob = asyncHandler(async (req, res, next) => {
    console.log(req.body);  // Log the incoming data

    const {
        title,
        jobType,
        location,
        companyName,
        qualification,
        responsibilities,
        introduction,
        hiringMultiple,
        offers,
        salary,
        personalWebsiteTitle,
        personalWebsiteUrl,
        jobDomain,
        newsLettersSend
    } = req.body;

    // Log each field to see what is missing
    console.log({ title, jobType, location, companyName, qualification, responsibilities, introduction, salary, jobDomain });

    if (!title || 
        !jobType ||
        !location || 
        !companyName || 
        !qualification || 
        !responsibilities || 
        !introduction || 
        !salary || 
        !jobDomain
    ) {
        return res.status(400).json({ error: "All required fields must be filled" });
    }

    if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
        return res.status(400).json({ error: "Both personalWebsiteTitle and personalWebsiteUrl are required if one is provided" });
    }

    const postedBy = req.user._id;

    try {
        const job = await Job.create({
            title,
            jobType,
            location,
            companyName,
            qualification,
            responsibilities,
            introduction,
            hiringMultiple,
            offers,
            salary,
            personalWebsite: {
                title: personalWebsiteTitle,
                url: personalWebsiteUrl
            },
            jobDomain,
            postedBy,
        });

        res.status(201).json({
            success: true, 
            message: "Job posted successfully",
            job
        });
    } catch (error) {
        console.error('Error creating job:', error);  // Log the error for debugging
        return res.status(500).json({ error: 'Internal server error' });
        console.log(error.message);
    }
});

// http://localhost:5173/blog/asdfkbskhbcjh?keyword=IT --> so part next to this keyword is query 
export const getAllJobs = asyncHandler(async(req,res,next) =>{
    const {city, domain, searchKeyword} = req.query;
    const query = {};
    if(city){
        query.location = city; //add new object in query
    }
    if(domain){
        query.jobDomain = domain;
    }

    // this serachs keywords in respective fields ||
    if(searchKeyword){
        query.$or =[
            {title: {$regex: searchKeyword,$options: "i"}},
            {companyName: {$regex :searchKeyword, $options: "i"}}, // "i" is for case insensitive
            {introduction: {$regex :searchKeyword, $options: "i"}} // "i" is for case insensitive
        ];
    }

    const jobs = await Job.find(query);
    res.status(200).json({
        success: true,
        jobs,
        count: jobs.length,
    })
})

export const getMyJobs = asyncHandler(async(req,res,next)=>{
    const myJob = await Job.find({postedBy: req.user._id});
    res.status(200).json({
        success: true,
        myJob
    })
});


export const deleteJob = asyncHandler(async(req,res,next)=>{
   const {id} = req.params;
   const job = await Job.findById(id);

   if(!job){
    return next(new errHandler(404,"Job not Found"))
   }

   await job.deleteOne();
   res.status(200).json({
    success: true,
    message: "job deleted"
   })

})

export const getSinglejob = asyncHandler(async(req,res,next) => {
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return next(new errHandler(404,"Job not found"));
    }
    res.status(200).json({
        success: true,
        job,
    })
})



