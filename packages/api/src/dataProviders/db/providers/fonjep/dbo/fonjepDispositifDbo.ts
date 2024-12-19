import { ObjectId } from "mongodb";
import FonjepDispositifDto from "../dto/fonjepDispositifDto";

export default interface FonjepDispositifDbo extends FonjepDispositifDto {
    _id: ObjectId;
}
