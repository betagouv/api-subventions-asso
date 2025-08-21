import type { ReadableStream } from "node:stream/web";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";

export default interface ApplicationFlatProvider {
    isApplicationFlatProvider: true;

    saveFlatFromStream(stream: ReadableStream<ApplicationFlatEntity>): void;
    // is supposed to call flatService.saveFromStream
}
