const jwt = require("jsonwebtoken")
require("dotenv").config()


const isAuth = async(req, res, next)=>{
    const headers = req.headers['authorization']
    if(!headers){
        return res.status(401).json({message: "you dont have permission to access this resource"})
    }

    const [type, token] = headers.split(' ')

    try{
        const payload = await jwt.verify(token, process.env.JWT_SECRET)
        req.userId = payload.userId

        next()
    }
    catch(err){
        return res.status(401).json({message: "you dont have permission to access this resource"})
    }
}

module.exports = isAuth