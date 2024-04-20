const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/", isAuthenticated, (req, res, next ) => {
  const userId = req.payload._id;
  User.findById(userId)
  .then((foundUser) => {
    const { _id, name, phoneNumber, imageUrl} = foundUser || {};
    const resPayload = { _id, name, phoneNumber,imageUrl};
    res.json(resPayload);
  })
  .catch(next)
})


router.put("/", isAuthenticated, (req, res, next ) => {
  const userId = req.payload._id;
  const { name,  phoneNumber,imageUrl } = req.body;
  User.findByIdAndUpdate(userId, { name, phoneNumber,imageUrl })
  .then(foundUser => {
    const { _id } = foundUser;
    const resPayload = { _id, name,  phoneNumber,imageUrl  };
    res.json(resPayload);
  })
  .catch(next)
})




module.exports = router;
