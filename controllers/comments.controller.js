const CommentService = require("../services/comments.service");

const { commentSchema } = require("../utils/joi");
class CommentController {
    commentService = new CommentService();

    getCommets = async (req, res) => {
        const { _postId } = req.params;

        const getComments = await this.commentService.getComments(_postId);

        res.status(200).json({ getComments });
    };

    createComment = async (req, res) => {
        const { _postId } = req.params;
        const { userId, nickname } = res.locals.user;
        const { comment } = await commentSchema
            .validateAsync(req.body)
            .catch((error) => {
                return res.status(412).json(error.message);
            });

        //let sendBox = { _postId, userId, nickname, comment };
        //await this.commentService.createComment(sendBox); 속도 vs 가독성의 문제
        await this.commentService.createComment(
            _postId,
            userId,
            nickname,
            comment
        );
        res.status(200).json({ message: "댓글 생성 성공" });
    };
    updateComment = async (req, res) => {
        const { userId } = res.locals.user;
        const { _postId, _commentId } = req.params;
        const { comment } = await commentSchema
            .validateAsync(req.body)
            .catch((error) => {
                return res.status(412).json(error.message);
            });

        await this.commentService.updateComment(
            userId,
            _postId,
            _commentId,
            comment
        );

        return res.status(200).json({ message: "댓글 수정 성공" });
    };
    deleteComment = async (req, res) => {
        const { userId } = res.locals.user;
        const { _commentId, _postId } = req.params;

        await this.commentService.deleteComment(userId, _commentId, _postId);

        res.status(200).json({ message: "댓글 삭제 성공" });
    };
}
module.exports = CommentController;
