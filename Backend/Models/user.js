import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { validate } from "node-cron";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:[3,"Name must be atleast 3 characters"]
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail,"please provide valid email"]
    },
    phone:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    domains:{
        firstDomain: String,
        secondDomain: String,
        thirdDomain: String,
    },
    password:{
        type: String,
        required: true,
        minLength: [8,"minimum 8"],
        select: false
    },
    resume:{
        public_id :String,
        url:String
    },
    coverLetter:{
        type: String
    },
    role:{
        type: String,
        required: true,
        enum: ["Employee","Employer"]
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

});



userSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,5)
})


userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: "5h",
    })
}



export const User = mongoose.model("User",userSchema)





