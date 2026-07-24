import fs from "fs";
import path from "path";
import os from "os";
import FileStreamPort from "../adapters/outputs/file-stream.port";
import { pipeline } from "stream/promises";
import { RequestResponse } from "../modules/provider-request/@types/RequestResponse";
import { Readable } from "stream";

export type DownloadFileReturn = Omit<RequestResponse<Readable>, "data"> & {
    filePath: string;
};

export default class DownloadFile {
    constructor(private readonly fileStreamAdapter: FileStreamPort) {}

    async execute(fileId?: string): Promise<DownloadFileReturn> {
        const { data: stream, ...fileInfo } = await this.fileStreamAdapter.getFileStream(fileId);

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stream-files"));
        const filePath = path.join(tmpDir, `${this.fileStreamAdapter.name}-download`);

        const writer = fs.createWriteStream(filePath);

        try {
            await pipeline(stream, writer);
            return { filePath, ...fileInfo };
        } catch (err) {
            await fs.promises.unlink(filePath).catch(() => {});
            throw err;
        }
    }
}
