const PostRepository = require("../../repositories/posts.repository");
const AppError = require("../../utils/appError");

// posts.repository.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostsModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
};

let postRepository = new PostRepository(mockPostsModel);

describe("Layered Architecture Pattern Posts Repository Unit Test", () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test("getPosts Repository getPosts Method w/o error", async () => {
        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockPostsModel.findAll = jest.fn().mockResolvedValue("string");

        // postRepository의 findAllPost Method를 호출합니다.
        const posts = await postRepository.getPosts();
        console.log(posts);
        // postsModel의 findAll은 1번만 호출 되었습니다.
        expect(postRepository.postModel.findAll).toHaveBeenCalledTimes(1);

        // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
        expect(posts).toBe("string");
    });

    test("getPosts Repository getPosts Method w/ error", async () => {
        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockPostsModel.findAll = jest
            .fn()
            .mockRejectedValue(new AppError(5000));
        try {
            await postRepository.getPosts();
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.errorCode).toBe(5000);
            expect(postRepository.postModel.findAll).toHaveBeenCalledTimes(1);
        }
    });

    test("Posts Repository createPost Method w/o error", async () => {
        // create Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockPostsModel.create = jest.fn().mockResolvedValue();

        // createPost Method를 실행하기 위해 필요한 Params 입니다.
        const createPostParams = {
            title: "createPostTitle",
            content: "createPostContent",
            userId: "createUserId",
            nickname: "createPostNickname",
        };

        // postRepository의 createPost Method를 실행합니다.
        await postRepository.createPost(
            createPostParams.title,
            createPostParams.content,
            createPostParams.userId,
            createPostParams.nickname
        );

        // postRepository의 createPost Method를 실행했을 때, postsModel의 create를 1번 실행합니다.
        expect(mockPostsModel.create).toHaveBeenCalledTimes(1);

        // postRepository의 createPost Method를 실행했을 때, postsModel의 create를 아래와 같은 값으로 호출합니다.
        expect(mockPostsModel.create).toHaveBeenCalledWith({
            nickname: createPostParams.nickname,
            userId: createPostParams.userId,
            title: createPostParams.title,
            content: createPostParams.content,
        });
    });

    test("Posts Repository createPost Method w/ error", async () => {
        // create Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockPostsModel.create = jest.fn().mockRejectedValue();

        // createPost Method를 실행하기 위해 필요한 Params 입니다.
        const createPostParams = {
            title: "createPostTitle",
            content: "createPostContent",
            userId: "createUserId",
            nickname: "createPostNickname",
        };

        // postRepository의 createPost Method를 실행합니다.

        try {
            await postRepository.createPost(
                createPostParams.title,
                createPostParams.content,
                createPostParams.userId,
                createPostParams.nickname
            );
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.errorCode).toBe(5001);
            expect(postRepository.postModel.create).toHaveBeenCalledTimes(1);
        }

        // postRepository의 createPost Method를 실행했을 때, postsModel의 create를 아래와 같은 값으로 호출합니다.
        expect(mockPostsModel.create).toHaveBeenCalledWith({
            nickname: createPostParams.nickname,
            userId: createPostParams.userId,
            title: createPostParams.title,
            content: createPostParams.content,
        });
    });
});
