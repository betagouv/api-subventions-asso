/* eslint-disable @typescript-eslint/no-unused-vars */
import { Association } from "@api-subventions-asso/dto";
import leCompteAssoService from "../../../../src/modules/providers/leCompteAsso/leCompteAsso.service";
import osirisService from "../../../../src/modules/providers/osiris/osiris.service";
import RnaSiren from "../../../../src/modules/open-data/rna-siren/entities/RnaSirenEntity";
import rnaSirenService from "../../../../src/modules/open-data/rna-siren/rnaSiren.service";
import db from "../../../../src/shared/MongoConnection";

// Not the same as entity from MongoDB
// It is supposed to reference new RnaSiren from a provider document
const RnaSirenArray = [
    { rna: "W000000000", siren: "000000000" },
    { rna: "W000000001", siren: "000000001" },
    { rna: "W000000002", siren: "000000002" },
    { rna: "W000000003", siren: "000000003" }
];

describe("RnaSirenService", () => {
    beforeEach(async () => {
        await Promise.all(RnaSirenArray.map(entity => rnaSirenService.add(entity.rna, entity.siren)));
    });

    afterEach(async () => {
        await db.collection("rna-siren").drop();
    });
    describe("add", () => {
        it("should add RnaSiren", async () => {
            expect(await db.collection("rna-siren").findOne({ rna: "W000000000" })).toMatchObject({
                rna: "W000000000",
                siren: "000000000"
            });
            expect(await db.collection("rna-siren").findOne({ siren: "000000000" })).toMatchObject({
                rna: "W000000000",
                siren: "000000000"
            });
        });

        it("should not add because entry is already here", async () => {
            await rnaSirenService.add("W000000000", "000000000");
            expect(await db.collection("rna-siren").find({ rna: "W000000000" }).toArray).toHaveLength(1);
            expect(await db.collection("rna-siren").findOne({ siren: "000000000" })).toMatchObject({
                rna: "W000000000",
                siren: "000000000"
            });
        });
    });

    describe("getSiren", () => {
        it("should retrun one siren", async () => {
            expect(await rnaSirenService.getSiren(RnaSirenArray[0].rna)).toBe(RnaSirenArray[0].siren);
        });

        it("should not return siren", async () => {
            expect(await rnaSirenService.getSiren("W000000004")).toBe(null);
        });
    });

    describe("getRna", () => {
        it("should be retrun one rna", async () => {
            expect(await rnaSirenService.getRna("000000000")).toBe("W000000000");
        });

        it("should not return rna", async () => {
            expect(await rnaSirenService.getRna("000000004")).toBe(null);
        });

        it("should return oriris rna", async () => {
            jest.spyOn(osirisService, "getAssociationsBySiren").mockImplementationOnce(() =>
                Promise.resolve([
                    {
                        rna: [{ value: "W000000001" }],
                        siren: [{ value: "000000001" }]
                    }
                ] as unknown as Association[])
            );

            expect(await rnaSirenService.getRna("000000001")).toBe("W000000001");
        });

        it("should return lca rna", async () => {
            jest.spyOn(leCompteAssoService, "getAssociationsBySiren").mockImplementationOnce(() =>
                Promise.resolve([
                    {
                        rna: [{ value: "W000000001" }],
                        siren: [{ value: "000000001" }]
                    }
                ] as unknown as Association[])
            );

            expect(await rnaSirenService.getRna("000000001")).toBe("W000000001");
        });
    });

    describe("insertMany", () => {
        it("should be insert 3 entities", async () => {
            const entities = [new RnaSiren("aaa", "111"), new RnaSiren("bbb", "222"), new RnaSiren("ccc", "333")];

            const previous = await db.collection("rna-siren").find().count();
            await rnaSirenService.insertMany(entities);
            const next = await db.collection("rna-siren").find().count();

            expect(next - previous).toBe(3);
        });
    });

    describe("cleanDuplicate", () => {
        beforeEach(async () => {
            const entities = [new RnaSiren("W000000000", "000000000"), new RnaSiren("W000000001", "000000001")];

            await rnaSirenService.insertMany(entities);
        });
        it("should be clean duplicates entities", async () => {
            await rnaSirenService.cleanDuplicate();
            expect(await db.collection("rna-siren").find().count()).toBe(RnaSirenArray.length);
        });
    });
});
