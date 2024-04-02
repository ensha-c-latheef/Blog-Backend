const router = require("express").Router();
const mongoose = require("mongoose");
const Post = require("../models/Post.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//  POST /posts  -  Creates a new blog
router.post("/", isAuthenticated, (req, res, next) => {
    const { title, content, thumbnailImageUrl, coverImageUrl,} = req.body;
      const author = req.payload._id;
    Post.create({ title, content, thumbnailImageUrl, coverImageUrl, author })
      .then(response => res.json(response))
      .catch(err => res.json(err));
  });

//GET - list all posts
  router.get("/", (req, res, next) => {
    Post.find()
      // .populate('tasks')
      .then(allPosts => res.json(allPosts))
      .catch(err => res.json(err));
  });
  
  // SHOW A Post
router.get("/:postId", (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Post.findById(postId)
    .populate("author")
    // .populate({
    //   path: "reviews",
    //   populate: {
    //     path: "author",
    //   },
      // options: { sort: {'createdAt': 'desc'} },
    
    .then((post) => res.status(200).json(post))
    .catch((error) => res.json(error));
});

// EDIT A CAKE
router.put("/:postId", isAuthenticated, (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Post.findByIdAndUpdate(postId, req.body, { new: true })
    .then((updatedPost) => res.json(updatedPost))
    .catch((error) => res.json(error));
});

// DELEATE A CAKE
router.delete("/:postId", isAuthenticated, (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Post.findByIdAndDelete(postId)
        .then(() => {
          res.json({
            message: `Post with ${postId} is removed successfully.`,
          })
        })
        .catch((error) => res.json(error));
});
  module.exports = router;