import fs from "fs";
import path from "path";

import OsirisParser from "../../../src/modules/osiris/osiris.parser";
import OsirisFolderEntity from "../../../src/modules/osiris/entities/OsirisFoldersEntity";

describe("OsirisParser", () => {
    describe('parseFolders', () => {
        it('should return osiris folders', () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const folders = OsirisParser.parseFolders(buffer);

            expect(folders).toHaveLength(1);
            expect(folders[0]).toBeInstanceOf(OsirisFolderEntity);
        });
    });
});