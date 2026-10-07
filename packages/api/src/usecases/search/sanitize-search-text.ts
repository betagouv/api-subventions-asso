import UseCase from "../../@types/use-case/UseCase";
import { removeAccents } from "../../shared/helpers/StringHelper";

export class SanitizeSearchText implements UseCase<string, string> {
    execute(input: string) {
        // we had spaces to force search on whole word (beginning and end of the phrase)
        // this has to be done for both search field in document and input
        return " " + removeAccents(input).toLowerCase() + " ";
    }
}
