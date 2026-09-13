const express = require("express");
const router = express.Router();

router.post("/login" ,  async(req , res)=>{
 
    const {userName , email , password} = req.body ;
    const userData = await  db.findOne({userName : userName}) ;
    
 
    res.json({msg:"login routes"})
 
})

module.exports = router ;
