import { ObjectId } from "mongodb";
import FonjepPosteDto from "../dto/fonjepPosteDto";
// dates are reported as Excel dates
export default interface FonjepPosteDbo extends FonjepPosteDto {
    _id: ObjectId;
}
