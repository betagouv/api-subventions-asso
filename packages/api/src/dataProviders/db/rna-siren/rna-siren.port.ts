import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import Rna from "../../../identifierObjects/Rna";
import Siren from "../../../identifierObjects/Siren";

export interface RnaSirenPort {
    createIndexes(): Promise<void>;

    insertMany(entities: RnaSirenEntity[]): Promise<void>;
    insert(entity: RnaSirenEntity): Promise<void>;
    find(id: Rna | Siren): Promise<RnaSirenEntity[] | null>;
}
