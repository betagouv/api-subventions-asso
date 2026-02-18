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
     * Note: it was necessary to group by month to avoid to exceed MongoDB treshold on document size
     *
     * @returns List of URL grouped by month by year by userId
     */
    public async getConsumption(userIds: string[] = []) {
        // for performance reason, only get last and current year
        const startYear = String(new Date().getFullYear() - 1);
        const startDate = new Date(startYear);

        // increment this if you want stats for another route
        const routesPrefix = ["association", "etablissement", "parcours-depot", "document", "search", "open-data"];

        const aggregationQueries = [
            {
                $match: {
                    "meta.req.user._id": { $in: userIds },
                    timestamp: { $gte: startDate },
                },
            },
            {
                $project: {
                    userId: "$meta.req.user._id",
                    year: { $toString: { $year: "$timestamp" } },
                    month: { $toString: { $month: "$timestamp" } },
                    url: "$meta.req.url",
                    prefix: {
                        $arrayElemAt: [{ $split: ["$meta.req.url", "/"] }, 1],
                    },
                },
            },
            {
                $match: {
                    prefix: { $in: routesPrefix },
                },
            },
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        year: "$year",
                        month: "$month",
                        route: "$prefix",
                    },
                    urls: { $push: "$url" },
                },
            },
            {
                $group: {
                    _id: {
                        userId: "$_id.userId",
                        year: "$_id.year",
                        month: "$_id.month",
                    },
                    routes: {
                        $push: {
                            k: "$_id.route",
                            v: "$urls",
                        },
                    },
                },
            },
            {
                $project: {
                    userId: "$_id.userId",
                    year: "$_id.year",
                    month: "$_id.month",
                    routes: { $arrayToObject: "$routes" },
                },
            },
        ];

        return this.collection.aggregate(aggregationQueries).toArray() as Promise<
            {
                userId: string;
                year: string;
                month: string;
                routes: Record<string, string[]>;
            }[]
        >;
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
