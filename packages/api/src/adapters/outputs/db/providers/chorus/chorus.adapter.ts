import { AnyBulkWriteOperation } from "mongodb";
import Siret from "../../../../../identifier-objects/Siret";
import Siren from "../../../../../identifier-objects/Siren";
import { DefaultObject } from "../../../../../@types";
import MongoAdapter from "../../MongoAdapter";
import { ChorusPort } from "./chorus.port";
import ChorusDbo from "./chorus.dbo";
import { dboToEntity } from "./chorus.mapper";

export class ChorusAdapter extends MongoAdapter<ChorusDbo> implements ChorusPort {
    readonly collectionName = "chorus";

    public findOneByEJ(ej: string) {
        return this.findOneBy({ ej: ej });
    }

    public findOneBySiret(siret: Siret) {
        return this.findOneBy({ siret: siret.value });
    }

    public findOneBySiren(siren: Siren) {
        return this.findOneBy({
            siret: new RegExp(`^${siren.value}\\d{5}`),
        });
    }

    private async findOneBy(query) {
        const dbo = await this.collection.findOne(query);
        if (dbo) return dboToEntity(dbo);
        return null;
    }

    public async upsertMany(dbos: ChorusDbo[]) {
        const operations = dbos.map(
            dbo =>
                ({
                    updateOne: {
                        filter: {
                            ej: dbo.ej,
                            numPosteEJ: dbo.numPosteEJ,
                            numeroDemandePaiement: dbo.numeroDemandePaiement,
                            numPosteDP: dbo.numPosteDP,
                            codeSociete: dbo.codeSociete,
                            exercice: dbo.exercice,
                        },
                        update: { $set: dbo },
                        upsert: true,
                    },
                }) as AnyBulkWriteOperation<ChorusDbo>,
        );
        await this.collection.bulkWrite(operations);
        return;
    }

    private async findBy(query) {
        const dbos = this.collection.find(query).toArray();
        return (await dbos).map(dbo => dboToEntity(dbo));
    }

    public findBySiret(siret: Siret) {
        return this.findBy({ siret: siret.value });
    }

    public findByEJ(ej: string) {
        return this.findBy({ ej: ej });
    }

    public findBySiren(siren: Siren) {
        return this.findBy({ siren: siren.value });
    }

    public async *cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        const cursor = this.collection.find(query, { projection });
        try {
            for await (const dbo of cursor) {
                yield dboToEntity(dbo); // @TODO: transform this to Entity
            }
        } finally {
            await cursor.close();
        }
    }

    public cursorFindOnExercise(exercise: number) {
        return this.cursorFind({
            exercice: exercise,
        });
    }

    async createIndexes() {
        await this.collection.createIndex(
            {
                ej: 1, // create an ej:1 index if you change order here
                numPosteEJ: 1,
                numeroDemandePaiement: 1,
                numPosteDP: 1,
                codeSociete: 1,
                exercice: 1,
            },
            { unique: true },
        );
        await this.collection.createIndex({ siret: 1 });
    }
}

const chorusAdapter = new ChorusAdapter();

export default chorusAdapter;
