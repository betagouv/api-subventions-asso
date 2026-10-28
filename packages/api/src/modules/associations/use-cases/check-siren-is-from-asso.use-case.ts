import uniteLegaleEntrepriseAdapter from "../../../adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import { UniteLegaleEntreprisePort } from "../../../adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.port";
import { Siren } from "../../../identifier-objects";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import apiAssoService, { ApiAssoService } from "../../providers/api-asso/api-asso.service";
import { AssociationSearchPort } from "../../../adapters/outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../adapters/outputs/db/association-search/association-search.adapter";

export class CheckSirenIsFromAssoUseCase {
    constructor(
        private associationPort: AssociationSearchPort,
        private entreprisePort: UniteLegaleEntreprisePort,
        // @TODO: make this a use case
        private apiAssoService: ApiAssoService,
    ) {}

    async execute(siren: Siren) {
        // sirene collection stores only association data
        if (await this.associationPort.findByIdentifier(siren)) return true;
        // entreprise collection stores only entreprise siren
        if (await this.entreprisePort.findOneBySiren(siren)) return false;

        // backup solution
        const asso = await this.apiAssoService.findAssociationBySiren(siren);
        const category = asso?.categorie_juridique?.[0]?.value;
        if (!category) return false;
        return LEGAL_CATEGORIES_ACCEPTED.includes(category);
    }
}

const checkSirenIsFromAsso = new CheckSirenIsFromAssoUseCase(
    associationSearchAdapter,
    uniteLegaleEntrepriseAdapter,
    apiAssoService,
);

export default checkSirenIsFromAsso;
