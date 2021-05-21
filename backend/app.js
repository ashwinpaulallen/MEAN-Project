const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const posts = req.body;
  console.log(posts);
  res.status(201).json({
    message: 'Post Added Successfully!!!'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {id: 'PSTID001', title: 'First Post from server', content: 'First Post Content'},
    {id: 'PSTID002', title: 'Second Post from server', content: 'Second Post Content'},
    {id: 'PSTID003', title: 'Third Post from server', content: 'Third Post Content'},
    {id: 'PSTID004', title: 'Fourth Post from server', content: 'Fourth Post Content'},
    {id: 'PSTID005', title: 'Fifth Post from server', content: 'Fifth Post Content'}
  ];
  res.status(200).json({
    message: 'Successfully fetched from Server',
    posts: posts
  });
});

module.exports = app;
