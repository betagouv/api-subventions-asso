import Provider from "../../providers/@types/IProvider";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";

export default interface ApplicationFlatProvider extends Provider {
    isApplicationFlatProvider: boolean;

    saveFlatFromStream(stream: ReadableStream<ApplicationFlatEntity>): void;
    // is supposed to call flatService.saveFromStream
}
