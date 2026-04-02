import Siren from "../../../../../identifier-objects/Siren";
import { SubventiaDbo } from "../../../../../modules/providers/subventia/@types/subventia.entity";
import Siret from "../../../../../identifier-objects/Siret";

export interface SubventiaPort {
    createIndexes(): void;

    findBySiren(siren: Siren): Promise<SubventiaDbo[]>;
    findBySiret(siret: Siret): Promise<SubventiaDbo[]>;
    findAll(): Promise<SubventiaDbo[]>;
    create(entity: Omit<SubventiaDbo, "_id">): Promise<void>;
}
