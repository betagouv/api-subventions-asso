import { LEGAL_CATEGORIES_ACCEPTED } from "../../shared/LegalCategoriesAccepted";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import uniteLegalEntreprisesService from "../providers/uniteLegalEntreprises/uniteLegal.entreprises.service";
import sireneStockUniteLegaleService from "../providers/sirene/stockUniteLegale/sireneStockUniteLegale.service";
import Siren from "../../identifierObjects/Siren";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";

export class AssociationsHelper {
    /*
     * eventually should be used to filter chorus as well
     * */
    async isIdentifierFromAsso(id: StructureIdentifier): Promise<boolean> {
        let siren: Siren;
        if (id instanceof AssociationIdentifier) {
            if (id.rna) return true;
            if (id.siren) siren = id.siren;
            else return false;
        } else if (id.siret) siren = id.siret.toSiren();
        else return false;

        // if we have it in this record it is an asso
        if (await sireneStockUniteLegaleService.findOneBySiren(siren)) return true;
        // from record if it exists and is not an association, should be here
        if (await uniteLegalEntreprisesService.isEntreprise(siren)) return false;

        // if asso is too recent to be on record we need api
        const asso = await apiAssoService.findAssociationBySiren(siren);
        return this.isCategoryFromAsso(asso?.categorie_juridique?.[0]?.value);
    }

    isCategoryFromAsso(category: string | undefined): boolean {
        if (!category) return false;
        return LEGAL_CATEGORIES_ACCEPTED.includes(category);
    }
}

const associationHelper = new AssociationsHelper();
export default associationHelper;
