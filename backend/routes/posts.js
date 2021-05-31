const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mine Type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/image");

  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});



router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const posts = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/image/' + req.file.filename,
    createID: req.userDetails.id
  });

  posts.save().then(result => {
    res.status(201).json({
      message: 'Post Added Successfully!!!',
      post: {
        ...result,
        id: result._id
      }
    });
    });
});

router.put('/:id', checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  let url = req.protocol + '://' + req.get("host");
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + '/image/' + req.file.filename;
  }
  const  post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    createID: req.userDetails.id
  });

  Post.updateOne({_id: req.params.id, createID: req.userDetails.id}, post).then((result) => {
    console.log(result);
    if (result.nModified > 0) {
      res.status(200).json({message: "Update Successful!"});
    } else {
      res.status(401).json({message: "UnAuthorized to Edit Post!!"});
    }
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currPage = +req.query.currPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currPage) {
    postQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
  }
  postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments({});
    })
    .then( count => {
      res.status(200).json({
        message: 'Successfully fetched from Server',
        posts: fetchedPosts,
        totalPosts: count
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

router.delete('/:id', checkAuth, (req, res, next) =>{
  Post.deleteOne({_id: req.params.id, createID: req.userDetails.id}).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: 'Successfully Deleted the Post!'});
    } else {
      res.status(401).json({message: "UnAuthorized to Delete Post!!"});
    }
  });
});

module.exports = router;
