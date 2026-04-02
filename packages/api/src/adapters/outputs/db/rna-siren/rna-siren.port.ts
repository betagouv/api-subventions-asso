import RnaSirenEntity from "../../../../entities//RnaSirenEntity";
import Rna from "../../../../identifier-objects/Rna";
import Siren from "../../../../identifier-objects/Siren";

export interface RnaSirenPort {
    createIndexes(): Promise<void>;

    insertMany(entities: RnaSirenEntity[]): Promise<void>;
    insert(entity: RnaSirenEntity): Promise<void>;
    find(id: Rna | Siren): Promise<RnaSirenEntity[] | null>;
}
