import { RoleEnum } from "../../../@enums/Roles";
import { DefaultObject } from "../../../@types";
import db from "../../../shared/MongoConnection";
import { frenchToEnglishMonthsMap } from "../../../shared/helpers/DateHelper";
import { capitalizeFirstLetter } from "../../../shared/helpers/StringHelper";
import { MonthlyAvgRequest } from "@api-subventions-asso/dto";

export class StatsRepository {
    private readonly collection = db.collection("log");

    public async countUsersByRequestNbOnPeriod(
        start: Date,
        end: Date,
        nbReq: number,
        includesAdmin: boolean
    ): Promise<number> {
        const matchQuery: { $match: DefaultObject } = {
            $match: {
                timestamp: {
                    $gte: start,
                    $lte: end
                }
            }
        };
        if (!includesAdmin) {
            matchQuery.$match["meta.req.user.roles"] = { $nin: [RoleEnum.admin] };
        }

        return (
            (
                await this.collection
                    .aggregate([
                        matchQuery,
                        { $group: { _id: "$meta.req.user.email", nbOfRequest: { $sum: 1 } } },
                        { $match: { nbOfRequest: { $gte: nbReq } } },
                        { $count: "nbOfUsers" }
                    ])
                    .next()
            )?.nbOfUsers || 0
        ); // If no stats found nbOfUsers is null but whant retrun an number
    }

    public async countMedianRequestsOnPeriod(start: Date, end: Date, includesAdmin: boolean): Promise<number> {
        const buildQuery = () => {
            const matchQuery: { $match: DefaultObject } = {
                $match: {
                    timestamp: {
                        $gte: start,
                        $lte: end
                    },
                    "meta.req.user.email": { $ne: null }
                }
            };
            if (!includesAdmin) {
                matchQuery.$match["meta.req.user.roles"] = { $nin: [RoleEnum.admin] };
            }

            return [
                matchQuery,
                { $group: { _id: "$meta.req.user.email", nbOfRequest: { $sum: 1 } } },
                { $sort: { nbOfRequest: 1 } }
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

    /**
     * To ensure a meaningful response, start must be the first day of a month and end the last day of a month
     */
    public async monthlyAvgRequestsOnPeriod(year: number, includesAdmin: boolean): Promise<MonthlyAvgRequest> {
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 0);
        const buildQuery = () => {
            const matchQuery: { $match: DefaultObject } = {
                $match: {
                    timestamp: {
                        $gte: start,
                        $lte: end
                    },
                    "meta.req.user.email": { $ne: null }
                }
            };
            if (!includesAdmin) {
                matchQuery.$match["meta.req.user.roles"] = { $nin: [RoleEnum.admin] };
            }
            const annotateQuery = { $addFields: { month: { $month: "$timestamp" } } };
            const groupQueries = [
                { $group: { _id: { user: "$meta.req.user.email", month: "$month" }, nbOfRequests: { $count: {} } } },
                { $group: { _id: "$_id.month", nbOfRequests: { $avg: "$nbOfRequests" } } }
            ];

            return [matchQuery, annotateQuery, ...groupQueries];
        };

        const queryResult = await this.collection.aggregate(buildQuery()).toArray();
        const resultByMonth0Index = {};
        for (const { _id, nbOfRequests } of queryResult) {
            resultByMonth0Index[_id - 1] = nbOfRequests;
        }
        return Object.values(frenchToEnglishMonthsMap).reduce((acc, monthLowercase, index) => {
            acc[capitalizeFirstLetter(monthLowercase)] = resultByMonth0Index[index] || 0;
            return acc;
        }, {});
    }

    /*
    * stat controller

request-mediane

écrire request-
passer période mais défaut 1 an*/
}

const statsRepository = new StatsRepository();
export default statsRepository;
