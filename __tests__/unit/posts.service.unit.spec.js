const PostService = require("../../services/posts.service");

let mockPostsRepository = {
    getPosts: jest.fn(),
    getPost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
};

let postService = new PostService();
// postService의 Repository를 Mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository;

describe("Layered Architecture Pattern Posts Service Unit Test", () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test("Posts Service findAllPost Method", async () => {
        // findAllPost Method를 실행했을 때, Return 값 입니다.
        const findAllPostReturnValue = [
            {
                postId: 1,
                nickname: "Nickname_1",
                title: "Title_1",
                createdAt: new Date("06 October 2011 15:50 UTC"),
                updatedAt: new Date("06 October 2011 15:50 UTC"),
            },
            {
                postId: 2,
                nickname: "Nickname_2",
                title: "Title_2",
                createdAt: new Date("07 October 2011 15:50 UTC"),
                updatedAt: new Date("07 October 2011 15:50 UTC"),
            },
        ];

        // Repository의 findAllPost Method를 Mocking하고, findAllPostReturnValue를 Return 값으로 변경합니다.
        mockPostsRepository.getPosts = jest.fn(() => {
            return findAllPostReturnValue;
        });

        // PostService의 findAllPost Method를 실행합니다.
        const allPost = await postService.getPosts();

        // allPost의 값이 postRepository의 findAllPost Method 결과값을 내림차순으로 정렬한 것이 맞는지 검증합니다.
        expect(allPost).toEqual(
            findAllPostReturnValue.sort((a, b) => {
                return b.createdAt - a.createdAt;
            })
        );

        // PostRepository의 findAllPost Method는 1번 호출되었는지 검증합니다.
        expect(mockPostsRepository.getPosts).toHaveBeenCalledTimes(1);
    });

    test("Posts Service deletePost Method By Success", async () => {
        // postRepository의 findPostById Method Return 값을 설정하는 변수입니다.
        const findPostByIdReturnValue = {
            postId: 1,
            userId: "hawook",
            nickname: "Nickname_1",
            title: "Title_1",
            content: "Content_1",
            createdAt: new Date("06 October 2011 15:50 UTC"),
            updatedAt: new Date("06 October 2011 15:50 UTC"),
        };

        // Mock Post Repository의 findPostById Method의 Return 값을 findPostByIdReturnValue 변수로 변경합니다.
        mockPostsRepository.getPost = jest.fn(() => {
            return findPostByIdReturnValue;
        });

        const deletePost = await postService.deletePost(1, "hawook");

        /** deletePost의 비즈니스 로직**/
        // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
        // 2. postId, password를 이용해 게시글을 삭제한다. (PostRepository.deletePost)
        // 3. 해당 Method의 Return 값이 내가 원하는 형태인지 확인한다.

        // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
        expect(mockPostsRepository.getPost).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.getPost).toHaveBeenCalledWith(
            findPostByIdReturnValue.postId
        );

        // 2. postId, password를 이용해 게시글을 삭제한다. (PostRepository.deletePost)
        expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(
            findPostByIdReturnValue.postId
        );
    });

    test("Posts Service deletePost Method By Not Found Post Error", async () => {
        // findPostById Method를 실행했을 때, 아무런 Post를 찾지 못하도록 수정합니다.
        const findPostByIdReturnValue = null;

        // Mock Post Repository의 findPostById Method의 Return 값을 findPostByIdReturnValue 변수(null)로 변경합니다.
        mockPostsRepository.getPost = jest.fn(() => {
            return findPostByIdReturnValue;
        });

        /** deletePost의 비즈니스 로직**/
        // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
        // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");

        try {
            const deletePost = await postService.deletePost(8888, "1234");
        } catch (error) {
            // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
            expect(mockPostsRepository.getPost).toHaveBeenCalledTimes(1);
            expect(mockPostsRepository.getPost).toHaveBeenCalledWith(8888);

            // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");
            //     expect(error.message).toEqual("Post doesn't exist");
        }
    });
});
