import DauphinGisproDbo from "./DauphinGisproDbo";
import Siret from "../../../../../identifierObjects/Siret";
import Siren from "../../../../../identifierObjects/Siren";

export interface DauphinPort {
    createIndexes(): Promise<void>;

    upsert(entity: DauphinGisproDbo): Promise<void>;
    findBySiret(siret: Siret): Promise<DauphinGisproDbo[]>;
    findBySiren(siren: Siren): Promise<DauphinGisproDbo[]>;
    findOneByDauphinId(codeDossier: string): Promise<DauphinGisproDbo | null>;
    getLastImportDate(): Promise<Date | null>;
    migrateDauphinCacheToDauphin(logger: (message: string, writeOnSameLine?: boolean) => void): Promise<void>;
    createSimplifiedDauphinBeforeJoin(): Promise<void>;
    joinGisproToSimplified(): Promise<void>;
    findAllTempCursor(): unknown; // todo: precise return type (refacto AsyncIterable)
    cleanTempCollection(): Promise<void>;
}
