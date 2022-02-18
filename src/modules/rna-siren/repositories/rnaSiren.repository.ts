
import RnaSiren from ".././entities/RnaSirenEntity";
import db from "../../../shared/MongoConnection";
import { Siren } from "../../../@types/Siren";
import { Rna } from "../../../@types/Rna";

export class RnaSirenRepository {
    private readonly collection = db.collection<RnaSiren>("rna-siren");

    findRna(siren: Siren) {
        return this.collection.findOne({ siren });
    }

    findSiren(rna: Rna) {
        return this.collection.findOne({ rna });
    }

    async create(entity: RnaSiren) {
        return !!(await this.collection.insertOne(entity));
    }

}

const rnaSirenRepository = new RnaSirenRepository();

export default rnaSirenRepository;