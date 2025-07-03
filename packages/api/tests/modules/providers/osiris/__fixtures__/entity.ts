import IOsirisActionsInformations from "../../../../../src/modules/providers/osiris/@types/IOsirisActionsInformations";
import IOsirisRequestInformations from "../../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisActionEntity from "../../../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import OsirisRequestEntity from "../../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import DEFAULT_ASSOCIATION from "../../../../__fixtures__/association.fixture";

const OSIRIS_REQUEST_ENTITY = new OsirisRequestEntity(
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

export const OSIRIS_ACTION_ENTITY = new OsirisActionEntity(
    {
        osirisActionId: "OSIRIS_ACTION_ID",
        requestUniqueId: OSIRIS_REQUEST_ENTITY.providerInformations.uniqueId,
        compteAssoId: OSIRIS_REQUEST_ENTITY.providerInformations.compteAssoId,

        ej: OSIRIS_REQUEST_ENTITY.providerInformations.ej,
        siret: DEFAULT_ASSOCIATION.siret,
        intitule: "intitulé de l'action",
        description: "description de l'action",
        nature_aide: "aide en numéraire",
        montants_versement_total: 150000,
        montants_versement_demande: 170000,
        montants_versement_propose: 150000,
        montants_versement_accorde: 150000,
        montants_versement_attribue: 150000,
        montants_versement_realise: 120000,
        montants_versement_compensation: 0,
        exercise: 2022,
    } as IOsirisActionsInformations,
    {},
);

export default OSIRIS_REQUEST_ENTITY;
