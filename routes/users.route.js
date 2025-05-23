const usersRoute = require('express').Router();
const User = require('../models/users.model')
const upload = require('../config/clodinary.config')

usersRoute.get("/", async(req, res)=>{
    const users = await User.find().sort({_id: -1   })

    res.json(users)
})


usersRoute.put("/:id", upload.single("avatar"), async(req,res)=>{
        const id = req.userId
        const {email} = req.body
        const filePath = req.file.path

        await User.findByIdAndUpdate(id, {
            email,
            avatar: filePath
        }, {new: true})
})

module.exports = usersRoute