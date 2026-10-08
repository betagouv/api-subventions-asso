import UseCase from "../../@types/use-case/UseCase";
import { extractWords } from "../../shared/helpers/StringHelper";

const STOP = new Set([
    "l",
    "d",
    "j",
    "m",
    "t",
    "s",
    "n",
    "c",
    // @TODO: uncomment this if needed
    //   "qu", "jusqu", "lorsqu", "puisqu", "quoiqu"
]);

export class SplitTextInTokens implements UseCase<string, string[]> {
    // remove words from elision (puisqu'il -> puisqu + il;)
    private removeElision(words: string[]) {
        return words.filter(word => !STOP.has(word));
    }

    execute(input: string): string[] {
        return this.removeElision(extractWords(input));
    }
}
