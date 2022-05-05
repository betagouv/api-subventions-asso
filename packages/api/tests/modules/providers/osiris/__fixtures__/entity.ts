import IOsirisRequestInformations from '../../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations'
import OsirisRequestEntity from '../../../../../src/modules/providers/osiris/entities/OsirisRequestEntity'

export default new OsirisRequestEntity(
    { siret: "SIRET", rna: "RNA", name: "NAME"},
    { osirisId: "OSIRISID", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations,
    {},
    undefined,
    []
) 