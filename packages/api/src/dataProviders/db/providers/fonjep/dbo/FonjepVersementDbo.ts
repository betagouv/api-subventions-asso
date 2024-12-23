import { ObjectId } from "mongodb";
import FonjepVersementDto from "../dto/fonjepVersementDto";
// dates are reported as Excel dates i.e. the number of days since 1900-01-01
export default interface FonjepVersementDbo extends FonjepVersementDto {
    _id: ObjectId;
}
