import { IAssociation } from "@api-subventions-asso/dto";
import AssociationDto from "@api-subventions-asso/dto/search/AssociationDto";
import DemandeSubvention from "@api-subventions-asso/dto/search/DemandeSubventionDto";
import Versement from "@api-subventions-asso/dto/search/VersementDto";
import ProviderValue from "@api-subventions-asso/dto/shared/ProviderValue";
import User from "../../@types/User";
import { DefaultObject } from "../../@types/utils";
import apiDatasubService from "../../shared/apiDatasub.service";
import IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import ProviderValueHelper from "../../shared/helpers/ProviderValueHelper";

export class AssociationService {
    async getAssociation(id: string, user: User): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR", data?: {association: AssociationDto, subventions: unknown, versements: Versement[] } }> {
        const type = IdentifierHelper.findType(id);
        if (type === "UNKNOWN") return { type: "ERROR" }; // TODO send error

        let association: IAssociation | null = null;

        try {
            if (type === "RNA") {
                const result = await apiDatasubService.searchAssoByRna(id, user);
                association = result.data.association as IAssociation;
            }
            else if (type === "SIREN") {
                const result = await apiDatasubService.searchAssoBySiren(id, user);
                association = result.data.association as IAssociation;
            }
        }  catch (e) {
            return { type: "ERROR" }; // TODO send error
        }

        if (!association)  return { type: "ERROR" };

        const subventions = this.formatSubvention(association);

        return {
            type: "SUCCESS",
            data: {
                association,
                subventions,
                versements: association.versements || [],
            }
        }
    }

    private formatSubvention(association: IAssociation) {
        const result = {
            lastYear: "NC",
            totalAccordeByYear: {} as DefaultObject<number>,
            years: new Set<string>(),
            byYear: {} as DefaultObject<DefaultObject<DefaultObject<{
                total: number,
                demande: number,
                propose: number,
                accorde: number,
            }>>>,
            demandes: {} as DefaultObject<DemandeSubvention[]>
        };
        association.etablissements?.reduce((acc, etablisement) => {
            if (!etablisement.demandes_subventions || etablisement.demandes_subventions.length === 0) return acc;
            etablisement.demandes_subventions.forEach(demande => {
                const status = ProviderValueHelper.getValue(demande.status) || "Autres";

                let year = (demande.annee_demande && ProviderValueHelper.getValue(demande.annee_demande)?.toString());

                if (!year) {
                    const date = (demande.date_commision && ProviderValueHelper.getValue(demande.date_commision)) ||  ProviderValueHelper.getDate(demande.status);
                    if (date) {
                        year = new Date(date).getFullYear().toString();
                    } else {
                        year = "0000";
                    }
                }

                acc.years.add(year)
                if (!acc.byYear[year]) acc.byYear[year] = {};


                if (!acc.byYear[year][status]) acc.byYear[year][status] = {};

                const service = ProviderValueHelper.getValue(demande.service_instructeur) || "AUTRES";

                if (!acc.byYear[year][status][service]) acc.byYear[year][status][service] = {
                    total: 0,
                    demande: 0,
                    propose: 0,
                    accorde: 0,
                };

                acc.byYear[year][status][service].demande += 
                    !demande.montants
                        ? 0
                        : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;
    
                acc.byYear[year][status][service].propose += 
                    !demande.montants
                        ? 0
                        : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;

                acc.byYear[year][status][service].accorde += 
                    !demande.montants
                        ? 0
                        : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

                
                if (!acc.totalAccordeByYear[year]) acc.totalAccordeByYear[year] = 0;

                acc.totalAccordeByYear[year] += !demande.montants
                    ? 0
                    : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

                if (!acc.demandes[year]) acc.demandes[year] = [];
                acc.demandes[year].push(demande);
            });

            return acc;
        }, result);

        result.lastYear = [...result.years].sort((a, b) => a === "0000" ? Infinity : b.localeCompare(a))[0] || "0000";

        return result
    }
}

const associationService = new AssociationService();

export default associationService;