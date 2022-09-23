import { IEtablissement, Siret, DemandeSubvention, ProviderValue, UserWithJWTDto } from "@api-subventions-asso/dto";
import { DefaultObject } from "../../@types/utils";
import apiDatasubService from "../../shared/apiDatasub.service";
import IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import ProviderValueHelper from "../../shared/helpers/ProviderValueHelper";

export class EtablissementService {
    async getEtablissement(
        siret: Siret,
        user: UserWithJWTDto
    ): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR"; data?: unknown }> {
        const type = IdentifierHelper.findType(siret);

        if (type !== "SIRET") return { type: "ERROR" }; // TODO send error

        try {
            const result = await apiDatasubService.searchEtablissement(siret, user);

            const etablissement = result.data.etablissement as IEtablissement;
            const association = etablissement.association;
            const subventions = this.formatSubvention(etablissement);

            return {
                type: "SUCCESS",
                data: {
                    association,
                    etablissement,
                    subventions,
                    versements: etablissement.versements || []
                }
            };
        } catch (e) {
            return { type: "ERROR" }; // TODO send error
        }
    }

    private formatSubvention(etablisement: IEtablissement) {
        const result = {
            lastYear: "NC",
            totalAccordeByYear: {} as DefaultObject<number>,
            years: new Set<string>(),
            byYear: {} as DefaultObject<
                DefaultObject<
                    DefaultObject<{
                        total: number;
                        demande: number;
                        propose: number;
                        accorde: number;
                    }>
                >
            >,
            demandes: {} as DefaultObject<DemandeSubvention[]>
        };

        if (!etablisement.demandes_subventions || etablisement.demandes_subventions.length === 0) return result;

        etablisement.demandes_subventions.forEach(demande => {
            const status = ProviderValueHelper.getValue(demande.status) || "Autres";

            let year = demande.annee_demande && ProviderValueHelper.getValue(demande.annee_demande)?.toString();

            if (!year) {
                const date =
                    (demande.date_commision && ProviderValueHelper.getValue(demande.date_commision)) ||
                    ProviderValueHelper.getDate(demande.status);
                if (date) {
                    year = new Date(date).getFullYear().toString();
                } else {
                    year = "0000";
                }
            }

            result.years.add(year);
            if (!result.byYear[year]) result.byYear[year] = {};

            if (!result.byYear[year][status]) result.byYear[year][status] = {};

            const service = ProviderValueHelper.getValue(demande.service_instructeur) || "AUTRES";

            if (!result.byYear[year][status][service])
                result.byYear[year][status][service] = {
                    total: 0,
                    demande: 0,
                    propose: 0,
                    accorde: 0
                };

            result.byYear[year][status][service].demande += !demande.montants
                ? 0
                : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;

            result.byYear[year][status][service].propose += !demande.montants
                ? 0
                : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;

            result.byYear[year][status][service].accorde += !demande.montants
                ? 0
                : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

            if (!result.totalAccordeByYear[year]) result.totalAccordeByYear[year] = 0;

            result.totalAccordeByYear[year] += !demande.montants
                ? 0
                : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

            if (!result.demandes[year]) result.demandes[year] = [];
            result.demandes[year].push(demande);
        });

        result.lastYear = [...result.years].sort((a, b) => (a === "0000" ? Infinity : b.localeCompare(a)))[0] || "0000";

        return result;
    }
}

const etablissementService = new EtablissementService();

export default etablissementService;
