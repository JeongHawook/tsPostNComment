class AppError extends Error {
    public errorCode:Number
    constructor(errorCode:number) {
        //message 추가 원할시 (errorCode:number, message?: string)
        super(); //super(message)
        this.errorCode = errorCode;
    }
}

module.exports = AppError