import { ENTITIES } from "../../../../../domain/__fixtures__/unite-legale.fixture";
import { SireneUniteLegaleDbo } from "../SireneUniteLegaleDbo";

export const DBOS: SireneUniteLegaleDbo[] = [
    { ...ENTITIES[0], siren: ENTITIES[0].siren.value, identifiantAssociationUniteLegale: ENTITIES[0].rna?.value },
    { ...ENTITIES[1], siren: ENTITIES[1].siren.value, identifiantAssociationUniteLegale: ENTITIES[1].rna?.value },
];
