import * as mongoDB from "mongodb";
import { AgentTypeEnum, TerritorialScopeEnum } from "dto";
import { AnyBulkWriteOperation, Document } from "mongodb";

import {
    MONGO_METABASE_DBNAME,
    MONGO_METABASE_PASSWORD,
    MONGO_METABASE_URL,
    MONGO_METABASE_USER,
} from "../../../configurations/mongo.conf";
import { DataLogEntity } from "../../../modules/data-log/entities/dataLogEntity";
import { MetabaseDumpPort } from "./metabase-dump.port";

export class MetabaseDumpAdapter implements MetabaseDumpPort {
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

    public async connectToDumpDatabase(): Promise<void> {
        await this.mongoClient.connect().catch(reason => {
            console.log("MONGO CONNECTION ERROR\n");
            console.error(reason);
            process.exit(1);
        });
    }

    public async addLogs(logs: unknown[]): Promise<void> {
        await this.db.collection("log").insertMany(logs as Document[]);
    }

    public async addVisits(visits: unknown[]): Promise<void> {
        await this.db.collection("visits").insertMany(visits as Document[]);
    }

    public async upsertUsers(users: unknown[]): Promise<void> {
        await this.db.collection("users").deleteMany({});
        await this.db.collection("users").insertMany(users as Document[]);
    }

    public async patchWithPipedriveData(): Promise<void> {
        await this.db
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
                        // region for everyone but central agents
                        region: {
                            $cond: {
                                if: { $eq: ["$agentType", AgentTypeEnum.CENTRAL_ADMIN] },
                                then: "$$REMOVE",
                                else: {
                                    $cond: {
                                        if: { $eq: ["$region", "Administration centrale"] },
                                        then: "$$REMOVE",
                                        else: "$region",
                                    },
                                },
                            },
                        },
                    },
                },

                // clean
                {
                    $project: {
                        department: 0,
                        pipedriveData: 0,
                    },
                },
                { $out: "users" },
            ])
            .toArray();
    }

    public async savePipedrive(users): Promise<void> {
        const operations: AnyBulkWriteOperation[] = [];
        for (const user of users) {
            operations.push({
                updateOne: {
                    filter: { email: user.email },
                    update: { $set: user },
                    upsert: true,
                },
            });
        }
        await this.db.collection("users-pipedrive").bulkWrite(operations);
    }

    public async cleanAfterDate(date: Date): Promise<void> {
        await this.db.collection("log").deleteMany({ timestamp: { $gt: date } });
    }

    public async upsertDepositLogs(depositLogs: unknown[]): Promise<void> {
        await this.db.collection("deposit-logs").deleteMany({});
        await this.db.collection("deposit-logs").insertMany(depositLogs as Document[]);
    }

    public async upsertDataLog(dataLogs: AsyncIterable<DataLogEntity>): Promise<void> {
        await this.db.collection("data-log").deleteMany({});

        const batchSize = 1000;
        let batch: Document[] = [];

        for await (const doc of dataLogs) {
            batch.push(doc as Document);

            if (batch.length >= batchSize) {
                await this.db.collection("data-log").insertMany(batch);
                batch = [];
            }
        }

        if (batch.length > 0) {
            await this.db.collection("data-log").insertMany(batch);
        }
    }
}

const metabaseDumpPort = new MetabaseDumpAdapter();

export default metabaseDumpPort;
