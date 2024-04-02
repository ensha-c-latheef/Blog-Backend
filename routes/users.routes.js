const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/", isAuthenticated, (req, res, next ) => {
  const userId = req.payload._id;
  User.findById(userId)
  .then(foundUser => {
    const { _id, name, phoneNumber} = foundUser;
    const resPayload = { _id, name, phoneNumber };
    res.json(resPayload);
  })
  .catch(next)
})


router.put("/", isAuthenticated, (req, res, next ) => {
  const userId = req.payload._id;
  const { name,  phoneNumber, } = req.body;
  User.findByIdAndUpdate(userId, { name, phoneNumber })
  .then(foundUser => {
    const { _id } = foundUser;
    const resPayload = { _id, name,  phoneNumber,  };
    res.json(resPayload);
  })
  .catch(next)
})




module.exports = router;
