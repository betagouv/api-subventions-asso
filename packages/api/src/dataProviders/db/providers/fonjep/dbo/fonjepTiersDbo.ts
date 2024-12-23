import { ObjectId } from "mongodb";
import FonjepTiersDto from "../dto/fonjepTiersDto";

export default interface FonjepTiersDbo extends FonjepTiersDto {
    _id: ObjectId;
}
