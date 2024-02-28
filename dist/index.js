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
const os_1 = __importDefault(require("os"));
const cluster_1 = __importDefault(require("cluster"));
const server_1 = __importDefault(require("./server"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.default.loadDatabase();
        //Load excel file for dummy data
        if (process.env.NODE_ENV != "production") {
            yield server_1.default.loadDummyData();
        }
        server_1.default.loadServer();
    });
}
function runCluster() {
    if (cluster_1.default.isPrimary) {
        /**
         * Find the number of available CPUS
         */
        const CPUS = os_1.default.cpus();
        /**
         * Fork the process, the number of times we have CPUs available
         */
        CPUS.forEach(() => cluster_1.default.fork());
    }
    else {
        run();
    }
}
process.env.CLUSTER_MODE
    ? runCluster()
    : run();
//# sourceMappingURL=index.js.map