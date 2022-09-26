import IOsirisRequestInformations from '../../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations'
import OsirisRequestEntity from '../../../../../src/modules/providers/osiris/entities/OsirisRequestEntity'

export default new OsirisRequestEntity(
    { siret: "00000000000001", rna: "W000000001", name: "OSIRIS_ENTITY_FIXTURE" },
    { osirisId: "OSIRIS_ID", compteAssoId: "LE_COMPTE_ASSO_ID", ej: "EJ00001", amountAwarded: 0, dateCommission: new Date("2022-01-01"), extractYear: 2022 } as IOsirisRequestInformations,
    {},
    undefined,
    []
) 