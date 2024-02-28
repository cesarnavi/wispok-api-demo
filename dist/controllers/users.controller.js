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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUserById = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const models_1 = require("../models");
const database_1 = require("../lib/database");
const node_cache_1 = __importDefault(require("node-cache"));
const logger_1 = __importDefault(require("../lib/logger"));
const cache = new node_cache_1.default();
const ITEMS_PER_PAGE = 100;
const CURRENT_PAGE = 1;
const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cachedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const cached = cache.get("all-users");
    if (cached) {
        return cached;
    }
    logger_1.default.info(" [Users] Getting users from database");
    const users = yield models_1.User.find({}, null, { lean: true });
    cache.set("all-users", users, 10);
    return users;
});
const onError = (res, msg) => {
    return res.status(400).send({ message: msg });
};
const normalizeStr = (str) => str.toLowerCase().trim();
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { first_name, last_name, email, birthdate, country } = req.body;
        if (!first_name) {
            return res.status(400).send({
                message: "First name is required"
            });
        }
        if (!last_name) {
            return onError(res, "Last name is required");
        }
        if (!birthdate) {
            return onError(res, "Birthdate is required");
        }
        if (!birthdateRegex.test(birthdate)) {
            return onError(res, "Invalid birthdate format. It should be in yyyy-mm-dd format.");
        }
        if (isNaN(Date.parse(birthdate))) {
            return onError(res, "Invalid birthdate");
        }
        if (!email) {
            return onError(res, "Email is required");
        }
        if (!emailRegex.test(email)) {
            return onError(res, "Invalid email format");
        }
        email = email ? normalizeStr(email) : null;
        let alreadyExistEmail = email && (yield models_1.User.countDocuments({ email: email }));
        if (alreadyExistEmail) {
            return onError(res, "Email already exists");
        }
        let user = null;
        try {
            user = yield new models_1.User({
                id: yield (0, database_1.nextSequence)("users"),
                first_name: normalizeStr(first_name),
                last_name: normalizeStr(last_name),
                birthdate,
                email,
                country: country ? normalizeStr(country) : null
            }).save();
        }
        catch (e) {
            console.log("[Users] Error upserting user: ", e.message);
            return res.status(400).send({ message: "Error upserting user, please contact support" });
        }
        console.log(" [Users] Created successfully: ", user);
        return res.status(200).send(user);
    });
}
exports.createUser = createUser;
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let limit = Number(req.query.limit) || ITEMS_PER_PAGE;
        if (limit < 20) {
            limit = 20;
        }
        else if (limit > 1000) {
            limit = 1000;
        }
        //Validate arguments first
        let page = Number(req.query.page) || CURRENT_PAGE;
        if (Number(page) <= 0) {
            return res.status(400).send({
                message: "Page number must be greater than 0"
            });
        }
        const users = (yield cachedUsers());
        // 1. Get the total number or records
        let total_items = users.length;
        // 2. Get total of pages based on # of items per query
        let items_per_page = limit;
        let total_pages = Math.floor(total_items / items_per_page) + (total_items % items_per_page ? 1 : 0);
        // 4. Get current page, if query page number is gt total pages, return the last page
        let current_page = page || CURRENT_PAGE;
        if (page) { //validates page param
            if (Number(page) > total_pages) {
                current_page = total_pages;
            }
        }
        let prev_page = current_page > 1 ? current_page - 1 : null;
        let next_page = current_page == total_pages
            ? null
            : current_page + 1;
        const startIndex = ((current_page - 1) * items_per_page);
        console.log("startIndex: ", startIndex, (startIndex + items_per_page));
        return res.status(200).send({
            items: users.slice(startIndex, (startIndex + items_per_page)),
            pagination: {
                total_items,
                items_per_page,
                total_pages,
                current_page,
                prev_page,
                next_page
            }
        });
    });
}
exports.getUsers = getUsers;
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!userId) {
            return onError(res, "Invalid ID");
        }
        const user = yield models_1.User.findOne({ id: userId });
        if (!user) {
            return onError(res, "User not found");
        }
        return res.status(200).send(user);
    });
}
exports.getUserById = getUserById;
function deleteUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!userId) {
            return onError(res, "Invalid ID");
        }
        const user = yield models_1.User.findOne({ id: userId });
        if (!user) {
            return onError(res, "User not found");
        }
        yield models_1.User.deleteOne({
            id: userId
        });
        return res.status(202).send("ok");
    });
}
exports.deleteUserById = deleteUserById;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!userId) {
            return onError(res, "Invalid ID");
        }
        const user = yield models_1.User.countDocuments({ id: Number(userId) });
        if (!user) {
            return onError(res, "User not found");
        }
        let { first_name, last_name, country, email } = req.body;
        const update = {};
        if (first_name) {
            update.first_name = normalizeStr(first_name);
        }
        if (last_name) {
            update.last_name = normalizeStr(last_name);
        }
        if (country) {
            update.country = normalizeStr(country);
        }
        email = email ? normalizeStr(email) : null;
        if (email && !emailRegex.test(email)) {
            return onError(res, "Invalid email format");
        }
        let alreadyExistEmail = email && (yield models_1.User.countDocuments({ email: email }));
        if (alreadyExistEmail) {
            return onError(res, "Email already exists");
        }
        if (email) {
            update.email = email;
        }
        yield models_1.User.updateOne({
            id: Number(userId)
        }, update);
        return res.status(202).send("ok");
    });
}
exports.updateUser = updateUser;
//# sourceMappingURL=users.controller.js.map