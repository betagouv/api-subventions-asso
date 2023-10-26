import * as mongoDB from "mongodb";
import { MONGO_DBNAME, MONGO_URL, MONGO_PASSWORD, MONGO_USER } from "../configurations/mongo.conf";
import { repositoriesWithIndexes } from "../modules/repository.list";

import { asyncForEach } from "./helpers/ArrayHelper";

const mongoClient: mongoDB.MongoClient = new mongoDB.MongoClient(MONGO_URL, {
    auth:
        MONGO_USER && MONGO_PASSWORD
            ? {
                  username: MONGO_USER,
                  password: MONGO_PASSWORD,
              }
            : undefined,
});

export const connectDB = () =>
    mongoClient.connect().catch(reason => {
        console.log("MONGO CONNECTION ERROR\n");
        console.error(reason);
        process.exit(1);
    });

export const initIndexes = () => asyncForEach(repositoriesWithIndexes, repository => repository.createIndexes());
export const client = mongoClient;

export default mongoClient.db(MONGO_DBNAME);
