import HeliosEntity from "../../../../../modules/providers/helios/domain/helios.entity";
import MongoDBPort from "../../database.port";

export default interface HeliosPort extends MongoDBPort<HeliosEntity> {
    insertMany(entities: HeliosEntity[]): Promise<void>;
    findAll(): Promise<HeliosEntity[]>;
}
