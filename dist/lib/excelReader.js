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
exports.readExcelFile = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
const DUMMY_FILE = path_1.default.join(__dirname, "../data/dummy_users.xlsx");
function readExcelFile(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        try {
            yield workbook.xlsx.readFile(filepath || DUMMY_FILE);
            var worksheet = workbook.getWorksheet("users");
            const data = [];
            worksheet.eachRow((row, i) => {
                if (i == 1) { //header
                    return;
                }
                try {
                    const [_, first_name, last_name, birthdate, email, country] = row.values;
                    data.push({
                        first_name,
                        last_name,
                        birthdate,
                        email,
                        country
                    });
                }
                catch (e) {
                    logger_1.default.warn(" [Excel] Error reading row ", i, " e: ", e.message);
                }
            });
            return data;
        }
        catch (e) {
            logger_1.default.warn(" [Excel] Error reading excel file: ", e.message);
        }
    });
}
exports.readExcelFile = readExcelFile;
//# sourceMappingURL=excelReader.js.map