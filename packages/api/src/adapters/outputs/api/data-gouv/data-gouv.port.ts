import { Readable } from "stream";
import { RequestResponse } from "../../../../modules/provider-request/@types/RequestResponse";

export interface DataGouvPort {
    getFile(): Promise<RequestResponse<Readable>>;
}
