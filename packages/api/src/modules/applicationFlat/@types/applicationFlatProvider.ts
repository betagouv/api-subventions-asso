import Provider from "../../providers/@types/IProvider";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";

export default interface ApplicationFlatProvider extends Provider {
    isApplicationFlatProvider: boolean;

    getApplicationFlatStream(START_YEAR: number, END_YEAR: number): ReadableStream<ApplicationFlatEntity>;
}
