import { SireneStockUniteLegalePort } from "../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.port";
import { UniteLegalEntreprisePort } from "../../../adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.port";
import { RnaSirenPort } from "../../../adapters/outputs/db/rna-siren/rna-siren.port";
import { Siren } from "../../../identifier-objects";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import { ApiAssoService } from "../../providers/api-asso/api-asso.service";

export default class CheckSirenIsFromAssoUseCase {
    constructor(
        private sirenePort: SireneStockUniteLegalePort,
        private rnaSirenPort: RnaSirenPort,
        private entreprisePort: UniteLegalEntreprisePort,
        // @TODO: make this a use case
        private apiAssoService: ApiAssoService,
    ) {}

    async execute(siren: Siren) {
        // sirene collection stores only association data
        if (await this.sirenePort.findOneBySiren(siren)) return true;
        // find documents from rna siren
        if ((await this.rnaSirenPort.find(siren))?.length) return true;
        // entreprise collection stores only entreprise siren
        if (await this.entreprisePort.findOneBySiren(siren)) return false;
        // backup solution
        const asso = await this.apiAssoService.findAssociationBySiren(siren);

        const category = asso?.categorie_juridique?.[0]?.value;
        if (!category) return false;
        return LEGAL_CATEGORIES_ACCEPTED.includes(category);
    }
}
