const PostRepository = require("../repositories/posts.repository");

const { Posts } = require("../models");
class PostService {
    postRepository = new PostRepository(Posts);

    getPosts = async () => {
        try {
            const getPosts = await this.postRepository.getPosts();
            if (getPosts.length < 1) throw new AppError(4022); //{}
            return getPosts;
        } catch (error:any) {
            console.log(error);
            throw new AppError(error.errorCode || 4000);
            //고집부리기:  좋은점: 수정이 쉽다, 추가도 쉽다, 나중에 찾기도 쉽다, 간결하다, 확장성 재사용성. 이걸 못쓰게 날 더 설득해주세요
        }
    };
    getPost = async (_postId: Post) => {
        try {
            const getPost = await this.postRepository.getPost(_postId);
            if (!getPost) throw new AppError(4022);
            return getPost;
        } catch (error: any) {
            throw new AppError(error.errorCode || 4000);
        }
    };

    createPost = async (post:Post) => {
        try {
            await this.postRepository.createPost(
                post.title,
                post.content,
                post.userId,
                post.nickname
            );
        } catch (error: any) {
            throw new AppError(error.errorCode || 4001);
        }
    };

    authorize = async (post:Post) => {
        const getPost = await this.postRepository.getPost(post._postId);
        if (!getPost) throw new AppError(4022);
        return getPost.userId === post.userId;
    };
    updatePost = async (post:Post) => {
        try {
            const authorize = await this.authorize(post);

            if (authorize === true) {
                await this.postRepository.updatePost(
                    post.title,
                    post.content,
                    post._postId,
                    post.userId
                );
            } else {
                throw new AppError(4018);
            }
        } catch (error: any) {
            console.log(error );
            throw new AppError(error.errorCode || 4002);
        }
    };

    deletePost = async (_postId, userId) => {
        const authorize = await this.authorize(_postId, userId);
        if (authorize === true) {
            await this.postRepository.deletePost(_postId);
        } else {
            throw new AppError(4019);
        }
    };
}

module.exports = PostService;
