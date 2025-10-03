import * as mongoDB from "mongodb";
import * as Sentry from "@sentry/node";
import { MONGO_DBNAME, MONGO_URL, MONGO_PASSWORD, MONGO_USER } from "../configurations/mongo.conf";
import { ENV } from "../configurations/env.conf";

const connectionOptions = {
    auth:
        MONGO_USER && MONGO_PASSWORD
            ? {
                  username: MONGO_USER,
                  password: MONGO_PASSWORD,
              }
            : undefined,
};

const mongoClient: mongoDB.MongoClient = new mongoDB.MongoClient(MONGO_URL, connectionOptions);

export const connectDB = () => {
    mongoClient.connect().catch(reason => {
        console.log("MONGO CONNECTION ERROR\n");
        console.error(reason);
        process.exit(1);
    });

    mongoClient.on("connectionClosed", event => {
        console.log("Mongo connection closed, trying to reconnect...", event);
        mongoClient.connect().catch(reason => {
            console.log("MONGO CONNECTION ERROR\n");
            console.error(reason);
            process.exit(1);
        });
    });
};

export const client = mongoClient;

export const mongoSessionStoreConfig = { uri: MONGO_URL, collection: "sessions", connectionOptions };

export default mongoClient.db(MONGO_DBNAME, { ignoreUndefined: true });

if (!["test", "dev"].includes(ENV)) {
    const events: string[] = [
        "serverOpening",
        "serverClosed",
        "serverDescriptionChanged",
        "topologyOpening",
        "topologyClosed",
        "topologyDescriptionChanged",
        "serverHeartbeatFailed",
    ];
    for (const eventName of events) {
        client.on(eventName, data => console.log(eventName, data));
    }

    client.on("serverHeartbeatFailed", data => Sentry.captureException(new Error("mongo failed heartbeat"), { data }));
}
