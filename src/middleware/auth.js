const jwt = require('jsonwebtoken')
const User = require("../models/user")


const auth =  async(req,res,next )=> {

    try{
        const token = req.header("Authorization").replace('Bearer ', '')
        const decoded = jwt.verify( token,"thisisnew")
        console.log(decoded)
        const user = await User.find({ _id :decoded._id , 'tokens.token' : token }  )

        if(!user)
        {
            throw new Error (_)
        }
        req.user = user;
        next()
    }catch(e)
    {
        res.status(401).send({error : "Not Authorized"});
    }

}

module.exports  = auth;