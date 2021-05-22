const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://ashwin:GBQORbI9ARJBEp1u@cluster0.kekn1.mongodb.net/MEAN-Project?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Connected to Database!');
})
.catch(() => {
  console.log('Connection to Database Failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const posts = new Post({
    title: req.body.title,
    content: req.body.content
  });
  posts.save();
  console.log(posts);
  res.status(201).json({
    message: 'Post Added Successfully!!!'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [];
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Successfully fetched from Server',
      posts: documents
    });
  });

});

module.exports = app;
