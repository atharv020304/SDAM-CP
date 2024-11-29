

class errHandler extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Server error";

    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new errHandler(400, message);
    }

    if (err.code === 11000) {
        const message = `Duplicate entry ${Object.keys(err.keyValue)} Entered`;
        err = new errHandler(400, message);
    }

    if (err.name === "JsonWebTokenError") {
        const message = `Invalid JsonWebToken`;
        err = new errHandler(400, message);
    }

    if (err.name === "TokenExpiredError") {
        const message = `Token expired. Please login again`;
        err = new errHandler(400, message);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};


export { errHandler};
