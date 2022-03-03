import rnaSirenService from "../../../src/modules/rna-siren/rnaSiren.service"
import db from "../../../src/shared/MongoConnection";

describe("RnaSirenService", () => {
    beforeEach(async () => {
        await rnaSirenService.add("W000000000", "000000000");
    })
    describe("add", () => {
        it("should be add", async () => {
            expect(await db.collection("rna-siren").findOne({rna: "W000000000"})).toMatchObject({rna: "W000000000", siren: "000000000"})
            expect(await db.collection("rna-siren").findOne({siren: "000000000"})).toMatchObject({rna: "W000000000", siren: "000000000"})
        })

        it("should not add because entry is already here", async () => {
            await rnaSirenService.add("W000000000", "000000000");
            expect(await db.collection("rna-siren").find({rna: "W000000000"}).toArray).toHaveLength(1)
            expect(await db.collection("rna-siren").findOne({siren: "000000000"})).toMatchObject({rna: "W000000000", siren: "000000000"})
        })
    })

    describe("getSiren", () => {
        it("should be retrun one siren", async () => {
            expect(await rnaSirenService.getSiren("W000000000")).toBe("000000000")
        })

        it("should not return siren", async () => {
            expect(await rnaSirenService.getSiren("W000000001")).toBe(null)
        })
    })

    describe("getRna", () => {
        it("should be retrun one siren", async () => {
            expect(await rnaSirenService.getRna("000000000")).toBe("W000000000")
        })

        it("should not return siren", async () => {
            expect(await rnaSirenService.getRna("000000001")).toBe(null)
        })
    })
});