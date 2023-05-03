const UserRepository = require("../repositories/users.repository");
const RedisClientRepository = require("../repositories/redis.repository");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
class UserService {
    userRepository = new UserRepository();
    redisClientRepository = new RedisClientRepository();

    signup = async (
        nickname,
        password,
        name,
        age,
        gender,
        email,
        profileImage
    ) => {
        try {
            const user = await this.userRepository.check(nickname);

            if (user) throw new AppError(4025);

            const bcryptPassword = await bcrypt.hash(password, 10);

            const signup = await this.userRepository.signup(
                nickname,
                bcryptPassword,
                name,
                age,
                gender,
                email,
                profileImage
            );
        } catch (error) {
            console.log(error);
            throw new AppError(error.errorCode || 4023);
        }
    };

    //login
    login = async (nickname, password) => {
        try {
            const user = await this.userRepository.check(nickname);

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!user || !passwordMatch) throw new AppError(4024);

            const refreshToken = await this.createRefreshToken();
            const accessToken = await this.createAccessToken(
                user.userId,
                user.nickname
            );

            await this.redisClientRepository.setRefreshToken(refreshToken, {
                userId: user.userId,
                nickname: user.nickname,
            });

            return { accessToken, refreshToken };
        } catch (error) {
            console.log(error);
            throw new AppError(4014);
        }
    };
    //refresh
    createRefreshToken = async (req, res) => {
        const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });
        return refreshToken;
    };
    //access
    createAccessToken = async (userId, nickname) => {
        const accessToken = jwt.sign(
            {
                userId: userId,
                nickname: nickname,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );
        return accessToken;
    };
}
module.exports = UserService;
