const CommentRepository = require("../repositories/comments.repository");
const PostRepository = require("../repositories/posts.repository");

class CommentService {
    commentRepository = new CommentRepository();
    postRepository = new PostRepository();
    getComments = async (_postId) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            const getComments = await this.commentRepository.getComments(
                _postId
            );
            if (getComments.length < 1) throw new AppError(4007);

            // getComments.map((comment)=>{

            // })
            return getComments;
        } catch (error) {
            console.log(error);
            throw new AppError(error.errorCode || 4008);
        }
    };
    createComment = async (_postId, userId, nickname, comment) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            await this.commentRepository.createComment(
                _postId,
                userId,
                nickname,
                comment
            );
        } catch (error) {
            console.log(error);
            throw new AppError(error.errorCode || 4009);
        }
    };

    authorize = async (_commentId, userId) => {
        const authorize = await this.commentRepository.getOneComment(
            _commentId
        );
        if (!authorize) throw new AppError(4007);

        return authorize.userId === userId ? true : false;
    };

    updateComment = async (userId, _postId, _commentId, comment) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            const auth = await this.authorize(_commentId, userId);
            if (auth === false) throw new AppError(4018);

            await this.commentRepository.updateComment(_commentId, comment);
        } catch (error) {
            console.log(error);
            throw new AppError(error.errorCode || 4012);
        }
    };
    deleteComment = async (userId, _commentId, _postId) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            const auth = await this.authorize(_commentId, userId);
            if (auth === false) throw new AppError(4018);

            await this.commentRepository.deleteComment(_commentId);
        } catch (error) {
            throw new AppError(error.errorCode || 4010);
        }
    };
}
module.exports = CommentService;
