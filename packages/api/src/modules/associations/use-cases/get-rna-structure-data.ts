import { AssociationWithProviderValues } from "dto";
import AsyncUseCase from "../../../@types/use-case/AsyncUseCase";
import { RnaPort } from "../../../adapters/outputs/db/rna/rna.port";
import { Rna } from "../../../identifier-objects";
import apiAssoService, { ApiAssoService } from "../../providers/api-asso/api-asso.service";
import ProviderValueFactory from "../../../shared/ProviderValueFactory";
import { RnaEntity } from "../../../entities/RnaEntity";
import rnaAdapter from "../../../adapters/outputs/db/rna/rna.adapter";

// this is not in a mapper as it should not leave for long
// AssociationWithProviderValues should be dropped soon
function toAssociation(entity: RnaEntity): AssociationWithProviderValues {
    const toPVs = ProviderValueFactory.buildProviderValuesMapper(rnaAdapter.collectionName, entity.lastUpdateDate);

    return {
        rna: toPVs(entity.id.value),
        denomination_rna: entity.name ? toPVs(entity.name) : undefined,
        date_creation_rna: entity.creationDate ? toPVs(entity.creationDate) : undefined,
        date_modification_rna: toPVs(entity.lastUpdateDate),
        objet_social: entity.object ? toPVs(entity.object) : undefined,
        code_objet_social_1: entity.socialObject ? toPVs(entity.socialObject) : undefined,
        adresse_siege_rna: toPVs({
            numero: entity.address?.number ? entity.address?.number : undefined,
            type_voie: undefined,
            voie: entity.address?.name ? entity.address?.name : undefined,
            code_postal: entity.address?.postalCode ? entity.address?.postalCode : undefined,
            commune: entity.address?.city ? entity.address?.city : undefined,
        }),
        nature: entity.nature ? toPVs(entity.nature) : undefined,
        rup: entity.rup ? toPVs(true) : undefined,
    };
}

/**
 * Retrives structure data from RNA and fallback to API ASSO if needed
 */
export class GetRnaStructureData implements AsyncUseCase<Rna, AssociationWithProviderValues | null> {
    constructor(
        private rnaPort: RnaPort,
        private apiAssoService: ApiAssoService,
    ) {}

    async execute(rna: Rna) {
        const rnaEntity = await this.rnaPort.getByRna(rna);
        if (rnaEntity) return toAssociation(rnaEntity);
        // fallback to API ASSO but this should not occur often if at all
        return this.apiAssoService.findAssociationByRna(rna);
    }
}

const getRnaStructureData = new GetRnaStructureData(rnaAdapter, apiAssoService);
export default getRnaStructureData;
