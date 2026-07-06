import MongoAdapter from "../MongoAdapter";
import { RnaPort } from "./rna.port";
import { RnaImportDto } from "./RnaImportDto";

export class RnaAdapter extends MongoAdapter<RnaImportDto> implements RnaPort {
    public collectionName = "rna";

    public createIndexes() {
        this.collection.createIndex({ id: 1 });
    }

    async insertMany(lines: RnaImportDto[]) {
        await this.collection.insertMany(lines, { ordered: false });
        return;
    }
}
