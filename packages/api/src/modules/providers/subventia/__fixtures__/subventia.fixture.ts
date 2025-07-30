import { ApplicationStatus } from "dto";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import SubventiaEntity from "../@types/subventia.entity";
import { RawApplication } from "../../../grant/@types/rawGrant";
import { ObjectId } from "mongodb";
import SubventiaDto from "../@types/subventia.dto";

export const SUBVENTIA_ENTITY: SubventiaEntity = {
    service_instructeur: "SERVICE INSTRUCTEUR",
    annee_demande: 1234,
    siret: DEFAULT_ASSOCIATION.siret,
    date_commission: new Date("2024-05-01"),
    montants_accorde: 1234,
    montants_demande: 1234,
    dispositif: "DISPOSITIF",
    sous_dispositif: "SOUS DISPOSITIF",
    status: "GRANTED",
    statut_label: ApplicationStatus.GRANTED,
    reference_demande: "REF DEMANDE",
    provider: "subventia",
    exportDate: new Date("2024-07-01"),
};

export const ENTITIES: SubventiaEntity[] = [SUBVENTIA_ENTITY];

export const SUBVENTIA_DBO = {
    ...SUBVENTIA_ENTITY,
    _id: new ObjectId("688a2b26312c7f495b6f1dd1"),
    updateDate: new Date("2025-07-30"),
    __data__: [{} as SubventiaDto],
};

export const RAW_APPLICATION: RawApplication<SubventiaEntity> = {
    data: ENTITIES[0],
    type: "application",
    provider: "subventia",
    joinKey: undefined,
};
