import type { ProviderDataEntity } from "../../../../@types/ProviderData";

interface FonjepDispositifEntity extends ProviderDataEntity {
    id: number;
    libelle: string;
    financeurCode: string;
}

export default FonjepDispositifEntity;
