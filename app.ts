import express, { Request, Response, NextFunction } from 'express';
const app = express();
require("dotenv").config();
require("express-async-errors");
const errorHandler = require("./middlewares/custom-errHandler");
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const { swaggerUi, specs } = require("./modules/swagger");



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req:Request, res:Response, next: NextFunction) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/", routes);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(PORT, "포트로 서버가 열렸어요!");
});

module.exports = app;
