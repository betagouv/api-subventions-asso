import * as fs from "fs";
import path from "path";
import * as yauzl from "yauzl";
import { relativeTimeRounding } from "moment";
import * as unzipper from "unzipper";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";

export class SirenePort {
    private static URL = "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip";

    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("sirene");
    }

    async downloadAndExtractSireneZip() {
        console.log("Downloading sirene zip file");
        return await this.http.downloadAndExtractZip(SirenePort.URL, "/temp/sirene/");
    }
}

const sirenePort = new SirenePort();
export default sirenePort;
