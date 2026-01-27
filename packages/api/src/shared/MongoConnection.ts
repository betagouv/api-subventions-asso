import * as mongoDB from "mongodb";
import * as Sentry from "@sentry/node";
import { MONGO_DBNAME, MONGO_URL, MONGO_PASSWORD, MONGO_USER } from "../configurations/mongo.conf";
import { ENV } from "../configurations/env.conf";
import mattermostNotifyPipe from "../modules/notify/outPipes/MattermostNotifyPipe";

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
    let lastNotificationTime = 0;
    const NOTIFICATION_COOLDOWN = 180000;

    const notifyLostConnection = listener => {
        const now = Date.now();
        if (now - lastNotificationTime > NOTIFICATION_COOLDOWN) {
            mattermostNotifyPipe.connectionLost(listener);
            lastNotificationTime = now;
        }
    };

    mongoClient
        .connect()
        .catch(reason => {
            console.log("MONGO CONNECTION ERROR\n");
            console.error(reason);
            process.exit(1);
        })
        .finally(() => console.log("End of mongo connection process"));

    if (ENV !== "test") {
        mongoClient.on("connectionCreated", _event => console.log("datasub - connection created"));

        // trying to figure out why we have so many disconnections on production
        // and for now we don't know which event would be fired on such disconnections
        // TODO: only keeps one of those events if we figure out which one is the right one

        mongoClient.on("close", event => {
            console.log("datasub - connection closed");
            notifyLostConnection(event);
            mongoClient.connect().catch(reason => {
                console.log("MONGO CONNECTION ERROR\n");
                console.error(reason);
                process.exit(1);
            });
        });

        mongoClient.on("serverClosed", event => {
            console.log("datasub - mongo server closed");
            notifyLostConnection(event);
            mongoClient.connect().catch(reason => {
                console.log("MONGO CONNECTION ERROR\n");
                console.error(reason);
                process.exit(1);
            });
        });

        mongoClient.on("connectionClosed", event => {
            console.log("datasub - Mongo connection closed, trying to reconnect...", event);
            notifyLostConnection(event);
            mongoClient.connect().catch(reason => {
                console.log("MONGO CONNECTION ERROR\n");
                console.error(reason);
                process.exit(1);
            });
        });
    }
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
