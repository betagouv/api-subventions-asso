import { Readable } from "stream";
import { FindCursor, Document } from "mongodb";
import { ApplicationFlatEntity } from "../../entities/ApplicationFlatEntity";
import { ReadableStream } from "node:stream/web";

export function cursorToStream<T = Document>(
    findCursor: FindCursor<T>,
    adapter: (entity: T) => ApplicationFlatEntity | null,
) {
    // there are two types of stream and we want more modern web streams
    // cf https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/#transitioning-from-node-js-streams-to-web-streams
    return Readable.toWeb(
        findCursor.stream({ transform: entity => adapter(entity as T) as Document }),
    ) as ReadableStream<ApplicationFlatEntity>;
}
