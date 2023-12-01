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
}

const dataGouvFilesService = new DataGouvFilesService();

export default dataGouvFilesService;
