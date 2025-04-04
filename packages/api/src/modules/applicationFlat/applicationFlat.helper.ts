import { Readable } from "stream";
import { FindCursor } from "mongodb";
import ApplicationFlatEntity from "../../entities/ApplicationFlatEntity";

export function cursorToStream<T = Document>(
    findCursor: FindCursor<T>,
    adapter: (entity: T) => ApplicationFlatEntity,
): ReadableStream {
    // there are two types of stream and we want more modern web streams
    // cf https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/#transitioning-from-node-js-streams-to-web-streams
    return Readable.toWeb(findCursor.stream({ transform: entity => adapter(entity as T) })) as ReadableStream;
}
