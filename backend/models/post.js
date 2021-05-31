const { stringify } = require('@angular/compiler/src/util');
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, require: true},
  content: {type: String, require: true},
  imagePath: {type: String, require: true},
  createID: {type: mongoose.Schema.Types.ObjectId, ref: "User",require: true}
});

module.exports = mongoose.model('Post', postSchema);
