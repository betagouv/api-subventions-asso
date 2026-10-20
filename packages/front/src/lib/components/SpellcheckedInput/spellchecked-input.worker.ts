import Typo from "typo-js";
import { isIdentifier } from "$lib/helpers/identifierHelper";
import type { MisspelledWord, SpellcheckWorkerRequest, SpellcheckWorkerResponse } from "./SpellcheckedInput.controller";

interface SpellcheckDictionary {
    check(word: string): boolean;
    suggest(word: string, limit?: number): string[];
}

async function fetchDictionaryFile(path: string) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Impossible de charger le dictionnaire (${response.status})`);
    return response.text();
}

const spellcheckDictionary: Promise<SpellcheckDictionary> = Promise.all([
    fetchDictionaryFile("/dictionaries/fr.aff"),
    fetchDictionaryFile("/dictionaries/fr.dic"),
]).then(([affixData, wordsData]) => new Typo("fr_FR", affixData, wordsData));

const tokenPattern = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu; // Unicode words (including internal apostrophes and hyphens)
const letterPattern = /\p{L}/u; // Matches at least one unicode letter
const suggestionLimit = 3;

function checkSpelling(text: string, dictionary: SpellcheckDictionary): MisspelledWord[] {
    return [...text.matchAll(tokenPattern)]
        .map(match => ({
            value: match[0],
            start: match.index,
            end: match.index + match[0].length,
        }))
        .filter(word => !isIdentifier(word.value))
        .filter(word => letterPattern.test(word.value))
        .filter(word => !dictionary.check(word.value));
}

self.onmessage = async ({ data }: MessageEvent<SpellcheckWorkerRequest>) => {
    try {
        const dictionary = await spellcheckDictionary;

        if (data.type === "check") {
            const response: SpellcheckWorkerResponse = {
                id: data.id,
                result: checkSpelling(data.text, dictionary),
            };

            self.postMessage(response);
        } else {
            const response: SpellcheckWorkerResponse = {
                id: data.id,
                result: dictionary.suggest(data.word, suggestionLimit),
            };

            self.postMessage(response);
        }
    } catch (error) {
        const response: SpellcheckWorkerResponse = {
            id: data.id,
            error: error instanceof Error ? error.message : "Erreur du correcteur orthographique",
        };

        self.postMessage(response);
    }
};
