import * as mongoDB from "mongodb";
import {
    MONGO_METABASE_DBNAME,
    MONGO_METABASE_PASSWORD,
    MONGO_METABASE_URL,
    MONGO_METABASE_USER,
} from "../../../configurations/mongo.conf";

export class MetabaseDumpRepository {
    mongoClient: mongoDB.MongoClient;
    db: mongoDB.Db;

    constructor() {
        this.mongoClient = new mongoDB.MongoClient(MONGO_METABASE_URL, {
            auth:
                MONGO_METABASE_USER && MONGO_METABASE_PASSWORD
                ? {
                        username: MONGO_METABASE_USER,
                        password: MONGO_METABASE_PASSWORD,
                    }
                : undefined,
        });
        this.db = this.mongoClient.db(MONGO_METABASE_DBNAME);
    }

    public connectToDumpDatabase() {
        return this.mongoClient.connect().catch(reason => {
            console.log("MONGO CONNECTION ERROR\n");
            console.error(reason);
            process.exit(1);
        });
    }

    public addLogs(logs: unknown[]) {
        return this.db.collection("log").insertMany(logs as Document[]);
    }
    public addVisits(visits: unknown[]) {
        return this.db.collection("visits").insertMany(visits as Document[]);
    }

    public async upsertUsers(users: unknown[]) {
        await this.db.collection("users").deleteMany({});
        return this.db.collection("users").insertMany(users as Document[]);
    }
}

const metabaseDumpRepo = new MetabaseDumpRepository();

export default metabaseDumpRepo;
