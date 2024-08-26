import { Grant, SimplifiedEtablissement } from "dto";
import csvStringifier = require("csv-stringify/sync");
import { AssociationIdentifiers } from "../../@types";
import associationsService from "../associations/associations.service";
import paymentService from "../payments/payments.service";
import GrantAdapter from "./grant.adapter";
import { ExtractHeaderLabel } from "./@types/GrantToExtract";
import grantService from "./grant.service";

class GrantExtractService {
    async buildCsv(identifier: AssociationIdentifiers): Promise<{ csv: string; fileName: string }> {
        const assoIdentifier = identifier; // TODO modify to handle estab identifier
        const [grants, asso, estabs] = await Promise.all([
            grantService.getGrants(identifier),
            associationsService.getAssociation(identifier),
            associationsService.getEstablishments(identifier),
        ]);

        const estabBySiret: Record<string, SimplifiedEtablissement> = {};
        estabs.forEach(estab => (estabBySiret[estab.siret?.[0]?.value] = estab));

        const assoName = asso.denomination_rna?.[0]?.value ?? asso.denomination_siren?.[0]?.value;

        return {
            csv: csvStringifier.stringify(
                this.separateByExercise(grants).map(g => GrantAdapter.grantToCsv(g, asso, estabBySiret)),
                { header: true, columns: ExtractHeaderLabel },
            ),
            fileName: `DataSubvention-${assoName}-${identifier}-${new Date().toISOString().slice(0, 10)}`,
        };
    }

    separateByExercise(grants: Grant[]): Grant[] {
        const res: Grant[] = [];
        for (const { application, payments } of grants) {
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

            res.push(...Object.values(byYear));
        }
        return res;
    }
}

const grantExtractService = new GrantExtractService();
export default grantExtractService;
