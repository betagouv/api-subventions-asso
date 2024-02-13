import * as mongoDB from "mongodb";
import { AgentTypeEnum, TerritorialScopeEnum } from "dto";
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

    public patchWithPipedriveData() {
        return this.db
            .collection("users")
            .aggregate([
                // join
                {
                    $lookup: {
                        from: "users-pipedrive",
                        localField: "email",
                        foreignField: "email",
                        as: "pipedriveData",
                    },
                },
                { $addFields: { pipedriveData: { $arrayElemAt: ["$pipedriveData", 0] } } },

                // merge pipedrive data with data from api
                { $replaceRoot: { newRoot: { $mergeObjects: ["$pipedriveData", "$$ROOT"] } } },

                // adjust data formats
                {
                    $addFields: {
                        // jobType is an array so $replaceRoot always keeps original data
                        jobType: {
                            $cond: {
                                if: { $eq: ["$jobType", []] },
                                then: {
                                    $cond: {
                                        if: { $eq: ["$pipedriveData.jobType", []] },
                                        then: [],
                                        else: "$pipedriveData.jobType",
                                    },
                                },
                                else: "$jobType",
                            },
                        },
                        // territory is deduced depending on decentralizedLevel
                        decentralizedTerritory: {
                            $cond: {
                                if: { $eq: ["$decentralizedLevel", TerritorialScopeEnum.DEPARTMENTAL] },
                                then: "$department",
                                else: {
                                    $cond: {
                                        if: { $eq: ["$decentralizedLevel", TerritorialScopeEnum.REGIONAL] },
                                        then: "$region",
                                        else: "$$REMOVE",
                                    },
                                },
                            },
                        },
                    },
                },

                // clean
                {
                    $project: {
                        region: 0,
                        department: 0,
                        pipedriveData: 0,
                    },
                },
                { $out: "users" },
            ])
            .toArray();
    }

    public savePipedrive(users) {
        return this.db.collection("users-pipedrive").insertMany(users as Document[]);
    }
}

const metabaseDumpRepo = new MetabaseDumpRepository();

export default metabaseDumpRepo;
