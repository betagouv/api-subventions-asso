import IOsirisActionsInformations from "../../../src/modules/providers/osiris/@types/IOsirisActionsInformations";
import IOsirisRequestInformations from "../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisActionEntity from "../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import OsirisRequestEntity from "../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import osirisService, { OsirisService } from "../../../src/modules/providers/osiris/osiris.service";

describe("OsirisService", () => {
    it("should retrun an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

    describe("requests part", () => {
        describe('addRequest', () => {
            it('should return the added osiris request', async () => {
                const entity = new OsirisRequestEntity({ siret: "SIRET", rna: "RNA", name: "NAME"}, { osirisId: "OSIRISID", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
                expect((await osirisService.addRequest(entity)).result).toMatchObject(entity);
            });
        
            it('should return the updated osiris request', async () => {
                const entity = new OsirisRequestEntity({ siret: "SIRET", rna: "RNA", name: "NAME"}, { osirisId: "OSIRISID", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
                await osirisService.addRequest(entity);
                const result = await osirisService.addRequest(entity)
                expect(result.result).toMatchObject(entity);
                expect(result.state).toBe("updated");
            });
        });
        
        describe('findAllRequests', () => {
        
            beforeEach(async () => {
                const entity = new OsirisRequestEntity({ siret: "SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
                await osirisService.addRequest(entity);
            });
        
            it('should return one request', async () => {
                expect(await osirisService.findAllRequests()).toHaveLength(1);
            });
        
            it('should return two requests', async () => {
                const entity = new OsirisRequestEntity({ siret: "SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
                await osirisService.addRequest(entity);
        
                expect(await osirisService.findAllRequests()).toHaveLength(2);
            });
        });
        
        describe('findBySiret', () => {
            const entity = new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
        
            beforeEach(async () => {
                await osirisService.addRequest(entity);
            });
        
            it('should return request', async () => {
                expect(await osirisService.findBySiret("FAKE_SIRET")).toMatchObject([entity]);
            });
        });
        
        describe('findByRna', () => {
            const entity = new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "FAKE_RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()} as IOsirisRequestInformations, {}, undefined, []);
        
            beforeEach(async () => {
                await osirisService.addRequest(entity);
            });
        
            it('should return request', async () => {
                expect(await osirisService.findByRna("FAKE_RNA")).toMatchObject([entity]);
            });
        });
    })

    describe("actions part", () => {
        describe('addAction', () => {
            it('should return the added osiris action', async () => {
                const entity = new OsirisActionEntity({ osirisActionId: "OSIRISID", compteAssoId: "COMPTEASSOID"} as IOsirisActionsInformations, {}, undefined);
                expect((await osirisService.addAction(entity)).result).toMatchObject(entity);
            });
        
            it('should return the updated osiris action', async () => {
                const entity = new OsirisActionEntity({ osirisActionId: "OSIRISID", compteAssoId: "COMPTEASSOID"} as IOsirisActionsInformations, {}, undefined);

                await osirisService.addAction(entity);
                const result = await osirisService.addAction(entity)
                expect(result.result).toMatchObject(entity);
                expect(result.state).toBe("updated");
            });
        });
        
        describe('findAllActions', () => {
        
            beforeEach(async () => {
                const entity = new OsirisActionEntity({ osirisActionId: "FAKE_ID", compteAssoId: "COMPTEASSOID"} as IOsirisActionsInformations, {}, undefined);

                await osirisService.addAction(entity);
            });
        
            it('should return one action', async () => {
                expect(await osirisService.findAllActions()).toHaveLength(1);
            });
        
            it('should return two actions', async () => {
                const entity = new OsirisActionEntity({ osirisActionId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID"} as IOsirisActionsInformations, {}, undefined);

                await osirisService.addAction(entity);
        
                expect(await osirisService.findAllActions()).toHaveLength(2);
            });
        });
    })
});