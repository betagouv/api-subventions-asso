import { ObjectId } from "mongodb";
import { DataBretagneDto } from "../../api/dataBretagne/DataBretagneDto";

export default class ProgrammeAdapter {
    static toDbo(data: DataBretagneDto) {
        return { _id: new ObjectId(), ...data };
    }
}
