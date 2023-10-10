import { ObjectId } from "mongodb";
import { ScdlGrant } from "../@types/ScdlGrant";

export default interface MiscScdlDataEntity extends ScdlGrant {
    id: ObjectId;
    editorId: ObjectId;
}
