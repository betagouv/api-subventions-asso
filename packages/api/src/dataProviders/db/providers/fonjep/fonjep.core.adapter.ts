import { Document } from "mongodb";
import MongoPort from "../../../../shared/MongoPort";
import { FonjepCorePort } from "./fonjep-core.port";

export abstract class FonjepCoreAdapter<FonjepTypedDocument extends Document>
    extends MongoPort<FonjepTypedDocument>
    implements FonjepCorePort
{
    private tmpCollectionEnabled = false;

    useTemporyCollection(active: boolean) {
        this.tmpCollectionEnabled = active;
    }

    async applyTemporyCollection(): Promise<void> {
        this.useTemporyCollection(false);
        await this.collection.rename(this.collectionName + "-OLD");
        await this.getTmpCollection().rename(this.collectionName);
        await this.getOldCollection().drop();
    }

    protected get collection() {
        if (this.tmpCollectionEnabled) {
            return this.getTmpCollection();
        }

        return super.collection;
    }

    private getTmpCollection() {
        return this.db.collection<FonjepTypedDocument>(this.collectionName + "-tmp-collection");
    }

    private getOldCollection() {
        return this.db.collection<FonjepTypedDocument>(this.collectionName + "-OLD");
    }
}
