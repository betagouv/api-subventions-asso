import fs from "fs";
import path from "path";
import https from "https";

export function findFiles(file: string) {
    const files: string[] = [];

    if (fs.lstatSync(file).isDirectory()) {
        const filesInFolder = fs
            .readdirSync(file)
            .filter(fileName => !fileName.startsWith(".") && !fs.lstatSync(path.join(file, fileName)).isDirectory())
            .map(fileName => path.join(file, fileName));

        files.push(...filesInFolder);
    } else files.push(file);

    return files;
}

export function downloadFile(url: string, outputPath = "import"): Promise<string> {
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
