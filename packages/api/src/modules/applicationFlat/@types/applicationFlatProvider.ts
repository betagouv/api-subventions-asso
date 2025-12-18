import type { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";

export default interface ApplicationFlatProvider {
    saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>): void;
}
