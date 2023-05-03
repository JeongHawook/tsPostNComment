"use strict";
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const PostController = require("../controllers/posts.controller");
const postController = new PostController();

router.get("/", postController.getAllPosts);
router.get("/:_postId/like", authMiddleware, postController.getLiked);
router.get("/:_postId", postController.getOnePost);
router.post("/", authMiddleware, postController.createPost);
router.put("/:_postId", authMiddleware, postController.updatePost);
router.delete("/:_postId", authMiddleware, postController.deletePost);

module.exports = router;
