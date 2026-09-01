import { AssociationWithProviderValues, EstablishmentSimplifiedWithProviderValues } from "dto";
import * as csvStringifier from "csv-stringify/sync";
import { BadRequestError, NotFoundError } from "core";
import associationsService from "../associations/associations.service";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import GrantMapper from "./grant.mapper";
import { ExtractHeaderLabel } from "./@types/GrantToExtract";
import grantService from "./grant.service";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import getAssociation, { GetAssociation } from "../associations/use-cases/get-association";

export class GrantExtractService {
    constructor(private getAssociation: GetAssociation) {}
    async buildCsv(identifier: StructureIdentifier): Promise<{ csv: string; fileName: string }> {
        let assoIdentifier: AssociationIdentifier | undefined;
        if (identifier instanceof AssociationIdentifier) assoIdentifier = identifier;
        if (identifier instanceof EstablishmentIdentifier) assoIdentifier = identifier.associationIdentifier;
        if (!assoIdentifier) throw new BadRequestError("identifiant invalide");

        const [grants, asso, estabs] = await Promise.all([
            grantService.getGrants(identifier),
            this.getAssociation.execute(assoIdentifier).catch((error): AssociationWithProviderValues => {
                if (error instanceof NotFoundError) return {};
                throw error;
            }),
            associationsService
                .getEstablishments(assoIdentifier)
                .catch((error): EstablishmentSimplifiedWithProviderValues[] => {
                    if (error instanceof NotFoundError) return [];
                    throw error;
                }),
        ]);

        const estabBySiret: Record<string, EstablishmentSimplifiedWithProviderValues> = {};
        estabs.forEach(estab => (estabBySiret[estab.siret?.[0]?.value] = estab));

        const assoName =
            asso.denomination_rna?.[0]?.value ?? asso.denomination_siren?.[0]?.value ?? identifier.toString();

        return {
            csv: csvStringifier.stringify(
                grants.map(g => GrantMapper.grantToExtractLine(g, asso, estabBySiret)),
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

const grantExtractService = new GrantExtractService(getAssociation);
export default grantExtractService;
