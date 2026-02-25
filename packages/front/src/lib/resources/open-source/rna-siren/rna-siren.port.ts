import requestsService from "$lib/services/requests.service";
import type { RnaSirenResponseDto } from "dto";

class RnaSirenPort {
    basePath = "/open-data/rna-siren";

    async getRnaSiren(identifier) {
        const path = `${this.basePath}/${identifier}`;
        const data = (await requestsService.get(path))?.data;
        if (!Array.isArray(data)) return null;
        return data as RnaSirenResponseDto[];
    }
}

const rnaSirenPort = new RnaSirenPort();

export default rnaSirenPort;
