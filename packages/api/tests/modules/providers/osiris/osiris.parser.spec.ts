import fs from "fs";
import path from "path";

import OsirisParser from "../../../../src/modules/providers/osiris/osiris.parser";
import OsirisActionEntity from "../../../../src/modules/providers/osiris/entities/OsirisActionEntity";

// TODO ensure this is proper integ test. It is historical test when we did not make a difference

describe("OsirisParser", () => {
    describe("parseRequests", () => {
        it("should return osiris request DTOs", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const requests = OsirisParser.parseRequests(buffer);

            expect(requests).toHaveLength(1);
            expect(requests[0]).toMatchObject({
                Dossier: expect.any(Object),
                Association: expect.any(Object),
            });
        });

        it("should have good raw properties", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const requests = OsirisParser.parseRequests(buffer);

            expect(requests[0]).toMatchObject({
                Association: {
                    "N° Siret": "12000000000018",
                    "N° RNA": "W000000000",
                    Nom: "Lorem ipsum dolor sit amet,",
                },
                Dossier: {
                    "N° Dossier Osiris": "DD00-00-0000",
                    "N° Dossier Compte Asso": "21-000000",
                },
            });
        });
    });

    describe("parseActions", () => {
        it("should return osiris actions", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviActions_test.xls"));
            const actions = OsirisParser.parseActions(buffer, 2022);

            expect(actions).toHaveLength(1);
            expect(actions[0]).toBeInstanceOf(OsirisActionEntity);
        });

        it("should have good properties", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviActions_test.xls"));
            const actions = OsirisParser.parseActions(buffer, 2022);
            expect(actions[0]).toMatchObject({
                indexedInformations: {
                    osirisActionId: "DD00-21-0000-1",
                    compteAssoId: "21-000000",
                },
            });
        });
    });
});
