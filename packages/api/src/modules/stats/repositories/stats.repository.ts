import { RoleEnum } from "../../../@enums/Roles";
import { DefaultObject } from "../../../@types";
import db from "../../../shared/MongoConnection";

export class StatsRepository {
    private readonly collection = db.collection("log");

    public async countMedianRequestsOnPeriod(start: Date, end: Date, includesAdmin: boolean): Promise<number> {
        const buildQuery = () => {
            const matchQuery: { $match: DefaultObject } = {
                $match: {
                    timestamp: {
                        $gte: start,
                        $lte: end,
                    },
                    "meta.req.user.email": { $ne: null },
                    "meta.req.url": /\/(association|etablissement)\/.{9,14}$/,
                },
            };
            if (!includesAdmin) {
                matchQuery.$match["meta.req.user.roles"] = { $nin: [RoleEnum.admin] };
            }

            return [
                matchQuery,
                { $group: { _id: "$meta.req.user.email", nbOfRequest: { $sum: 1 } } },
                { $sort: { nbOfRequest: 1 } },
            ];
        };

        const result = await this.collection.aggregate(buildQuery()).toArray();

        if (!result.length) return 0;

        const middle = Math.floor(result.length / 2);

        if (result.length % 2 === 0) {
            return (result[middle - 1].nbOfRequest + result[middle].nbOfRequest) / 2;
        }

        return result[middle].nbOfRequest;
    }

    public countRequestsPerMonthByYear(year: number, includesAdmin: boolean) {
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 0);
        const buildQuery = () => {
            const matchQuery: { $match: DefaultObject } = {
                $match: {
                    timestamp: {
                        $gte: start,
                        $lte: end,
                    },
                    "meta.req.user.email": { $ne: null },
                },
            };
            if (!includesAdmin) matchQuery.$match["meta.req.user.roles"] = { $nin: [RoleEnum.admin] };

            return [matchQuery, { $group: { _id: { $month: "$timestamp" }, nbOfRequests: { $sum: 1 } } }];
        };

        return this.collection.aggregate(buildQuery()).toArray();
    }

    public getLogsWithRegexUrl(regex: RegExp) {
        return this.collection.find({
            "meta.req.url": regex,
        });
    }

    public findByEmail(email: string) {
        return this.collection
            .find({
                "meta.req.user.email": email,
            })
            .toArray();
    }
}

const statsRepository = new StatsRepository();
export default statsRepository;
