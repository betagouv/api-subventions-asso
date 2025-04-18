import { UserDto } from "dto";
import MongoPort from "../../../shared/MongoPort";

export class LogsPort extends MongoPort<any> {
    collectionName = "log";

    async createIndexes() {
        // await this.collection.createIndex({ timestamp: -1 }); // Likely handled by winston-mongodb; manual creation commented to avoid conflicts.
        await this.collection.createIndex({ "meta.req.user._id": 1 });
        // to handle in #1874
        // await this.collection.createIndex({ "meta.req.url": 1 });
    }

    public findByEmail(email: string) {
        return this.collection
            .find({
                "meta.req.user.email": email,
            })
            .toArray();
    }

    public getLogsOnPeriod(start: Date, end: Date) {
        return this.collection.find({
            timestamp: {
                $gte: start,
                $lte: end,
            },
        });
    }

    public async anonymizeLogsByUser(initialUser: UserDto, disabledUser: UserDto) {
        await this.collection.updateMany(
            { "meta.req.user.email": initialUser.email },
            { $set: { "meta.req.email": disabledUser.email } },
        );
        return true;
    }
}

const logsPort = new LogsPort();
export default logsPort;
