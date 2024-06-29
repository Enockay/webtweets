const express = require('express');
const mongoose = require('mongoose');
const GridFSBucket = require('mongodb').GridFSBucket;
const Post = require('../models/posts'); // Adjust the path to your Post model as necessary
const router = express.Router();
const multer = require('multer');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

let gfsBucket;
conn.once('open', () => {
  // Initialize GridFSBucket
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  console.log('Connected to MongoDB and GridFS initialized');
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a new file and schedule a post
router.post('/projects/schedules', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('File upload failed');
    }

    const { content, scheduledTime, platform, tags, userDetails ,state} = req.body;
   // console.log('Request body:', req.body);
   // console.log('Uploaded file details:', req.file);

    const writestream = gfsBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        encoding: req.file.encoding,
      }
    });

    writestream.on('finish', async () => {
      console.log('File written to GridFS with ID:', writestream.id);
      const post = new Post({
        state,
        content,
        scheduledTime,
        platform,
        file: writestream.id, // Store the file ID from GridFS
        tags,
        userDetails: JSON.parse(userDetails),
      });

      await post.save();
      res.status(201).json({ message: 'Post scheduled successfully', post });
    });

    writestream.write(req.file.buffer);
    writestream.end();
  } catch (error) {
    console.error('Error in post scheduling:', error); // Log the error for debugging
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
          const file = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(post.file) }).toArray();
          if (file.length > 0) {
            post = post.toObject();
            post.fileURL = `/file/${post.file}`;
          }
        }
        return post;
      })
    );

    res.status(200).json(postsWithFiles);
  } catch (error) {
    console.error('Error fetching schedules:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Get a specific file from GridFS
router.get('/file/:id', async (req, res) => {
  try {
    const file = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(req.params.id) }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'No file found' });
    }

    const readStream = gfsBucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
    readStream.pipe(res);
  } catch (error) {
    console.error('Error retrieving file:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

module.exports = router;
