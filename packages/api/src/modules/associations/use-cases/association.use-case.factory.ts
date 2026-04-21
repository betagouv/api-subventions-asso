import rnaSirenAdapter from "../../../adapters/outputs/db/rna-siren/rna-siren.adapter";
import sireneStockUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import uniteLegalEntrepriseAdapter from "../../../adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import apiAssoService from "../../providers/api-asso/api-asso.service";
import CheckIdentifierIsFromAssoUseCase from "./check-identifier-is-from-asso.use-case";
import CheckSirenIsFromAssoUseCase from "./check-siren-is-from-asso.use-case";
import FindSiretFromAssociationIdentifierUseCase from "./find-siret-from-association-identifier.use-case";
import FindSiretFromRnaUseCase from "./find-siret-from-rna.use-case";
import FindSiretFromSirenUseCase from "./find-siret-from-siren.use-case";

export function createFindSiretFromAssociationIdentifier() {
    const findFromRna = new FindSiretFromRnaUseCase(rnaSirenAdapter, sireneStockUniteLegaleAdapter);
    const findFromSiren = new FindSiretFromSirenUseCase(sireneStockUniteLegaleAdapter);
    return new FindSiretFromAssociationIdentifierUseCase(findFromRna, findFromSiren);
}

export function createCheckIdentifierIsFromAsso() {
    return new CheckIdentifierIsFromAssoUseCase(
        new CheckSirenIsFromAssoUseCase(sireneStockUniteLegaleAdapter, uniteLegalEntrepriseAdapter, apiAssoService),
    );
}
