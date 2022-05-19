import { DefaultObject } from '../../../@types';
import db from '../../../shared/MongoConnection';

export class StatsRepository {
    private readonly collection = db.collection("log");

    public async countUsersByRequestNbOnPeriod(start: Date, end: Date, nbReq: number, includesAdmin: boolean): Promise<number> {
        const matchQuery: { $match: DefaultObject } = { 
            $match: {
                timestamp: {
                    $gte: start,
                    $lte: end 
                }
            }
        };
        if (!includesAdmin) {
            matchQuery.$match['meta.req.user.roles'] = { $nin: ["admin"] };
        }

        return (await this.collection.aggregate([
            matchQuery,
            { $group : { _id : '$meta.req.user.email', nbOfRequest : { $sum : 1 } } },
            { $match: { "nbOfRequest": { $gte: nbReq } } },
            { $count: "nbOfUsers" }
        ]).next())?.nbOfUsers || 0; // If no stats found nbOfUsers is null but whant retrun an number
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
                matchQuery.$match['meta.req.user.roles'] = { $nin: ["admin"] };
            }

            return [
                matchQuery,
                { $group : { _id : '$meta.req.user.email', nbOfRequest : { $sum : 1 } } },
                { $sort: { nbOfRequest: 1 } }
            ]
        }

        const result = await this.collection.aggregate(buildQuery()).toArray();

        if (!result.length) return 0;

        const len = result.length;
        const middle = Math.floor(result.length / 2);

        if (len % 2 === 0) {
            return (result[middle - 1].nbOfRequest + result[middle].nbOfRequest) / 2;
        }
        
        return result[middle].nbOfRequest;
    }
}

const statsRepository = new StatsRepository();
export default statsRepository;