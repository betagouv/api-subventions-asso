import { Grant, SimplifiedEtablissement } from "dto";
import csvStringifier = require("csv-stringify/sync");
import { StructureIdentifier } from "../../@types";
import associationsService from "../associations/associations.service";
import paymentService from "../payments/payments.service";
import { BadRequestError } from "../../shared/errors/httpErrors";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import GrantAdapter from "./grant.adapter";
import { ExtractHeaderLabel } from "./@types/GrantToExtract";
import grantService from "./grant.service";

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

        const estabBySiret: Record<string, SimplifiedEtablissement> = {};
        estabs.forEach(estab => (estabBySiret[estab.siret?.[0]?.value] = estab));

        const assoName = asso.denomination_rna?.[0]?.value ?? asso.denomination_siren?.[0]?.value;
        const separatedGrants = this.separateByExercise(grants);

        return {
            csv: csvStringifier.stringify(
                separatedGrants.map(g => GrantAdapter.grantToExtractLine(g, asso, estabBySiret)),
                { header: true, columns: ExtractHeaderLabel, delimiter: ";" },
            ),
            fileName: `DataSubvention-${assoName}-${identifier.toString()}-${new Date().toISOString().slice(0, 10)}`,
        };
    }

    separateByExercise(grants: Grant[]): Grant[] {
        return grants.map(grant => this.separateOneByExercise(grant)).flat();
    }

    separateOneByExercise(grant: Grant): Grant[] {
        const { application, payments } = grant;
        const byYear: Record<number, Grant> = {};

        if (application) byYear[application?.annee_demande?.value ?? "unknwown"] = { application };

        let year: number;
        for (const payment of payments ?? []) {
            year = paymentService.getPaymentExercise(payment) ?? "unknown";
            if (!byYear[year]?.payments)
                byYear[year] = {
                    application: byYear[year]?.application ?? null,
                    payments: [payment],
                };
            // @ts-expect-error -- ts doesn't see that I covered the case year byYear[year].payemnts is null but I did
            else byYear[year].payments.push(payment);
        }

        return Object.values(byYear);
    }
}

const grantExtractService = new GrantExtractService();
export default grantExtractService;
