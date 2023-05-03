import { Request, Response } from 'express';
const PostService = require("../services/posts.service");
const LikeService = require("../services/likes.service");

import { postSchema } from "../utils/joi";

class PostController {

    postService = new PostService();
    likeService = new LikeService();

    getAllPosts = async (req:Request, res:Response) => {

        const getPosts = await this.postService.getPosts();

        return res.status(200).json({ posts: getPosts });
    };

    getOnePost = async (req:Request, res:Response) => {

        const { _postId } = req.params;

        const getPost = await this.postService.getPost(_postId);

        return res.status(200).json({ post: getPost });
    };

    createPost = async (req:Request, res:Response) => {
        const { title, content } =  await postSchema
        .validateAsync(req.body, { abortEarly: false })
        .catch((error) => {
            return res.status(412).json(error.message);
              }); //굳이 throw까지 갈 이유가 없음 joi에서 메세지를 보내니
 
        const { userId, nickname } = res.locals.user;

        await this.postService.createPost(title, content, userId, nickname);
            return res
                .status(201)
                .json({ message: "게시글 작성에 성공하였습니다" });
  
    };

    updatePost = async (req:Request, res:Response) => {
        const { title, content } = await postSchema
        .validateAsync(req.body)
        .catch((error) => {
            return res.status(412).json(error.message);
        });

        const { userId } = res.locals.user;
        const { _postId } = req.params;

        await this.postService.updatePost(title, content, _postId, userId); //
        
        return res
        .status(200)
        .json({ message: "게시글을 수정하였습니다." });
    };

    deletePost = async (req:Request, res:Response) => {
        try {
            const { userId } = res.locals.user;
            const { _postId } = req.params;

            await this.postService.deletePost(_postId, userId);
            return res
                .status(200)
                .json({ message: "게시글을 삭제하였습니다." });
        } catch (error: any) {
            console.log(error)
            throw new AppError(error.errorCode || 4010);
        }
    };

    getLiked = async (req:Request, res:Response) => {
        try {
            const { userId } = res.locals.user;
            const { _postId } = req.params;

            await this.likeService.getLiked(userId, _postId);
        } catch (error: any) {
            throw new AppError(error.errorCode || 4005);
        }
    };

    postLike = async (req:Request, res:Response) => {
        const { _postId } = req.params;
        const { userId } = res.locals.user;
        try {
            const postLike = await this.likeService.postLiked(_postId, userId);

            postLike == 0
                ? res
                      .status(200)
                      .json({ message: "게시글에 좋아요를 눌렀습니다." })
                : res
                      .status(200)
                      .json({ message: "게시글에 좋아요를 취소하였습니다." });
        } catch (error: any){
            throw new AppError(error.errorCode || 4004);
        }
    };
}
module.exports = PostController;
