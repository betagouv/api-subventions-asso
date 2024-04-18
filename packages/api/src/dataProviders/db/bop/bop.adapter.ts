import { ObjectId } from "mongodb";
import { DataBretagneDto } from "../../api/dataBretagne/DataBretagneDto";

export default class BopAdapter {
    static toDbo(data: DataBretagneDto) {
        return { _id: new ObjectId(), label: data.label, code: data.code };
    }
}
