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
            { $group : { _id : '$meta.req.user.email', nbOfRequest : { $sum : 1} } },
            { $match: { "nbOfRequest": { $gte: nbReq } } },
            { $count: "nbOfUsers" }
        ]).next())?.nbOfUsers || 0; // If no stats found nbOfUsers is null but whant retrun an number
    }
}

const statsRepository = new StatsRepository();
export default statsRepository;