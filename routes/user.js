const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");

const userController = new UserController();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

module.exports = router;
