import ApiAssoPort from "../../../../adapters/outputs/api/api-asso/api-asso.port";
import { Rna, Siren } from "../../../../identifier-objects";

export default class FindRnaSirenUseCase {
    constructor(private apiAssoPort: ApiAssoPort) {}

    async execute(identifier: Rna | Siren) {
        const structure = await this.apiAssoPort.getStructure(identifier);
        if (!structure) return structure;

        const identite = structure.identite;
        // sometimes identite is not defined even if request status is 200
        if (!identite) return null;

        let rna: Rna, siren: Siren;
        if (identifier instanceof Rna) {
            // API is not robust and sometimes SIREN is sent as number
            const identiteSiren = identite?.id_siren?.toString();
            if (!identiteSiren) return null;
            rna = identifier;
            siren = new Siren(identiteSiren);
        } else {
            const identiteRna = identite?.id_rna;
            if (!identiteRna) return null;
            siren = identifier;
            rna = new Rna(identiteRna);
        }

        return { rna, siren };
    }
}
