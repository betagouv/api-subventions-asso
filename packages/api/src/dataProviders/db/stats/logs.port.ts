import { UserDto } from "dto";
import MongoPort from "../../../shared/MongoPort";
import { WinstonLog } from "../../../@types/WinstonLog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: type this #3383
export class LogsPort extends MongoPort<WinstonLog> {
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

    /**
     * @returns List of URL grouped by year grouped by userId
     */
    public async getConsumption() {
        // for performance reason, only get the last 3 year including the current year
        const start = (new Date().getFullYear() - 2).toString();
        return this.collection
            .aggregate([
                {
                    $match: {
                        timestamp: { $gt: new Date(`${start}-01-01`) },
                        "meta.req.user._id": { $exists: true },
                    },
                },
                {
                    $group: {
                        _id: {
                            userId: "$meta.req.user._id",
                            year: { $year: "$timestamp" },
                        },
                        requests: {
                            $push: "$meta.req.url",
                        },
                    },
                },
                {
                    $group: {
                        _id: "$_id.userId",
                        requestsByYear: {
                            $push: { $concatArrays: [[{ $toString: "$_id.year" }, "$requests"]] },
                        },
                    },
                },
                {
                    $project: {
                        requestsByYear: {
                            $arrayToObject: "$requestsByYear",
                        },
                    },
                },
            ])
            .toArray() as Promise<{ _id: string; requestsByYear: Record<string, string[]> }[]>;
    }

    /**
     * Only used to insert logs for integ tests on API stats
     */
    private async addTestLog(logs: WinstonLog[]) {
        return this.collection.insertMany(logs);
    }
}

const logsPort = new LogsPort();
export default logsPort;
