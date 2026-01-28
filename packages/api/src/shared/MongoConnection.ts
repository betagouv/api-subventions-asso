import * as mongoDB from "mongodb";
import * as Sentry from "@sentry/node";
import { MONGO_DBNAME, MONGO_URL, MONGO_PASSWORD, MONGO_USER } from "../configurations/mongo.conf";
import { ENV } from "../configurations/env.conf";
import mattermostNotifyPipe from "../modules/notify/outPipes/MattermostNotifyPipe";
import { MongoClientOptions } from "mongodb";

const connectionOptions: MongoClientOptions = {
    auth:
        MONGO_USER && MONGO_PASSWORD
            ? {
                  username: MONGO_USER,
                  password: MONGO_PASSWORD,
              }
            : undefined,
    maxPoolSize: 30,
    minPoolSize: 4,
    maxIdleTimeMS: 10 * 60 * 1000,
    socketTimeoutMS: 4 * 60 * 1000,
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

        // suppresion de l'évènement connectionClosed car l'ouverture et la fermeture des connexions sont le cycle de vie normal et souhaitable. Ca kill l'app :-(
        // pourquoi on kill l'app a chaque erreur, ca ne se reconnecte pas tout seul c'est ca le pb ?

        mongoClient.on("close", event => {
            // todo : cette evenement n'existe pas ?
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
