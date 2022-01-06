import OsirisActionEntity from "../../../src/modules/osiris/entities/OsirisActionEntity";
import OsirisFileEntity from "../../../src/modules/osiris/entities/OsirisFileEntity";
import osirisService, { OsirisService } from "../../../src/modules/osiris/osiris.service";

describe("OsirisService", () => {
    it("should retrun an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

    describe("files part", () => {
        describe('addFile', () => {
            it('should return the added osiris file', async () => {
                const entity = { file: { osirisId: "FAKE_ID"} } as unknown as OsirisFileEntity;
                expect((await osirisService.addFile(entity)).result).toMatchObject(entity);
            });
        
            it('should return the updated osiris file', async () => {
                const entity = { file: { osirisId: "FAKE_ID"} } as unknown as OsirisFileEntity;
                await osirisService.addFile(entity);
                const result = await osirisService.addFile(entity)
                expect(result.result).toMatchObject(entity);
                expect(result.state).toBe("updated");
            });
        });
        
        describe('findAllFiles', () => {
        
            beforeEach(async () => {
                const entity = { file: { osirisId: "FAKE_ID"} } as unknown as OsirisFileEntity;
                await osirisService.addFile(entity);
            });
        
            it('should return one file', async () => {
                expect(await osirisService.findAllFiles()).toHaveLength(1);
            });
        
            it('should return two files', async () => {
                const entity = { file: { osirisId: "FAKE_ID_2"} } as unknown as OsirisFileEntity;
                await osirisService.addFile(entity);
        
                expect(await osirisService.findAllFiles()).toHaveLength(2);
            });
        });
        
        describe('findFilesBySiret', () => {
            const entity = { file: { osirisId: "FAKE_ID"}, association: { siret: "FAKE_SIRET"} } as unknown as OsirisFileEntity;
        
            beforeEach(async () => {
                await osirisService.addFile(entity);
            });
        
            it('should return file', async () => {
                expect(await osirisService.findFilesBySiret("FAKE_SIRET")).toMatchObject([entity]);
            });
        });
        
        describe('findFilesByRna', () => {
            const entity = { file: { osirisId: "FAKE_ID"}, association: { rna: "FAKE_RNA"} } as unknown as OsirisFileEntity;
        
            beforeEach(async () => {
                await osirisService.addFile(entity);
            });
        
            it('should return file', async () => {
                expect(await osirisService.findFilesByRna("FAKE_RNA")).toMatchObject([entity]);
            });
        });
    })

    describe("actions part", () => {
        describe('addAction', () => {
            it('should return the added osiris action', async () => {
                const entity = { file: { osirisId: "FAKE_ID"} } as unknown as OsirisActionEntity;
                expect((await osirisService.addAction(entity)).result).toMatchObject(entity);
            });
        
            it('should return the updated osiris action', async () => {
                const entity = { file: { osirisId: "FAKE_ID"} } as unknown as OsirisActionEntity;

                await osirisService.addAction(entity);
                const result = await osirisService.addAction(entity)
                expect(result.result).toMatchObject(entity);
                expect(result.state).toBe("updated");
            });
        });
        
        describe('findAllActions', () => {
        
            beforeEach(async () => {
                const entity = { file: { osirisId: "FAKE_ID"} } as unknown as OsirisActionEntity;
                await osirisService.addAction(entity);
            });
        
            it('should return one action', async () => {
                expect(await osirisService.findAllActions()).toHaveLength(1);
            });
        
            it('should return two actions', async () => {
                const entity = { file: { osirisId: "FAKE_ID_2"} } as unknown as OsirisActionEntity;
                await osirisService.addAction(entity);
        
                expect(await osirisService.findAllActions()).toHaveLength(2);
            });
        });
        
        describe('findActionsBySiret', () => {
            const entity = { file: { osirisId: "FAKE_ID"}, beneficiaryAssociation: { siret: "FAKE_SIRET"} } as unknown as OsirisActionEntity;
        
            beforeEach(async () => {
                await osirisService.addAction(entity);
            });
        
            it('should return file', async () => {
                expect(await osirisService.findActionsBySiret("FAKE_SIRET")).toMatchObject([entity]);
            });
        });
        
        describe('findActionsByRna', () => {
            const entity = { file: { osirisId: "FAKE_ID"}, beneficiaryAssociation: { rna: "FAKE_RNA"} } as unknown as OsirisActionEntity;
        
            beforeEach(async () => {
                await osirisService.addAction(entity);
            });
        
            it('should return file', async () => {
                expect(await osirisService.findActionsByRna("FAKE_RNA")).toMatchObject([entity]);
            });
        });
    })
});