import OsirisFolderEntity from "../../src/osiris/entities/OsirisFoldersEntity";
import osirisService, { OsirisService } from "../../src/osiris/osiris.service";

describe("OsirisService", () => {
    it("should retrun an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

    describe('addFolder', () => {
        it('should return the added osiris folder', () => {
            const entity = { test: "Hello World" } as unknown as OsirisFolderEntity;
            expect(osirisService.addFolder(entity)).toBe(entity);
        });
    });
});