import { Siret } from "../../../@types/Siret";
import { ASSO_BRANCHE, BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import { isEJ, isRna, isSiret } from "../../../shared/Validators";
import searchService from "../../search/search.service";
import dataEntrepriseService from "../dataEntreprise/dataEntreprise.service";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusLineRepository from "./repositories/chorus.line.repository";

export interface RejectedRequest {
    state: "rejected", result: { message: string, code: number, data: unknown }
}

export class ChorusService {

    public validateEntity(entity: ChorusLineEntity) {
        if (!BRANCHE_ACCEPTED.includes(entity.indexedInformations.codeBranche)) {
            return { success: false, message: `The branche ${entity.indexedInformations.codeBranche} is not accepted in data`, data: entity }
        }

        if (isNaN(entity.indexedInformations.amount)) {
            return { success: false, message: `Amount is not a number`, data: entity }
        }

        if (!(entity.indexedInformations.dateOperation instanceof Date)) {
            return { success: false, message: `Operation date is not a valid date`, data: entity }
        }

        if (!isSiret(entity.indexedInformations.siret)) {
            return { success: false, message: `INVALID SIRET FOR ${entity.indexedInformations.siret}`, data: entity };
        }

        if (!isEJ(entity.indexedInformations.ej)) {
            return { success: false, message: `INVALID EJ FOR ${entity.indexedInformations.ej}`, data: entity };
        }

        return { success: true }
    }

    public async addChorusLine(entity: ChorusLineEntity) {
        if(!this.validateEntity(entity).success) {
            return {
                state: "rejected",
                result: this.validateEntity(entity)
            }
        }
        const datesAreOnSameDay = (first: Date, second: Date) =>
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
            
        const alreadyExist = await chorusLineRepository.findByEJ(entity.indexedInformations.ej);

        if (
            alreadyExist 
            && datesAreOnSameDay(alreadyExist.indexedInformations.dateOperation, entity.indexedInformations.dateOperation) 
            && entity.indexedInformations.amount == alreadyExist.indexedInformations.amount
        ){
            return {
                state: "updated",
                result: await chorusLineRepository.update(entity),
            }
        }

        // Check if siret belongs to an asso
        if (entity.indexedInformations.codeBranche !== ASSO_BRANCHE && ! (await this.siretBelongAsso(entity.indexedInformations.siret))) {
            return {
                state: "rejected",
                result: {
                    message: "The Siret does not correspond to an association",
                    data: entity,
                }
            }
        }
        
        return {
            state: "created",
            result: await chorusLineRepository.create(entity),
        }
    }

    public async findsBySiret(siret: Siret) {
        return chorusLineRepository.findsBySiret(siret);
    }

    public async siretBelongAsso(siret: Siret): Promise<boolean> { // TODO Change me when FONJEP has merged
        const chorusLines = await this.findsBySiret(siret);
        if (chorusLines.length) return true; 
        
        // - 2 Search in other provider
        const requests = await searchService.findRequestsBySiret(siret);
        if (requests.length) return true;

        // - 3 If Rna not found search in siret api and check type of compagny
        const siretData = await dataEntrepriseService.findAssociationBySiren(siretToSiren(siret), true);
        if (siretData) {
            if (siretData.rna && siretData.rna.length && isRna(siretData.rna[0].value)) return true;
            if (
                siretData.categorie_juridique 
                && siretData.categorie_juridique.length 
                && LEGAL_CATEGORIES_ACCEPTED.includes(siretData.categorie_juridique[0].value)
            ) return true;
        }

        return false
    }
}

const chorusService = new ChorusService();

export default chorusService;