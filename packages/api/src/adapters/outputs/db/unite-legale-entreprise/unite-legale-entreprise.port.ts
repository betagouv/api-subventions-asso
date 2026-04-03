import Siren from "../../../../identifier-objects/Siren";
import { UniteLegaleEntrepriseEntity } from "../../../../entities/UniteLegaleEntrepriseEntity";

export interface UniteLegalEntreprisePort {
    createIndexes(): Promise<void>;

    findOneBySiren(siren: Siren): Promise<UniteLegaleEntrepriseEntity | null>;
    insertMany(entities: UniteLegaleEntrepriseEntity[]): Promise<void>;
}
