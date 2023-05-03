const LikeRepository = require("../repositories/likes.repository");

class LikeService {
    likeRepository = new LikeRepository();

    getLiked = async (userId, _postId) => {
        const getLiked = await this.likeRepository.getLiked(userId, _postId);

        const posts = getLiked.map((likePosts) => ({
            postId: likePosts.Post.postId,
            userId: likePosts.Post.UserId,
            nickname: likePosts.Post.nickname,
            title: likePosts.Post.title,
            createdAt: likePosts.Post.createdAt,
            updatedAt: likePosts.Post.updatedAt,
            likes: likePosts.Post.like,
        }));
        return posts;
    };
    //postLiked..안에 넣어도될까? 밖에 두는게 좋을까?
    authorization = async (_postId, userId) => {
        const checkLiked = await this.likeRepository.checkLike(_postId, userId);
        return checkLiked ? true : false;
    };
    postLiked = async (_postId, userId) => {
        const check = await this.authorization(_postId, userId);
        if (check !== true) {
            const creatLike = await this.likeRepository.createLike(
                _postId,
                userId
            );
            return 0;
        } else {
            const destroyLike = await this.likeRepository.destroyLike(
                _postId,
                userId
            );
            return 1;
        }
    };
}
module.exports = LikeService;
