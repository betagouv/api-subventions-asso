import type { Rna, Siren, Siret } from "dto";
import requestsService from "$lib/services/requests.service";
import { isSiret } from "$lib/helpers/identifierHelper";

class GrantPort {
    async getGrantExtract(identifier: Siren | Rna | Siret) {
        const resourceType = isSiret(identifier) ? "etablissement" : "association";
        const path = `/${resourceType}/${identifier}/grants/csv`;
        const res = await requestsService.get(path, {}, { responseType: "blob" });
        return { blob: res?.data, filename: res.headers?.["content-disposition"].match(/inline; filename=(.*)/)?.[1] };
    }
}

const grantPort = new GrantPort();
export default grantPort;
