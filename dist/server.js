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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./lib/database");
const excelReader_1 = require("./lib/excelReader");
const models_1 = require("./models");
const logger_1 = __importDefault(require("./lib/logger"));
dotenv_1.default.config();
class Server {
    constructor() {
        this.port = process.env.PORT || 4000;
    }
    loadDummyData() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const dummy_users = yield (0, excelReader_1.readExcelFile)();
            if (dummy_users.length > 0) {
                logger_1.default.debug("Loading dummy data...");
                let success = 0;
                let updated = 0;
                let errorUsers = [];
                try {
                    for (var _d = true, dummy_users_1 = __asyncValues(dummy_users), dummy_users_1_1; dummy_users_1_1 = yield dummy_users_1.next(), _a = dummy_users_1_1.done, !_a; _d = true) {
                        _c = dummy_users_1_1.value;
                        _d = false;
                        let u = _c;
                        try {
                            let updated = yield models_1.User.findOneAndUpdate({
                                email: u.email.toLowerCase()
                            }, {
                                $set: u,
                                $setOnInsert: {
                                    id: yield (0, database_1.nextSequence)("users")
                                }
                            }, {
                                upsert: true
                            });
                            if (!updated) {
                                success++;
                            }
                        }
                        catch (e) {
                            console.log(e);
                            //Error due user insertion
                            errorUsers.push(Object.assign(Object.assign({}, u), { errorMessage: e.message }));
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = dummy_users_1.return)) yield _b.call(dummy_users_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                //We could use insert many but if a row fails, all remaining users will fail
                // let result =  await User.insertMany(dummy_users);
                logger_1.default.debug(success, " dummy users inserted successfully");
                logger_1.default.debug(errorUsers.length, " dummy users failed to load");
            }
        });
    }
    loadDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.connectToDatabase)();
                logger_1.default.info("Connected to MongoDB");
            }
            catch (e) {
                logger_1.default.error("Error connecting to database: ", e.message);
            }
        });
    }
    loadServer() {
        if (this.express) {
            logger_1.default.warn(" [Server] Already initialized");
            return;
        }
        this.express = (0, express_1.default)();
        // Add middlewares to the app
        this.express.use(express_1.default.json());
        if (process.env.NODE_ENV != "production") {
            this.express.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)({
                definition: {
                    openapi: "3.0.0",
                    info: {
                        version: "1.0.0",
                        title: "Wispok API Documentation",
                        description: "A basic example of CRUD for users"
                    },
                    servers: [
                        {
                            url: "http://localhost:" + this.port + "/v1"
                        }
                    ]
                },
                apis: [
                    "./src/routes/auth.routes.ts",
                    "./src/routes/users.routes.ts"
                ]
            })));
        }
        //Add routes to our app
        this.express.use(`/v1`, router_1.default);
        // Start the server on the specified port
        this.express.listen(Number(this.port), () => {
            logger_1.default.info(`Server :: Running @ 'http://localhost:${this.port}'`);
            if (process.env.NODE_ENV != "production")
                logger_1.default.debug(`API documentation ready @ 'http://localhost:${this.port}/docs`);
        }).on('error', (_error) => {
            return logger_1.default.error('Error starting express: ', _error.message);
        });
    }
}
exports.default = new Server;
//# sourceMappingURL=server.js.map