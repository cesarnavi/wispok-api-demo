"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    id: { type: Number, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    birthdate: { type: String },
    country: { type: String }
});
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map