const { Posts, Likes, sequelize } = require("../models");
const { Transaction } = require("sequelize");
class LikeRepository {
    getLiked = async (userId, _postId) => {
        const getLiked = await Likes.findAll({
            include: [
                {
                    model: "Posts",
                    attributes: [
                        "postId",
                        "userId",
                        "nickname",
                        "title",
                        "content",
                        "createdAt",
                        "updatedAt",
                        "like",
                    ],
                },
            ],
            where: {
                userId: userId,
            },
            attributes: [],
            order: [["Posts", "like", "desc"]],
        }).catch(() => {
            throw new AppError(5008);
        });
        console.log(getLiked);
        return getLiked;
    };

    checkLiked = async (_postId, userId) => {
        const checkLiked = await Likes.findOne({
            where: {
                userId: userId,
                postId: _postId,
            },
        }).catch(() => {
            throw new AppError(5009);
        });
        return checkLiked;
    };

    createLike = async (_postId, userId) => {
        const t = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        try {
            await Likes.create({
                postId: _postId,
                userId: userId,
            });
            await Posts.increment(
                Posts.like,
                {
                    where: {
                        postId: _postId,
                    },
                },
                { transaction: t }
            );
            await t.commit();
        } catch (transactionError) {
            console.log(transactionError);
            await t.rollback();
        }
    };

    destroyLike = async (_postId, userId) => {
        const t = sequelize.transaction({
            isolation: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        try {
            await Likes.destroy(
                {
                    where: {
                        [Op.and]: [{ postId: _postId }, [{ userId: userId }]],
                        //userId array going in postId array
                    },
                },
                { transaction: t }
            );
            await Posts.decrement(
                Posts.like,
                {
                    where: {
                        postId: _postId,
                    },
                },
                { transaction: t }
            );
            await t.commit();
        } catch (transactionError) {
            await t.rollback();
        }
    };
}
module.exports = LikeRepository;
