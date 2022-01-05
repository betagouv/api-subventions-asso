import OsirisFolderEntity from "../../src/osiris/entities/OsirisFoldersEntity";
import osirisService, { OsirisService } from "../../src/osiris/osiris.service";

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
});