const express = require('express');
const router = express.Router();

const Post = require('../models/post');

router.post("", (req, res, next) => {
  const posts = new Post({
    title: req.body.title,
    content: req.body.content
  });
  posts.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Post Added Successfully!!!',
      postID: result._id
    });
    });
});

router.put('/:id', (req, res, next) => {
  const  post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then((result) => {
    console.log(result);
    res.status(200).json({message: "Update Successful!"});
  });
});

router.get("", (req, res, next) => {
  const posts = [];
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Successfully fetched from Server',
      posts: documents
    });
  });

});

router.get('/:id', (req, res, next) =>{
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post Not Found!!'});
    }
  });
});

router.delete('/:id', (req, res, next) =>{
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Successfully Deleted the Post'});
  });
});

module.exports = router;
