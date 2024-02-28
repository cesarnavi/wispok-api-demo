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
exports.nextSequence = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGOOSE_URI;
let connected = false;
if (!mongoUri) {
    throw new Error("MONGOOSE_URI  is required, please go to .env file and add it");
}
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connected) {
            return;
        }
        yield mongoose_1.default.connect(mongoUri);
        connected = true;
        return;
    });
}
exports.connectToDatabase = connectToDatabase;
function nextSequence(collection, step = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connected) {
            throw new Error("Database must be initialized");
        }
        const { count } = yield mongoose_1.default.connection.db.collection("sequences").findOneAndUpdate({
            collection,
        }, {
            $inc: {
                count: step
            }
        }, {
            upsert: true,
            returnDocument: "after"
        });
        return count;
    });
}
exports.nextSequence = nextSequence;
//# sourceMappingURL=database.js.map