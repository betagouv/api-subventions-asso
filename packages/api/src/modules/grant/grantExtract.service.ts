import { SimplifiedEtablissement } from "dto";
import csvStringifier = require("csv-stringify/sync");
import { AssociationIdentifiers, StructureIdentifiers } from "../../@types";
import associationsService from "../associations/associations.service";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { isRna, isSiren, isSiret } from "../../shared/Validators";
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import GrantAdapter from "./grant.adapter";
import { ExtractHeaderLabel } from "./@types/GrantToExtract";
import grantService from "./grant.service";

class GrantExtractService {
    async buildCsv(identifier: StructureIdentifiers): Promise<{ csv: string; fileName: string }> {
        let assoIdentifier: AssociationIdentifiers | undefined;
        if (isSiret(identifier)) assoIdentifier = siretToSiren(identifier);
        if (isRna(identifier) || isSiren(identifier)) assoIdentifier = identifier;
        if (!assoIdentifier) throw new BadRequestError("identifiant invalide");

        const [grants, asso, estabs] = await Promise.all([
            grantService.getGrants(identifier),
            associationsService.getAssociation(assoIdentifier),
            associationsService.getEstablishments(assoIdentifier),
        ]);

        const estabBySiret: Record<string, SimplifiedEtablissement> = {};
        estabs.forEach(estab => (estabBySiret[estab.siret?.[0]?.value] = estab));

        const assoName = asso.denomination_rna?.[0]?.value ?? asso.denomination_siren?.[0]?.value;
        const separatedGrants = grantService.handleMultiYearGrants(grants);

        return {
            csv: csvStringifier.stringify(
                separatedGrants.map(g => GrantAdapter.grantToExtractLine(g, asso, estabBySiret)),
                { header: true, columns: ExtractHeaderLabel, delimiter: ";" },
            ),
            fileName: `DataSubvention-${assoName}-${identifier}-${new Date().toISOString().slice(0, 10)}`,
        };
    }
}

const grantExtractService = new GrantExtractService();
export default grantExtractService;
