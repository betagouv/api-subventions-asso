import { Readable } from "stream";
import { RequestResponse } from "../../modules/provider-request/@types/RequestResponse";

export default interface FileStreamPort {
    name: string;
    getFileStream(fileId?: string): Promise<RequestResponse<Readable>>;
}
