import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";

export interface FonjepRowData {
    subvention: FonjepSubventionEntity;
    versements: FonjepVersementEntity[];
}
