import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import { SIRENE_UNITE_LEGALE_DTOS } from "../../adapters/inputs/pipeline/import/sirene-unite-legale/__fixtures__/sirene-unite-legale.dto.fixture";
import { SireneUniteLegaleEntity } from "../../entities/SireneUniteLegaleEntity";
import { Rna, Siren } from "../../identifier-objects";

export const SIRENE_UNITE_LEGAL_ENTITIES: SireneUniteLegaleEntity[] = [
    {
        ...SIRENE_UNITE_LEGALE_DTOS[0],
        identifiantAssociationUniteLegale: new Rna(DEFAULT_ASSOCIATION.rna),
        siren: new Siren(SIRENE_UNITE_LEGALE_DTOS[0].siren),
        anneeEffectifsUniteLegale: 2021,
        nombrePeriodesUniteLegale: 5,
        anneeCategorieEntreprise: 2022,
        categorieJuridiqueUniteLegale: "9220",
    },
    {
        ...SIRENE_UNITE_LEGALE_DTOS[1],
        identifiantAssociationUniteLegale: new Rna(DEFAULT_ASSOCIATION.rna),
        siren: new Siren(SIRENE_UNITE_LEGALE_DTOS[1].siren),
        anneeEffectifsUniteLegale: 2021,
        nombrePeriodesUniteLegale: 5,
        anneeCategorieEntreprise: 2022,
        categorieJuridiqueUniteLegale: "9220",
    },
];

export const UNITE_LEGAL_ENTREPRISE_ENTITIES = [{ siren: new Siren(SIRENE_UNITE_LEGALE_DTOS[2].siren) }];
