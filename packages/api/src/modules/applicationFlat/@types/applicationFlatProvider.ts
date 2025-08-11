import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import { ReadableStream } from "node:stream/web";

export default interface ApplicationFlatProvider {
    isApplicationFlatProvider: true;

    saveFlatFromStream(stream: ReadableStream<ApplicationFlatEntity>): void;
    // is supposed to call flatService.saveFromStream
}
