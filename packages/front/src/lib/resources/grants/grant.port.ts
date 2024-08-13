import type { Rna, Siren, Siret } from "dto";
import requestsService from "$lib/services/requests.service";
import { isSiret } from "$lib/helpers/identifierHelper";

class GrantPort {
    async getGrantExtract(identifier: Siren | Rna | Siret) {
        const resourceType = isSiret(identifier) ? "etablissement" : "association";
        const path = `/${resourceType}/${identifier}/grants/csv`;
        return (await requestsService.get(path, {}, { responseType: "blob" }))?.data;
    }
}

const grantPort = new GrantPort();
export default grantPort;
