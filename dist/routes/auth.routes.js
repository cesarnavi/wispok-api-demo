"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const authRoutes = (0, express_1.Router)();
/**
 * @swagger
 * /auth/token:
 *    get:
 *      summary: Get a JWT token
 *      responses:
 *       '200':
 *         description: Get a 1 hour valid token to test the protected endpoints
 *       '5XX':
 *         description: Unexpected error.
 *
 *
*/
authRoutes.get("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Generates a token that expires in 1 hour
    const token = (0, middlewares_1.generateJWT)({ role: "root" }, 60 * 60);
    return res.status(200).send({ token });
}));
exports.default = authRoutes;
//# sourceMappingURL=auth.routes.js.map