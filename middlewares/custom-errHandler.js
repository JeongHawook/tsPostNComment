const AppError = require("../utils/appError");
const errorCodes = require("../config/error.json");

function errorHandler(err, req, res, next) {
    console.log(err.errorCode);

    if (err instanceof AppError) {
        console.log("coming?");
        const errorDetails = errorCodes[err.errorCode];
        if (errorDetails) {
            const { statusCode, message } = errorDetails;
            return res
                .status(statusCode)
                .json({ message: `${message} ${err.errorCode}` });
        }
    }
    console.log(err);
    return res.status(500).send("데이터 형식이 옳바르지않습니다");
}

module.exports = errorHandler;
