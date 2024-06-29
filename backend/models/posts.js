const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
  username: { type: String },
  followers: { type: Number },
  likes: { type: Number },
  profileImageUrl: { type: String },
}, { _id: false });

const postSchema = new mongoose.Schema({
  content: { type: String, required: false },
  scheduledTime: { type: Date, required: true },
  platform: { type: String, required: true },
  file: { type: String },
  tags: { type: String, required: false},
  status:{type:String,required:true},
  userDetails: { type: socialMediaSchema, required: true },
});





module.exports = mongoose.model('Post', postSchema);
