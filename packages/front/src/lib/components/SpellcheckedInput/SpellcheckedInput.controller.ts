export interface MisspelledWord {
    value: string;
    start: number;
    end: number;
}

export interface HighlightSegment {
    text: string;
    misspelledWord?: MisspelledWord;
}

type SpellcheckWorkerRequestPayload = { type: "check"; text: string } | { type: "suggest"; word: string };
export type SpellcheckWorkerResponse =
    { id: number; result: MisspelledWord[] | string[] } | { id: number; error: string };
export type SpellcheckWorkerRequest = SpellcheckWorkerRequestPayload & { id: number };

const pendingRequests = new Map<number, { resolve: (result: unknown) => void; reject: (error: Error) => void }>();

let worker: Worker | undefined;
let workerRequestId = 0;

function getWorker() {
    if (worker) return worker;

    worker = new Worker(new URL("./spellchecked-input.worker.ts", import.meta.url), { type: "module" });

    worker.onmessage = ({ data }: MessageEvent<SpellcheckWorkerResponse>) => {
        const request = pendingRequests.get(data.id);
        if (!request) return;

        pendingRequests.delete(data.id);

        if ("error" in data) request.reject(new Error(data.error));
        else request.resolve(data.result);
    };

    return worker;
}

function sendRequest<T>(request: SpellcheckWorkerRequestPayload) {
    return new Promise<T>((resolve, reject) => {
        const id = ++workerRequestId;
        pendingRequests.set(id, { resolve: result => resolve(result as T), reject });
        getWorker().postMessage({ ...request, id });
    });
}

export default class SpellcheckedInputController {
    initialize() {
        getWorker();
    }

    checkSpelling(text: string) {
        return sendRequest<MisspelledWord[]>({ type: "check", text });
    }

    suggest(word: string) {
        return sendRequest<string[]>({ type: "suggest", word });
    }

    splitTextForHighlighting(text = "", misspelledWords: MisspelledWord[]): HighlightSegment[] {
        const segments: HighlightSegment[] = [];
        let segmentStart = 0;

        misspelledWords.forEach(misspelledWord => {
            if (segmentStart < misspelledWord.start)
                segments.push({ text: text.slice(segmentStart, misspelledWord.start) });

            segments.push({
                text: text.slice(misspelledWord.start, misspelledWord.end),
                misspelledWord,
            });

            segmentStart = misspelledWord.end;
        });

        if (segmentStart < text.length) segments.push({ text: text.slice(segmentStart) });

        return segments;
    }

    findMisspelledWordAtCaret(misspelledWords: MisspelledWord[], caretPosition: number) {
        return misspelledWords.find(word => caretPosition >= word.start && caretPosition <= word.end);
    }

    replaceMisspelledWord(text = "", misspelledWord: MisspelledWord, suggestion: string) {
        const { start, end } = misspelledWord;
        return text.slice(0, start) + suggestion + text.slice(end);
    }
}
