import { EstablishmentSimplified } from "dto";
import * as csvStringifier from "csv-stringify/sync";
import { BadRequestError } from "core";
import associationsService from "../associations/associations.service";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import GrantAdapter from "./grant.adapter";
import { ExtractHeaderLabel } from "./@types/GrantToExtract";
import grantService from "./grant.service";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";

class GrantExtractService {
    async buildCsv(identifier: StructureIdentifier): Promise<{ csv: string; fileName: string }> {
        let assoIdentifier: AssociationIdentifier | undefined;
        if (identifier instanceof AssociationIdentifier) assoIdentifier = identifier;
        if (identifier instanceof EstablishmentIdentifier) assoIdentifier = identifier.associationIdentifier;
        if (!assoIdentifier) throw new BadRequestError("identifiant invalide");

        const [grants, asso, estabs] = await Promise.all([
            grantService.getGrants(identifier),
            associationsService.getAssociation(assoIdentifier),
            associationsService.getEstablishments(assoIdentifier),
        ]);

        const estabBySiret: Record<string, EstablishmentSimplified> = {};
        estabs.forEach(estab => (estabBySiret[estab.siret?.[0]?.value] = estab));

        const assoName = asso.denomination_rna?.[0]?.value ?? asso.denomination_siren?.[0]?.value;

        return {
            csv: csvStringifier.stringify(
                grants.map(g => GrantAdapter.grantToExtractLine(g, asso, estabBySiret)),
                {
                    header: true,
                    columns: ExtractHeaderLabel,
                    delimiter: ";",
                    bom: true,
                    cast: { number: n => ("" + n).replaceAll(".", ",") },
                },
            ),
            fileName: `DataSubvention-${assoName}-${identifier.toString()}-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`,
        };
    }
}

const grantExtractService = new GrantExtractService();
export default grantExtractService;
