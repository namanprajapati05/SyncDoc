const {jwt} = require("jsonwebtoken");
const {ApiError} = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

const authmiddleware = asyncHandler((req , res , next)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("bearer ")){
        throw new ApiError(401 , "Access Token is required");
    }

    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );

    req.user = decode ;

    next();

})


module.exports = {authmiddleware} ;