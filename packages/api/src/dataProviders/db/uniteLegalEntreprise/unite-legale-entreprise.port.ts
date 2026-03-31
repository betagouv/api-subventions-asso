import Siren from "../../../identifierObjects/Siren";
import { UniteLegalEntrepriseEntity } from "../../../entities/UniteLegalEntrepriseEntity";

export interface UniteLegalEntreprisePort {
    createIndexes(): Promise<void>;

    findOneBySiren(siren: Siren): Promise<UniteLegalEntrepriseEntity | null>;
    insertMany(entities: UniteLegalEntrepriseEntity[]): Promise<void>;
}
