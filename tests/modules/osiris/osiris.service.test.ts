import OsirisFolderEntity from "../../../src/modules/osiris/entities/OsirisFoldersEntity";
import osirisService, { OsirisService } from "../../../src/modules/osiris/osiris.service";

describe("OsirisService", () => {
    it("should retrun an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

    describe('addFolder', () => {
        it('should return the added osiris folder', async () => {
            const entity = { folder: { osirisId: "FAKE_ID"} } as unknown as OsirisFolderEntity;
            expect((await osirisService.addFolder(entity)).result).toMatchObject(entity);
        });

        it('should return the updated osiris folder', async () => {
            const entity = { folder: { osirisId: "FAKE_ID"} } as unknown as OsirisFolderEntity;
            await osirisService.addFolder(entity);
            const result = await osirisService.addFolder(entity)
            expect(result.result).toMatchObject(entity);
            expect(result.state).toBe("updated");
        });
    });

    describe('findAllFolders', () => {

        beforeEach(async () => {
            const entity = { folder: { osirisId: "FAKE_ID"} } as unknown as OsirisFolderEntity;
            await osirisService.addFolder(entity);
        });

        it('should return one folder', async () => {
            expect(await osirisService.findAllFolders()).toHaveLength(1);
        });

        it('should return two folder', async () => {
            const entity = { folder: { osirisId: "FAKE_ID_2"} } as unknown as OsirisFolderEntity;
            await osirisService.addFolder(entity);

            expect(await osirisService.findAllFolders()).toHaveLength(2);
        });
    });

    describe('findFolderBySiret', () => {
        const entity = { folder: { osirisId: "FAKE_ID"}, association: { siret: "FAKE_SIRET"} } as unknown as OsirisFolderEntity;

        beforeEach(async () => {
            await osirisService.addFolder(entity);
        });

        it('should return folder', async () => {
            expect(await osirisService.findFolderBySiret("FAKE_SIRET")).toMatchObject(entity);
        });
    });

    describe('findFolderByRna', () => {
        const entity = { folder: { osirisId: "FAKE_ID"}, association: { rna: "FAKE_RNA"} } as unknown as OsirisFolderEntity;

        beforeEach(async () => {
            await osirisService.addFolder(entity);
        });

        it('should return folder', async () => {
            expect(await osirisService.findFolderByRna("FAKE_RNA")).toMatchObject(entity);
        });
    });
});