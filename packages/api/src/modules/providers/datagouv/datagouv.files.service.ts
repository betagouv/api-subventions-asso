import fs from "fs";
import https from "https";
import { exec } from "child_process";

export class DataGouvFilesService {
    decompressArchive(path: string, outPath = "./output/out"): Promise<string> {
        return new Promise(resolve => {
            console.log("Start decompress");
            exec(`unzip ${path} -d ./output`, async () => {
                console.log("End decompress");
                resolve(outPath);
            });
        });
    }

    downloadFile(url: string, outputPath = "import"): Promise<string> {
        return new Promise(resolve => {
            console.log("Start Download");
            const file = fs.createWriteStream(outputPath);
            https.get(url, response => {
                response.pipe(file).on("finish", () => {
                    console.log("End download");
                    file.close();
                    resolve(outputPath);
                });
            });
        });
    }
}

const dataGouvFilesService = new DataGouvFilesService();

export default dataGouvFilesService;
