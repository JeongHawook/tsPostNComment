const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middlewares/auth-middleware");
const CommentController = require("../controllers/comments.controller");
const commentController = new CommentController();

router.get("/", commentController.getCommets);
router.post("/", authMiddleware, commentController.createComment);
router.put("/:_commentId", authMiddleware, commentController.updateComment);
router.delete("/:_commentId", authMiddleware, commentController.deleteComment);

module.exports = router;
