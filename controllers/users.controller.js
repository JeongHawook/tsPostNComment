const UserService = require("../services/users.service");
const { signupSchema, loginSchema } = require("../utils/joi");

class UserController {
    userService = new UserService();

    signup = async (req, res) => {
        const {
            //userId 만들면서 userInfo 추가 어떤데
            nickname,
            password,
            confirmPassword,
            name,
            age,
            gender,
            email,
            profileImage,
        } = await signupSchema.validateAsync(req.body).catch((error) => {
            return res.status(412).json({ message: error.message });
        });
        console.log(nickname);
        const signup = await this.userService.signup(
            nickname,
            password,
            name,
            age,
            gender,
            email,
            profileImage
        );
        return res.status(200).json({ message: "회원가입 축" });
    };

    login = async (req, res) => {
        const { nickname, password } = await loginSchema
            .validateAsync(req.body)
            .catch((error) => {
                return res.status(412).json({ message: error.message });
            });

        const { refreshToken, accessToken } = await this.userService.login(
            nickname,
            password
        );
        res.cookie("accessToken", `Bearer ${accessToken}`);
        res.cookie("refreshToken", `Bearer ${refreshToken}`);
        return res
            .status(200)
            .json({ message: `${refreshToken} 하고 ${accessToken} 성공!` });
    };
}
module.exports = UserController;
