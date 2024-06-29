const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Post = require('../models/posts'); // Adjust the path to your Post model as necessary
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once('open', () => {
  // Initialize stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads', // Collection name in MongoDB
    };
  },
});

const upload = multer({ storage });

// Upload a new file and schedule a post
router.post('/projects/schedules', upload.single('file'), async (req, res) => {
  try {
    const { content, scheduledTime, platform, tags, userDetails } = req.body;

    const post = new Post({
      content,
      scheduledTime,
      platform,
      file: req.file.id, // Store the file ID from GridFS
      tags,
      userDetails,
    });

    await post.save();
    res.status(201).json({ message: 'Post scheduled successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get scheduled posts
router.get('/projects/schedules', async (req, res) => {
    
  try {
    const { userIds, platforms } = req.query;

    const posts = await Post.find({
      'userDetails.username': { $in: userIds }, // Filtering by usernames
      platform: { $in: platforms }, // Filtering by platforms
    });

    const postsWithFiles = await Promise.all(
      posts.map(async (post) => {
        if (post.file) {
          const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(post.file) });
          if (file) {
            post = post.toObject();
            post.fileURL = `/file/${post.file}`;
          }
        }
        return post;
      })
    );

    res.status(200).json(postsWithFiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Get a specific file from GridFS
router.get('/file/:id', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'No file found' });
    }

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

module.exports = router;
