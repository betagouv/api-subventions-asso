import { Grant, SimplifiedEtablissement, AssociationIdentifiers, StructureIdentifiers } from "dto";
import csvStringifier = require("csv-stringify/sync");
import associationsService from "../associations/associations.service";
import paymentService from "../payments/payments.service";
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
        const separatedGrants = this.separateByExercise(grants);

        return {
            csv: csvStringifier.stringify(
                separatedGrants.map(g => GrantAdapter.grantToExtractLine(g, asso, estabBySiret)),
                { header: true, columns: ExtractHeaderLabel, delimiter: ";" },
            ),
            fileName: `DataSubvention-${assoName}-${identifier}-${new Date().toISOString().slice(0, 10)}`,
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
