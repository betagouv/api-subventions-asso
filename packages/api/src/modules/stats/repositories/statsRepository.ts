import db from '../../../shared/MongoConnection';
export class StatsRepository {
    private readonly collection = db.collection("log");

    public async countUsersByRequestNbOnPeriod(start: string, end: string, nb: string | number) {
        nb = Number(nb);
        let counter = 0;
        await this.collection.aggregate([
            { $match: { timestamp: { $gte: start, $lte: end } } } ,
            {$group : { _id : '$meta.user.email', nbOfRequest : {$sum : 1}}},
            { $match: { "nbOfRequest": { $gte: nb } } }
        ]).forEach(() => { counter++ });
        return counter;
    }
}

const statsRepository = new StatsRepository();
export default statsRepository;