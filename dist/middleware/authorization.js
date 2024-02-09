"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.decodeToken = exports.authorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorization = (req, res, next) => {
    const token = req.headers.authorization;
    const secretKey = process.env.SECRET_KEY;
    if (!token) {
        return res
            .status(404)
            .json({ error: "Not Found", message: "Token not found" });
    }
    try {
        const verify = jsonwebtoken_1.default.verify(token, secretKey);
        next();
    }
    catch (err) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Invalid token" });
    }
};
exports.authorization = authorization;
const decodeToken = (token) => {
    try {
        const decode = jsonwebtoken_1.default.decode(token);
        return decode;
    }
    catch (error) {
        return null;
    }
};
exports.decodeToken = decodeToken;
const generateToken = (id, exp) => {
    const secretKey = process.env.SECRET_KEY;
    try {
        const token = jsonwebtoken_1.default.sign({ userId: id }, secretKey, {
            expiresIn: exp ? exp : "1h",
        });
        return token;
    }
    catch (error) {
        return null;
    }
};
exports.generateToken = generateToken;
//# sourceMappingURL=authorization.js.map