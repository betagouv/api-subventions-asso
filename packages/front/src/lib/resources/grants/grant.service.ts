import type { Rna, Siren } from "dto";
import grantPort from "$lib/resources/grants/grant.port";

class GrantService {
    getGrantExtract(identifier: Siren | Rna) {
        return grantPort.getGrantExtract(identifier);
    }
}

const grantService = new GrantService();
export default grantService;
