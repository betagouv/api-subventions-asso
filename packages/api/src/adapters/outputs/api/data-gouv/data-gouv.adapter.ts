import { Readable } from "stream";
import FileStreamPort from "../../file-stream.port";
import { HttpAdapter } from "../../../http.adapter";

export class DataGouvAdapter extends HttpAdapter implements FileStreamPort {
    private baseUrl = "https://www.data.gouv.fr/api/1/datasets/r/";
    private url: string;

    constructor(resourceId: string) {
        super("data-gouv");
        this.url = this.baseUrl + resourceId;
    }

    getFileStream() {
        return this.http.get<Readable>(this.url, { responseType: "stream" });
    }
}

export const sireneStockEstablishmentAdapter = new DataGouvAdapter("a29c1297-1f92-4e2a-8f6b-8c902ce96c5f");
