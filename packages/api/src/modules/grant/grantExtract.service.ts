import { FonjepPayment, Grant } from "dto";
import csvStringifier = require("csv-stringify/sync");
import GrantAdapter from "./grant.adapter";
import { ExtractHeaderLabel } from "./@types/GrantToExtract";

class GrantExtractService {
    buildCsv(grants: Grant[]): string {
        return csvStringifier.stringify(
            this.separateByExercise(grants).map(g => GrantAdapter.grantToCsv(g)),
            { header: true, columns: ExtractHeaderLabel },
        );
    }

    separateByExercise(grants: Grant[]): Grant[] {
        const res: Grant[] = [];
        for (const { application, payments } of grants) {
            const byYear: Record<number, Grant> = {};

            if (application) byYear[application?.annee_demande?.value ?? "unknwown"] = { application };

            let year: number;
            for (const payment of payments ?? []) {
                year =
                    (payment as FonjepPayment)?.periodeDebut?.value?.getFullYear() ??
                    payment?.dateOperation?.value?.getFullYear() ??
                    "unknown";
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
