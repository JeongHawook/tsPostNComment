const jwt = require("jsonwebtoken");
const RedisClientRepository = require("../repositories/redis.repository");
const AppError = require("../utils/appError");
module.exports = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    const [authAcType, authAcToken] = (accessToken ?? "").split(" ");
    const [authRfType, authRfToken] = (refreshToken ?? "").split(" ");

    if (authAcType !== "Bearer" || !authAcToken) {
        res.clearCookie("accessToken");
        return res.status(403).json({
            errorMessage: "로그인 후에 이용할수있는 기능입니다",
        });
    }
    if (authRfType != "Bearer" || !authRfToken) {
        res.clearCookie("refreshToken");
        return res.status(403).json({
            errorMessage: "로그인 후에 이용할수있는 기능입니다",
        });
    }

    const isAccessTokenValid = validateAccessToken(authAcToken);
    const isRefreshTokenValid = validateRefreshToken(authRfToken);
    let newAccessToken = null;
    try {
        const redisClient = new RedisClientRepository();

        if (!isRefreshTokenValid) {
            await redisClient.deleteRefreshToken(authRfToken);
            return res.status(419).json({ message: "RefreshToken 만료!" });
        }
        if (!isAccessTokenValid) {
            const refreshTokenData = await redisClient.getRefreshToken(
                authRfToken
            );
            if (!refreshTokenData) {
                return res.status(419).json({
                    message: "RefreshToken의 정보가 서버에 존재하지 않습니다",
                });
            }
            const { userId, nickname } = refreshTokenData;
            newAccessToken = createAccessToken(userId, nickname);
            console.log("재생성!!!" + newAccessToken);
            res.cookie("accessToken", `Bearer ${newAccessToken}`);
        }
        const { userId, nickname } = getAcPayload(
            newAccessToken ?? authAcToken
        );

        res.locals.user = { userId, nickname };

        next();
    } catch (err) {
        console.error(err);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(403).json({
            errorMessage: "전달된 쿠키에서 오류가 발생하였습니다.",
        });
    }

    function validateAccessToken(accessToken) {
        try {
            jwt.verify(accessToken, process.env.JWT_SECRET);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    function validateRefreshToken(refreshToken) {
        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    function createAccessToken(userId, nickname) {
        try {
            const accessToken = jwt.sign(
                { userId, nickname },
                process.env.JWT_SECRET,
                {
                    expiresIn: "5h",
                }
            );
            return accessToken;
        } catch (error) {
            throw new AppError(4026);
        }
    }

    function getAcPayload(accessToken) {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        return payload;
    }
};
