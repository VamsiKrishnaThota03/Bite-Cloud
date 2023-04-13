const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "HelloIAmVamsiKrishna";


router.post(
  "/createUser",
  [
    body("email").isEmail(),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      try {
        let user1 = await User.findOne({email});
        if(user1){
          return res.status(400).json({error:"user already exists"});
        }
        const user = new User({
          name: req.body.name,
          password: securePassword,
          email: req.body.email,
          location: req.body.location,
        });
        await user.save();
        return res.json({ success: true });
      } catch (err) {
        console.log(err);
        res.json({ success: false });
      }
    }
  }
);


router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {

    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(404).json({ error: "Invalid Credentials1" });
      }
      const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
      if (!pwdCompare){
        return res.status(404).json({ error: "Invalid Credentials2" });
      }

      const data = {
        user:{
            id:userData.id
        }
      }
      const authToken = jwt.sign(data,jwtSecret);
      return res.json({ success: true, authToken:authToken });
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
  }
);

module.exports = router;
