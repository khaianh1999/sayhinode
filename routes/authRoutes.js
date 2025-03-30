const express = require("express");
// const passport = require("../auth");
const passport = require("../config/passport");


const router = express.Router();

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/profile",
    failureRedirect: "/",
  })
);

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");
  res.json(req.user);
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
