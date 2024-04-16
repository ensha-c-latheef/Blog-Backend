const express = require("express");
const router = express.Router();

const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/", fileUploader.single("image"), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded!');
  }
  res.json({ image: req.file.path });
});

module.exports = router;
