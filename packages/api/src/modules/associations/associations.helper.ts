import { LEGAL_CATEGORIES_ACCEPTED } from "../../shared/LegalCategoriesAccepted";
import apiAssoService from "../providers/api-asso/api-asso.service";
import uniteLegaleEntrepriseService from "../providers/unite-legale-entreprise/unite-legale.entreprise.service";
import sireneStockUniteLegaleService from "../providers/sirene/stock-unite-legale/sirene-stock-unite-legale.service";
import Siren from "../../identifier-objects/Siren";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";

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
        if (await uniteLegaleEntrepriseService.isEntreprise(siren)) return false;
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
