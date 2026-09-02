import { AssociationWithProviderValues } from "dto";
import AsyncUseCase from "../../../@types/use-case/AsyncUseCase";
import { Siren } from "../../../identifier-objects";
import apiAssoService, { ApiAssoService } from "../../providers/api-asso/api-asso.service";
import ProviderValueFactory from "../../../shared/ProviderValueFactory";
import { BodaccPort } from "../../../adapters/outputs/api/bodacc/bodacc.port";
import bodaccAdapter from "../../../adapters/outputs/api/bodacc/bodacc.adapter";
import { SireneUniteLegaleEntity } from "../../../entities/SireneUniteLegaleEntity";
import sireneUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import { SireneUniteLegalePort } from "../../../adapters/outputs/db/sirene/sirene-unite-legale.port";
import { SireneEstablishmentPort } from "../../../adapters/outputs/db/sirene/sirene-establishment.port";
import { EstablishmentEntity } from "../../../domain/structures/establishments/EstablishmentEntity";
import sireneEstablishmentAdapter from "../../../adapters/outputs/db/sirene/sirene-establishment.adapter";
import { getMostRecentDate } from "../../../shared/helpers/DateHelper";

// this is not in a mapper as it should not leave for long
// AssociationWithProviderValues should be dropped soon
function uniteLegaleToAssociation(entity: SireneUniteLegaleEntity): AssociationWithProviderValues {
    const toPvs = ProviderValueFactory.buildProviderValuesMapper(
        sireneUniteLegaleAdapter.collectionName,
        new Date(entity.dateDernierTraitementUniteLegale),
    );

    return {
        denomination_siren: toPvs(entity.denominationUniteLegale),
        siren: toPvs(entity.siren.value),
        nic_siege: toPvs(entity.nicSiegeUniteLegale),
        categorie_juridique: toPvs(entity.categorieJuridiqueUniteLegale),
        date_creation_siren: toPvs(new Date(entity.dateCreationUniteLegale)),
        date_modification_siren: toPvs(new Date(entity.dateDernierTraitementUniteLegale)),
    };
}

// this is not in a mapper as it should not leave for long
// AssociationWithProviderValues should be dropped soon
function establishmentsToAssociation(entities: EstablishmentEntity[]) {
    if (!entities.length) return entities;

    const toPvs = ProviderValueFactory.buildProviderValuesMapper(
        sireneEstablishmentAdapter.collectionName,
        getMostRecentDate(entities.map(entity => entity.lastUpdate)) as Date,
    );

    const siege = entities.find(estab => estab.siege)!; // we trust the provider to have at least the siege to be in their records
    const addressSiege = {
        numero: siege.address.number,
        type_voie: siege.address.type,
        voie: siege.address.name,
        code_postal: siege.address.postalCode,
        commune: siege.address.city,
    };
    const sirets = entities.map(entity => entity.siret.value);
    return { etablisements_siret: toPvs(sirets), adresse_siege_siren: toPvs(addressSiege) };
}

/**
 * Retrives structure data from RNA and fallback to API ASSO if needed
 */
export class GetSirenStructureData implements AsyncUseCase<Siren, AssociationWithProviderValues | null> {
    constructor(
        private bodaccPort: BodaccPort,
        private uniteLegalePort: SireneUniteLegalePort,
        private establishmentPort: SireneEstablishmentPort,
        private apiAssoService: ApiAssoService,
    ) {}

    async execute(siren: Siren) {
        const bodacc = ProviderValueFactory.buildProviderValuesMapper(
            "bodacc",
            new Date(),
        )(await this.bodaccPort.getRecordsBySiren(siren));

        const sireneEntity = await this.uniteLegalePort.findOneBySiren(siren);
        const establishments = await this.establishmentPort.getAllBySiren(siren);
        if (sireneEntity)
            return {
                ...uniteLegaleToAssociation(sireneEntity),
                ...establishmentsToAssociation(establishments),
                bodacc,
            } as AssociationWithProviderValues;

        // fallback to API ASSO
        const sirenStructure = await this.apiAssoService.findAssociationBySiren(siren);

        if (!sirenStructure) return null;

        return {
            ...sirenStructure,
            bodacc,
        } as AssociationWithProviderValues;
    }
}

const getSirenStructureData = new GetSirenStructureData(
    bodaccAdapter,
    sireneUniteLegaleAdapter,
    sireneEstablishmentAdapter,
    apiAssoService,
);
export default getSirenStructureData;
