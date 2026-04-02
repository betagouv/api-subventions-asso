import { ApplicationFlatEntity } from "../../../../entities//flats/ApplicationFlatEntity";
import { DefaultObject } from "../../../../@types";
import Siret from "../../../../identifierObjects/Siret";
import Siren from "../../../../identifierObjects/Siren";

export interface ApplicationFlatPort {
    createIndexes(): Promise<void>;

    hasBeenInitialized(): Promise<boolean>;
    insertOne(entity: ApplicationFlatEntity): Promise<void>;
    upsertOne(entity: ApplicationFlatEntity): Promise<void>;
    upsertMany(entities: ApplicationFlatEntity[]): Promise<void>;
    insertMany(entities: ApplicationFlatEntity[]): Promise<void>;
    cursorFind(query: DefaultObject<unknown>, projection: DefaultObject<unknown>): AsyncIterable<ApplicationFlatEntity>;
    deleteAll(): Promise<void>;
    findBySiret(siret: Siret): Promise<ApplicationFlatEntity[]>;
    findBySiren(siren: Siren): Promise<ApplicationFlatEntity[]>;
    findByEJ(ej: string): Promise<ApplicationFlatEntity[]>;
    bulkFindDeleteByExercises(provider: string, exercises: number[]): Promise<void>;
    createBackupByProvider(provider: string): Promise<void>;
    dropBackupCollection(): Promise<void>;
    applyBackupCollection(providerId: string): Promise<void>;
    findAll(): Promise<ApplicationFlatEntity[]>;
}
