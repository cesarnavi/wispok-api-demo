"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const router = (0, express_1.Router)();
router.use("/users", users_routes_1.default);
router.use("/auth", auth_routes_1.default);
//TODO: add more routes
exports.default = router;
//# sourceMappingURL=router.js.map