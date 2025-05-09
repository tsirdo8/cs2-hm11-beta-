
const postRoute = require('express').Router();
const { isValidObjectId } = require('mongoose');
const Post = require('../models/posts.model');

postRoute.get("/", async (req, res) => {
 
  const { page = 1, limit = 10 } = req.query;
  
  
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  
  const skip = (pageNumber - 1) * limitNumber;

  try {
    
    const posts = await Post.find()
      .skip(skip) 
      .limit(limitNumber) 
      .sort({ _id: -1 })
      .populate('author', 'name email');

    
    const totalPosts = await Post.countDocuments();

    
    res.json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limitNumber), 
      currentPage: pageNumber, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});


postRoute.post("/", async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = await Post.create({
      title,
      content,
      author: req.userId
    });
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

postRoute.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post id' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You don’t have permission to update this post' });
    }

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    await post.save();

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
});

postRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid post id' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You don’t have permission to delete this post' });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
});

module.exports = postRoute;
