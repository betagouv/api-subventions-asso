import { bufferToMulterFile, detectCsvDelimiter } from "./FileHelper";

describe("FileHelper", () => {
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

    describe("bufferToMulterFile", () => {
        it("create valide multer file", () => {
            const testBuffer = Buffer.from("contenu de test");
            const testFilename = "test.csv";
            const testMimetype = "text/csv";

            const result = bufferToMulterFile(testBuffer, testFilename, testMimetype);

            expect(result).toEqual({
                buffer: testBuffer,
                originalname: testFilename,
                mimetype: testMimetype,
                fieldname: "file",
                encoding: "7bit",
                size: testBuffer.length,
                destination: "",
                filename: "",
                path: "",
                stream: {},
            });
        });

        it("create multer file when empty buffer", () => {
            const testBuffer = Buffer.alloc(0);
            const testFilename = "empty.csv";
            const testMimetype = "text/csv";

            const result = bufferToMulterFile(testBuffer, testFilename, testMimetype);

            expect(result).toEqual({
                buffer: testBuffer,
                destination: "",
                encoding: "7bit",
                fieldname: "file",
                filename: "",
                mimetype: testMimetype,
                originalname: testFilename,
                path: "",
                size: 0,
                stream: {},
            });
        });
    });
});
