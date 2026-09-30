import SireneUniteLegaleDto from "../../../inputs/pipeline/import/sirene-unite-legale/SireneUniteLegaleDto";

export type SireneUniteLegaleDbo = Omit<
    SireneUniteLegaleDto,
    | "categorieJuridiqueUniteLegale"
    | "anneeEffectifsUniteLegale"
    | "nombrePeriodesUniteLegale"
    | "anneeCategorieEntreprise"
> & {
    categorieJuridiqueUniteLegale: string;
    anneeEffectifsUniteLegale: number | null;
    nombrePeriodesUniteLegale: number | null;
    anneeCategorieEntreprise: number | null;
};
