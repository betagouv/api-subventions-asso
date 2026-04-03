import DauphinGisproDbo from "./DauphinGisproDbo";
import Siret from "../../../../../identifier-objects/Siret";
import Siren from "../../../../../identifier-objects/Siren";

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
