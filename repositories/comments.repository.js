const { Comments } = require("../models");

class CommentRepository {
    getComments = async (_postId) => {
        const getComments = await Comments.findAll({
            where: {
                postId: _postId,
            },
            order: [["createdAt", "DESC"]],
        }).catch((error) => {
            console.log(error);
            throw new AppError(5004);
        });
        return getComments;
    };

    createComment = async (_postId, userId, nickname, comment) => {
        await Comments.create({
            postId: _postId,
            userId: userId,
            nickname: nickname,
            comment: comment,
        }).catch((error) => {
            console.log(error);
            throw new AppError(5005);
        });
    };

    updateComment = async (_commentId, comment) => {
        console.log(_commentId, comment);
        await Comments.update(
            { comment: comment },
            {
                where: { commentId: _commentId },
            }
        ).catch((error) => {
            console.log(error);
            throw new AppError(5006);
        });
    };
    deleteComment = async (_commentId) => {
        await Comments.destroy({ where: { commentId: _commentId } }).catch(
            (error) => {
                throw new AppError(5007);
            }
        );
    };
    getOneComment = async (_commentId) => {
        console.log(_commentId);
        const getOneComment = await Comments.findByPk(_commentId).catch(
            (error) => {
                throw new AppError(5004);
            }
        );

        return getOneComment;
    };
}
module.exports = CommentRepository;
