import Siren from "../../../../identifierObjects/Siren";
import { SubventiaDbo } from "../../../../modules/providers/subventia/@types/subventia.entity";
import Siret from "../../../../identifierObjects/Siret";

export interface SubventiaPort {
    createIndexes(): void;

    findBySiren(siren: Siren): Promise<SubventiaDbo[]>;
    findBySiret(siret: Siret): Promise<SubventiaDbo[]>;
    findAll(): Promise<SubventiaDbo[]>;
    create(entity: Omit<SubventiaDbo, "_id">): Promise<void>;
}
