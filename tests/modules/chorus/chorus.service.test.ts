
import ChorusLineEntity from "../../../src/modules/providers/chorus/entities/ChorusLineEntity";
import chorusService from "../../../src/modules/providers/chorus/chorus.service";

describe("chorus.service", () => {

    describe("validateEntity", () => {
        it('should be reject because codeBranche not accepted', () => {
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "WRONG CODE",
                compte: "COMPTE"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual( { success: false, message: `The branche ${entity.indexedInformations.codeBranche} is not accepted in data`, data: entity })
        })

        it('should be reject amount is not number', () => {
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "00000",
                amount: undefined as unknown as number,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `Amount is not a number`, data: entity })
        })

        it('should be reject dateOperation is not Date', () => {
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "00000",
                amount: 1000,
                dateOperation: "01/01/1960" as unknown as Date,
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `Operation date is not a valid date`, data: entity })
        })

        it('should be reject siret is not valid', () => {
            const entity = new ChorusLineEntity({
                siret: "SIRET",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `INVALID SIRET FOR ${entity.indexedInformations.siret}`, data: entity })
        })

        it('should be reject ej is not valid', () => {
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: false, message: `INVALID EJ FOR ${entity.indexedInformations.ej}`, data: entity })
        })

        it('should be accept', () => {
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});
            expect(chorusService.validateEntity(entity)).toEqual({ success: true })
        })
    });

    describe("addChorusLine", () => {
        it("should be reject because entity is not valid", async () => {
            const entity = new ChorusLineEntity({
                siret: "SIRET",
                ej: "00000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({ state: "rejected", result: expect.objectContaining({ success: false, message: "INVALID SIRET FOR SIRET"})});
        })

        it("should be create entity", async () => {
            jest.spyOn(chorusService, "siretBelongAsso").mockImplementationOnce(() => Promise.resolve(true))
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({ state: "created", result: entity });

        })

        it("should be update entity", async () => {
            const mock = jest.spyOn(chorusService, "siretBelongAsso").mockImplementation(() => Promise.resolve(true))
            
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});

            await chorusService.addChorusLine(entity);

            entity.data = { "test": "update" };

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({ state: "updated", result: entity });
            mock.mockReset();
        })

        it("should be not update because same ej but not same amout", async () => {
            const mock = jest.spyOn(chorusService, "siretBelongAsso").mockImplementation(() => Promise.resolve(true))
            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});

            await chorusService.addChorusLine(entity);

            entity.indexedInformations.amount = 5000;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {_id, ...entityWithoutId } = entity

            await expect(chorusService.addChorusLine(entityWithoutId)).resolves.toEqual({ state: "created", result: entityWithoutId });
            mock.mockReset();
        })

        it("should be not update because same ej but not operation data", async () => {
            const mock = jest.spyOn(chorusService, "siretBelongAsso").mockImplementation(() => Promise.resolve(true))

            const entity = new ChorusLineEntity({
                siret: "10000000000000",
                ej: "1000000000",
                amount: 1000,
                dateOperation: new Date(),
                codeBranche: "Z004",
                compte: "COMPTE"
            }, {});

            await chorusService.addChorusLine(entity);

            entity.indexedInformations.dateOperation = new Date(1,1,1970);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {_id, ...entityWithoutId } = entity

            await expect(chorusService.addChorusLine(entityWithoutId)).resolves.toEqual({ state: "created", result: entityWithoutId });

            mock.mockReset();
        })
    })

    describe("findsBySiret", () => {
        const entity = new ChorusLineEntity({
            siret: "10000000000000",
            ej: "1000000000",
            amount: 1000,
            dateOperation: new Date(),
            codeBranche: "Z004",
            compte: "COMPTE"
        }, {});

        beforeEach(async () => {
            jest.spyOn(chorusService, "siretBelongAsso").mockImplementation(() => Promise.resolve(true))
            await chorusService.addChorusLine(entity);
        })

        it("should be find entity", async () => {
            await expect(chorusService.findsBySiret("10000000000000")).resolves.toEqual([entity]);
        })
        it("should be no find entity", async () => {
            await expect(chorusService.findsBySiret("10000000000004")).resolves.not.toEqual([entity]);
            await expect(chorusService.findsBySiret("10000000000004")).resolves.toHaveLength(0);
        })
    })
});