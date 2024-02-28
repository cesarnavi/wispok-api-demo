import Excel, { CellValue } from "exceljs";
import path from "path";
import logger from "./logger";

const DUMMY_FILE = path.join(__dirname,"../data/dummy_users.xlsx");

export async function readExcelFile(filepath?: string){
    const workbook = new Excel.Workbook();
    try{
        await workbook.xlsx.readFile(filepath || DUMMY_FILE);
        var worksheet = workbook.getWorksheet("users");
        const data = []
        worksheet.eachRow((row,i)=>{
            if(i==1){ //header
               return;
            }
            try{
                const [_,first_name, last_name, birthdate, email, country] = row.values as CellValue[];
                data.push({
                    first_name,
                    last_name,
                    birthdate,
                    email,
                    country
                });
            }catch(e){
               logger.warn(" [Excel] Error reading row ",i, " e: ", e.message);
            }
        })
        return data;
    }catch(e){
        logger.warn(" [Excel] Error reading excel file: ", e.message);
    }
}
