"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = exports.withJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error(" [WithJWT] Secret token for jwt is required");
}
function withJWT(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        console.log(" [WithJWT] Access Denied: No token provided ");
        return res.status(401).json({ error: 'Access Denied, provide token in Authorization header' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), secret);
        //TODO: add user or session to req object
        next();
    }
    catch (error) {
        console.log(" [WithJWT] Invalid token: ", token);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
exports.withJWT = withJWT;
function generateJWT(userPayload, ttl) {
    return jsonwebtoken_1.default.sign(userPayload, secret, { expiresIn: ttl });
}
exports.generateJWT = generateJWT;
//# sourceMappingURL=withJWT.js.map