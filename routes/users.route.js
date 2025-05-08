const usersRoute = require('express').Router();
const User = require('../models/users.model')


usersRoute.get("/", async(req, res)=>{
    const users = await User.find().sort({_id: -1   })

    res.json(users)
})



module.exports = usersRoute