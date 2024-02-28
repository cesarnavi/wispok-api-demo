"use strict";
/**
 * Creates & maintains the log
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const reset = "\x1b[0m";
const COLORS = {
    red: (text) => `\x1b[31m ${text} ${reset}`,
    green: (text) => `\x1b[32m ${text} ${reset}`,
    yellow: (text) => `\x1b[33m ${text} ${reset}`,
    blue: (text) => `\x1b[34m ${text} ${reset}`,
    magenta: (text) => `\x1b[35m ${text} ${reset}`,
};
class Logger {
    ;
    constructor() {
        this.logginTerminal = true;
        this.baseDir = path.join(__dirname, '../../');
    }
    info(...args) {
        let log = `[${new Date().toISOString()}] [INFO] - ${args.reduce((p, c) => p + c)}`;
        if (this.logginTerminal) {
            console.log(COLORS.green(log));
        }
        this.write(log);
    }
    warn(...args) {
        let log = `[${new Date().toISOString()}] [WARN] - ${args.reduce((p, c) => p + c)}`;
        if (this.logginTerminal) {
            console.log(COLORS.yellow(log));
        }
        this.write(log);
    }
    debug(...args) {
        let log = `[${new Date().toISOString()}] [DEBUG] - ${args.reduce((p, c) => p + c)}`;
        if (this.logginTerminal) {
            console.log(COLORS.magenta(log));
        }
        this.write(log);
    }
    error(...args) {
        let log = `[${new Date().toISOString()}] [ERROR] - ${args.reduce((p, c) => p + c)}`;
        if (this.logginTerminal) {
            console.log(COLORS.red(log));
        }
        this.write(log);
    }
    write(data) {
        let file = this.baseDir.concat(this.getFilename());
        try {
            if (!fs.existsSync(this.baseDir)) {
                fs.mkdirSync(this.baseDir, { recursive: true });
            }
            fs.appendFileSync(file, data + "\n");
        }
        catch (err) {
            console.error(err);
        }
    }
    getFilename() {
        let date = new Date();
        return "wispok.log";
    }
}
exports.default = new Logger;
//# sourceMappingURL=logger.js.map