import db from '../../../shared/MongoConnection';

export class StatsRepository {
    private readonly collection = db.collection("log");

    public async countUsersByRequestNbOnPeriod(start: Date, end: Date, nbReq: number) {
        const aggregate = await this.collection.aggregate([
            { $match: { timestamp: { $gte: start, $lte: end } } } ,
            {$group : { _id : '$meta.req.user.email', nbOfRequest : {$sum : 1}}},
            { $match: { "nbOfRequest": { $gte: nbReq } } },
            { $count: "nbOfUsers"}
        ]);
        const result = await aggregate.next();
        if (result) return result.nbOfUsers;
        return null;
    }
}

const statsRepository = new StatsRepository();
export default statsRepository;