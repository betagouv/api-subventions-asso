import { SIRENE_UNITE_LEGAL_ENTITIES } from "../../../../../domain/__fixtures__/unite-legale.fixture";
import { SireneUniteLegaleDbo } from "../SireneUniteLegaleDbo";

export const SIRENE_UNITE_LEGALE_DBOS: SireneUniteLegaleDbo[] = [
    {
        ...SIRENE_UNITE_LEGAL_ENTITIES[0],
        siren: SIRENE_UNITE_LEGAL_ENTITIES[0].siren.value,
        identifiantAssociationUniteLegale: SIRENE_UNITE_LEGAL_ENTITIES[0].identifiantAssociationUniteLegale?.value,
    },
    {
        ...SIRENE_UNITE_LEGAL_ENTITIES[1],
        siren: SIRENE_UNITE_LEGAL_ENTITIES[1].siren.value,
        identifiantAssociationUniteLegale: SIRENE_UNITE_LEGAL_ENTITIES[1].identifiantAssociationUniteLegale?.value,
    },
];
