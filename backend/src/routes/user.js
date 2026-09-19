const express = require("express");
const { hashPassword , comparePassword } = require("../utils/password");
const router = express.Router();
const {User} = require("../models/user")
const {ApiResponse} = require("../utils/ApiResponse")
const {asyncHandler} = require("../utils/asyncHandler")
const {ApiError} = require("../utils/ApiError")


//signup 

router.post("/signup" , 
    
   asyncHandler( async(req , res)=>{

    const  {name , email , password ,avatar}  = req.body ;
    
    const newPassword = await hashPassword(password) ;
     
    const userData = new User({
        name ,
        email,
        password : newPassword ,
        avatar 
    })

  await userData.save()


return res.status(201).json(
      new ApiResponse(
                201,
                userData,
                "User registered successfully"
    )
)
 
}))

//login 

router.post(
    "/login" , 
    asyncHandler( async(req , res)=>{
 
    const { email , password} = req.body ;
    const user = await User.findOne({email:email}) ;

    if(!user){

       throw new ApiError(
                404,
                "User is not found"
            );
    }
    
     const isPasswordCorrect = await comparePassword(
            password,
            user.password
        );

    if(! isPasswordCorrect){
        throw new ApiError(
              401,
            "Password is wrong"
        )
   }

   return res.status(200).json(
    new ApiResponse(
        200 ,
        user.name ,
        "User login successful"
    )
)
    
}) )



module.exports = router ;
