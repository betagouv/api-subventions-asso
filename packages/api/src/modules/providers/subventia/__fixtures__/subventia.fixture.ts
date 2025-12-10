import { ApplicationStatus } from "dto";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import SubventiaEntity from "../@types/subventia.entity";
import { RawApplication } from "../../../grant/@types/rawGrant";
import { ObjectId } from "mongodb";
import SubventiaDto from "../@types/subventia.dto";
import { APPLICATION_LINK_TO_CHORUS } from "../../../applicationFlat/__fixtures__";

export const SUBVENTIA_ENTITY: SubventiaEntity = {
    service_instructeur: "SERVICE INSTRUCTEUR",
    annee_demande: 1234,
    siret: DEFAULT_ASSOCIATION.siret,
    date_commission: new Date("2024-05-01"),
    montants_accorde: 1234,
    montants_demande: 1234,
    dispositif: "DISPOSITIF",
    sous_dispositif: "SOUS DISPOSITIF",
    status: "SOLDE",
    statut_label: ApplicationStatus.GRANTED,
    reference_demande: "REF DEMANDE",
    provider: "subventia",
    updateDate: new Date("2024-07-01"),
};

export const ENTITIES: SubventiaEntity[] = [SUBVENTIA_ENTITY];

export const SUBVENTIA_DBO = {
    ...SUBVENTIA_ENTITY,
    _id: new ObjectId("688a2b26312c7f495b6f1dd1"),
    updateDate: new Date("2025-07-30"),
    __data__: [{} as SubventiaDto],
};

export const RAW_APPLICATION: RawApplication = {
    data: APPLICATION_LINK_TO_CHORUS,
    type: "application",
    provider: "application-flat",
    joinKey: undefined,
};
