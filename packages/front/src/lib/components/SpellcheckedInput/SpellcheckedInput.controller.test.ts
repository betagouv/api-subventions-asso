import SpellcheckedInputController, { type MisspelledWord } from "./SpellcheckedInput.controller";

describe("SpellcheckedInputController", () => {
    const search = "tenis de table";
    const misspelledWord: MisspelledWord = {
        value: "tenis",
        start: 0,
        end: 5,
    };
    const controller = new SpellcheckedInputController();

    it("splits text around misspelled words for highlighting", () => {
        expect(controller.splitTextForHighlighting(search, [misspelledWord])).toEqual([
            { text: "tenis", misspelledWord },
            { text: " de table" },
        ]);
    });

    it("returns the misspelled word at the input caret position", () => {
        expect(controller.findMisspelledWordAtCaret([misspelledWord], 2)).toBe(misspelledWord);
        expect(controller.findMisspelledWordAtCaret([misspelledWord], 10)).toBeUndefined();
    });

    it("replaces only the misspelled word", () => {
        expect(controller.replaceMisspelledWord(search, misspelledWord, "tennis")).toBe("tennis de table");
    });
});
