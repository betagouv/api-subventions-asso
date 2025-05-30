import IOsirisRequestInformations from "../../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisRequestEntity from "../../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import DEFAULT_ASSOCIATION from "../../../../__fixtures__/association.fixture";

export default new OsirisRequestEntity(
    { siret: DEFAULT_ASSOCIATION.siret, rna: DEFAULT_ASSOCIATION.rna, name: DEFAULT_ASSOCIATION.name },
    {
        osirisId: "OSIRIS_ID",
        compteAssoId: "LE_COMPTE_ASSO_ID",
        ej: "EJ00001",
        amountAwarded: 0,
        dateCommission: new Date("2022-01-01"),
        exercise: 2022,
        etablissementVoie: "rue Waldeck-Rousseau",
        etablissementCodePostal: "75000",
    } as IOsirisRequestInformations,
    {},
    undefined,
    [],
);
