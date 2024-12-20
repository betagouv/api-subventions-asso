import { ObjectId } from "mongodb";
import FonjepTypePosteDto from "../dto/fonjepTypePosteDto";

export default interface FonjepTypePosteDbo extends FonjepTypePosteDto {
    _id: ObjectId;
}
