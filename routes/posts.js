const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

//GET BACK ALL THE POSTS
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
      res.json({ message: err });
    }
});

//SUBMITS A POST
router.post('/', async (req,res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
   });
   try {
       const savedPost = await post.save();
       res.json(savedPost);
   } catch (err) {
       res.json({ message: err });
   }
});
//Specific POST
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  }catch(err) {
    res.json({ message: err });
  }
});

//Delete Post
router.delete('/:postId', async (req, res) => {
  try {
    const removePost = await Post.remove({_id: req.params.postId })
    res.json(removePost);
  }catch(err) {
    res.json({ message: err });
  }
} );

//Update a post
router.patch('/:postId', async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
        { _id: req.params.postId },
        { $set: { title: req.body.title }}
      );
    res.json(updatedPost);
  }catch(err) {
    res.json({ message: err });
  }
} );

module.exports = router;
