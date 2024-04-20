const router = require("express").Router();
const mongoose = require("mongoose");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const Like = require("../models/Like.model");

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
    .then((post) => {
      Comment.find({ post: postId })
        .sort({ createdAt: 'desc' })
        .populate('author')
        .then((comments) => {
          Like.find({ post: postId })
            .sort({ createdAt: 'desc' })
            .populate('author')
            .then((likes) => {
              res.status(200).json({ ...post.toJSON(), comments, likes });

            })
            .catch((error) => res.json(error));
        })
        .catch((error) => res.json(error));
    })
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
      Comment.deleteMany({ post: postId })
        .then(() => {
          res.json({
            message: `Post with ${postId} is removed successfully.`,
          })
        })
        .catch((error) => res.json(error));
    })
    .catch((error) => res.json(error));
});

 /* POST - add comment */
 router.post("/:postId/comment", isAuthenticated, (req, res, next) => {
  const author = req.payload._id;
  const post = req.params.postId;
  const comment = req.body.comment;
  Comment.create({
    author,
    post,
    comment,
  })
  .then((newComment) => {
    res.status(200).json(newComment);
  })
  .catch((error) =>
    console.log(`Error while creating a new comment for post: ${error}`)
  );
});

// EDIT A comment
router.put("/comments/:commentId", isAuthenticated, (req, res, next) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified commentId is not valid" });
    return;
  }

  Comment.findByIdAndUpdate(commentId, { comment })
    .then((updated) => res.status(204).json({ message: "comment updated" }))
    .catch((error) => res.json(error));
});



 /* POST - add like */
 router.post("/:postId/like", isAuthenticated, (req, res, next) => {
  const author = req.payload._id;
  const post = req.params.postId;
  const hasLiked = req.body.hasLiked;
  Like.findOneAndUpdate(
    {
      author,
      post,
    },
    {
      $set: { hasLiked }
    },
    { upsert: true, new: true }
  )
  .then((likeDoc) => {
    res.status(200).json(likeDoc);
  })
  .catch((error) =>
    console.log(`Error while creating a new comment for post: ${error}`)
  );
});

// DELETE  comment
router.delete('/comments/:commentId', (req, res, next) => {
  const { commentId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Comment.findByIdAndDelete(commentId)
    .then(() => res.json({ message: `Comment with ${commentId} is removed successfully.` }))
    .catch(error => res.json(error));
});
 

  module.exports = router;