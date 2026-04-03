import type { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";

export default interface ApplicationFlatProvider {
    saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>): void;
}
