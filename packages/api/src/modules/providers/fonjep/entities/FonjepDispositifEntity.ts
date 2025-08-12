import { ProviderDataEntity } from "../../../../@types/ProviderDataEntity";

interface FonjepDispositifEntity extends ProviderDataEntity {
    id: number;
    libelle: string;
    financeurCode: string;
}

export default FonjepDispositifEntity;
