import OsirisFileEntity from "../../../src/modules/osiris/entities/OsirisFileEntity";
import osirisService, { OsirisService } from "../../../src/modules/osiris/osiris.service";

describe("OsirisService", () => {
    it("should retrun an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

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

        it('should return two file', async () => {
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
});