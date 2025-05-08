const postRoute = require('express').Router()
const { isValidObjectId } = require('mongoose');
const Post = require('../models/posts.model');


postRoute.get("/", async(req, res)=>{
    const posts = await Post.find().sort({_id: -1}).populate('author', 'name email ',)
    res.json(posts)
}
)


postRoute.post("/", async(req,res)=>{
    const {title, content} = req.body
    await Post.create({
        title,
        content,
        author: req.userId
    })
    
    res.status(201).json({message: "Post created successfully"})
}
)


postRoute.delete("/:id", async(req,res)=>{
    const {id} = req.params
    if(isValidObjectId(id)){
        return res.status(400).json({message: "Invalid post id"})
    }

    const post = await Post.findById(id)
    if(post.author.toString() !== req.userId){
        return res.status(403).json({message: "You dont have permission to delete this post"})
    }

    await Post.findByIdAndDelete(id)
    res.status(200).json({message: "Post deleted successfully"})

})


module.exports = postRoute