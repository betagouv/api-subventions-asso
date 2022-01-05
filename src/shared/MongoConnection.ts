import * as mongoDB from "mongodb";
import {MONGO_DBNAME, MONGO_URL, MONGO_PASSWORD, MONGO_USER} from '../configurations/mongo.conf';


const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    MONGO_URL, {
        auth: MONGO_USER && MONGO_PASSWORD ? {
            username: MONGO_USER,
            password: MONGO_PASSWORD
        }: undefined
    }
);

export const connectionPromise = client.connect().catch((reason => {
    console.log("MONGO CONNECTION ERROR")
    console.error(reason);
    process.exit(1);
}));
    
export default client.db(MONGO_DBNAME);