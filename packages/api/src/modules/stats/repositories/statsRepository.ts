import db from '../../../shared/MongoConnection';

export class StatsRepository {
    private readonly collection = db.collection("log");

    public async countUsersByRequestNbOnPeriod(start: Date, end: Date, nbReq: number) {
        return (await this.collection.aggregate([
            { $match: { timestamp: { $gte: start, $lte: end } } } ,
            { $group : { _id : '$meta.req.user.email', nbOfRequest : { $sum : 1} } },
            { $match: { "nbOfRequest": { $gte: nbReq } } },
            { $count: "nbOfUsers" }
        ]).next())?.nbOfUsers;
    }
}

const statsRepository = new StatsRepository();
export default statsRepository;