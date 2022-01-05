import fs from "fs";
import path from "path";

import OsirisParser from "../../../src/modules/osiris/osiris.parser";
import OsirisFileEntity from "../../../src/modules/osiris/entities/OsirisFileEntity";

describe("OsirisParser", () => {
    describe('parseFiles', () => {
        it('should return osiris folders', () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const folders = OsirisParser.parseFiles(buffer);

            expect(folders).toHaveLength(1);
            expect(folders[0]).toBeInstanceOf(OsirisFileEntity);
        });
    });
});