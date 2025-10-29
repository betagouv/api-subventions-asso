import { detectCsvDelimiter } from "./FileHelper";

describe("detectCsvDelimiter", () => {
    it("should detect ';' as delimiter", () => {
        const csv = "name;surname;age\nAlice;Dupont;25\nBob;Martin;30";
        const buffer = Buffer.from(csv, "utf-8");

        expect(detectCsvDelimiter(buffer)).toBe(";");
    });

    it("should detect ',' as delimiter", () => {
        const csv = "name,surname,age\nAlice,Dupont,25\nBob,Martin,30";
        const buffer = Buffer.from(csv, "utf-8");

        expect(detectCsvDelimiter(buffer)).toBe(",");
    });

    it("should detect '\t' as delimiter", () => {
        const csv = "name\tsurname\tage\nAlice\tDupont\t25\nBob\tMartin\t30";
        const buffer = Buffer.from(csv, "utf-8");

        expect(detectCsvDelimiter(buffer)).toBe("\t");
    });

    it("should detect ';' as default delimiter", () => {
        const buffer = Buffer.from("", "utf-8");

        expect(detectCsvDelimiter(buffer)).toBe(";");
    });

    it("csv with other encoding should works", () => {
        const csv = "name,surname,age\nAlice,Dupont,25\nBob,Martin,30";
        const buffer = Buffer.from(csv, "latin1");

        expect(detectCsvDelimiter(buffer)).toBe(",");
    });
});
