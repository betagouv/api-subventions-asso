import ChorusLineEntity from "../../../../src/modules/providers/chorus/entities/ChorusLineEntity";
import chorusService from "../../../../src/modules/providers/chorus/chorus.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";
import { WithId } from "mongodb";
import rnaSirenService from "../../../../src/modules/rna-siren/rnaSiren.service";

describe("chorus.service", () => {

    describe("validateEntity", () => {
        it('should be reject because codeBranche not accepted', () => {
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "WRONG CODE",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual( { success: false, message: `The branche ${entity.indexedInformations.codeBranche} is not accepted in data`, data: entity })
        })

        it('should be reject amount is not number', () => {
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "00000",
                amount: undefined as unknown as number,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `Amount is not a number`, data: entity })
        })

        it('should be reject dateOperation is not Date', () => {
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "00000",
                amount: 1000,
                dateOperation: "01/01/1960" as unknown as Date,
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `Operation date is not a valid date`, data: entity })
        })

        it('should be reject siret is not valid', () => {
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "SIRET",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `INVALID SIRET FOR ${entity.indexedInformations.siret}`, data: entity })
        })

        it('should be reject ej is not valid', () => {
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `INVALID EJ FOR ${entity.indexedInformations.ej}`, data: entity })
        })

        it('should be accept', () => {
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: true })
        })
    });

    describe("addChorusLine", () => {
        it("should be reject because entity is not valid", async () => {
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "SIRET",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({ state: "rejected", result: expect.objectContaining({ success: false, message: "INVALID SIRET FOR SIRET"})});
        })

        it("should be create entity", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementationOnce(() => Promise.resolve(true))
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({ state: "created", result: entity });

            mock.mockRestore();
        })

        it("should not create entity because code branche is not accepted", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementationOnce(() => Promise.resolve(false))
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z044",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({ state: "rejected", result: {
                message: "The Siret does not correspond to an association",
                data: entity,
            }});

            mock.mockRestore();
        })

        it("should be update entity", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))
            
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});

            await chorusService.addChorusLine(entity);

            entity.data = { "test": "update" };

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({ state: "updated", result: entity });
            mock.mockRestore();
        })

        it("should be not update because same ej but not same amout", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))
            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});

            await chorusService.addChorusLine(entity);

            entity.indexedInformations.amount = 5000;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {_id, ...entityWithoutId } = entity

            await expect(chorusService.addChorusLine(entityWithoutId)).resolves.toEqual({ state: "created", result: entityWithoutId });
            mock.mockRestore();
        })

        it("should be not update because same ej but not operation data", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))

            const entity = new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {});

            await chorusService.addChorusLine(entity);

            entity.indexedInformations.dateOperation = new Date(1,1,1970);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {_id, ...entityWithoutId } = entity

            await expect(chorusService.addChorusLine(entityWithoutId)).resolves.toEqual({ state: "created", result: entityWithoutId });

            mock.mockRestore();
        })
    })

    describe("getVersementsBySiret", () => {
        const now = new Date();
        let entity: WithId<ChorusLineEntity>
        const toPV = (value: unknown, provider = "Chorus") => ProviderValueAdapter.toProviderValue(value, provider, now);

        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))
            entity = (await chorusService.addChorusLine(new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: now,
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {}))).result as WithId<ChorusLineEntity>;
        })

        afterEach(() => {
            mock.mockRestore();
        })

        it("should be find entity", async () => {
            await expect(chorusService.getVersementsBySiret("10000000000000")).resolves.toEqual([{
                id: entity._id.toString(),
                siret: toPV("10000000000000"),
                ej: toPV("1000000000"),
                amount: toPV(1000),
                dateOperation: toPV(now),
                branche: toPV("BRANCHE"),
                codeBranche: toPV("Z004"),
                compte: toPV("COMPTE"),
                type: toPV("ZSUB")
            }]);
        })
        it("should be no find entity", async () => {
            await expect(chorusService.getVersementsBySiret("10000000000004")).resolves.toHaveLength(0);
        })
    })

    describe("getVersementsBySiren", () => {
        const now = new Date();
        let entity: WithId<ChorusLineEntity>
        const toPV = (value: unknown, provider = "Chorus") => ProviderValueAdapter.toProviderValue(value, provider, now);
        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))
            entity = (await chorusService.addChorusLine(new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: now,
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {}))).result as WithId<ChorusLineEntity>;
        })

        afterEach(() => {
            mock.mockRestore();
        })

        it("should be find entity", async () => {
            await expect(chorusService.getVersementsBySiren("100000000")).resolves.toEqual([{
                id: entity._id.toString(),
                siret: toPV("10000000000000"),
                ej: toPV("1000000000"),
                amount: toPV(1000),
                dateOperation: toPV(now),
                branche: toPV("BRANCHE"),
                codeBranche: toPV("Z004"),
                compte: toPV("COMPTE"),
                type: toPV("ZSUB")
            }]);
        })
        it("should be no find entity", async () => {
            await expect(chorusService.getVersementsBySiren("100000009")).resolves.toHaveLength(0);
        })
    })

    describe("getVersementsBySiren", () => {
        const now = new Date();
        let entity: WithId<ChorusLineEntity>
        const toPV = (value: unknown, provider = "Chorus") => ProviderValueAdapter.toProviderValue(value, provider, now);
        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;
    
        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true))
            entity = (await chorusService.addChorusLine(new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: now,
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {}))).result as WithId<ChorusLineEntity>;
        })

        afterEach(() => {
            mock.mockRestore();
        })

        it("should be find entity", async () => {
            await expect(chorusService.getVersementsByEJ("1000000000")).resolves.toEqual([{
                id: entity._id.toString(),
                siret: toPV("10000000000000"),
                ej: toPV("1000000000"),
                amount: toPV(1000),
                dateOperation: toPV(now),
                branche: toPV("BRANCHE"),
                codeBranche: toPV("Z004"),
                compte: toPV("COMPTE"),
                type: toPV("ZSUB")
            }]);
        })
        it("should be no find entity", async () => {
            await expect(chorusService.getVersementsByEJ("2000000000")).resolves.toHaveLength(0);
        })
    })


    describe("getVersementsBySiren", () => {
        const now = new Date();

        beforeEach(async () => {
            jest.clearAllMocks();
            jest.spyOn(chorusService, "sirenBelongAsso").mockImplementationOnce(() => Promise.resolve(true))

            await chorusService.addChorusLine(new ChorusLineEntity("FAKE_ID", {
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: now,
                branche: "BRANCHE",
                codeBranche: "Z004",
                compte: "COMPTE",
                typeOperation: "ZSUB"
            }, {}))
        })
        
        it("should be return true because siret is already in chorusline", async () => {
            await expect(chorusService.sirenBelongAsso("10000000")).resolves.toBe(true);
        })

        it("should be return true because siret match with rna", async () => {
            jest.spyOn(rnaSirenService, "getRna").mockImplementationOnce(() => Promise.resolve('W0000000'))

            await expect(chorusService.sirenBelongAsso("10000000")).resolves.toBe(true);
        })

        it("should be return false ", async () => {
            jest.spyOn(rnaSirenService, "getRna").mockImplementationOnce(() => Promise.resolve(null));

            await expect(chorusService.sirenBelongAsso("200000000")).resolves.toBe(false);
        })
    })
});