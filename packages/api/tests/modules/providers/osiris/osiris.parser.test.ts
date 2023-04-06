import fs from "fs";
import path from "path";

import OsirisParser from "../../../../src/modules/providers/osiris/osiris.parser";
import OsirisActionEntity from "../../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import OsirisRequestEntity from "../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import OsirisEvaluationEntity from "../../../../src/modules/providers/osiris/entities/OsirisEvaluationEntity";

describe("OsirisParser", () => {
    describe("parseRequests", () => {
        it("should return osiris requests", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const requests = OsirisParser.parseRequests(buffer, 2022);

            expect(requests).toHaveLength(1);
            expect(requests[0]).toBeInstanceOf(OsirisRequestEntity);
        });

        it("should have good properties", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const requests = OsirisParser.parseRequests(buffer, 2022);
            expect(requests[0]).toMatchObject({
                legalInformations: {
                    siret: "0",
                    rna: "W0000000",
                    name: "Lorem ipsum dolor sit amet,",
                },
                provider: "Osiris",
                providerInformations: {
                    osirisId: "DD00-00-0000",
                    compteAssoId: "21-000000",
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

    describe("parseEvaluations()", () => {
        it("should return osiris evaluation", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviActionsEvaluation_test.xlsx"));
            const actual = OsirisParser.parseEvaluations(buffer, 2022);
            expect(actual).toHaveLength(1);
            expect(actual[0]).toBeInstanceOf(OsirisEvaluationEntity);
        });

        it("should have properties", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/test.xlsx"));
            const actual = OsirisParser.parseEvaluations(buffer, 2022)[0].indexedInformations;
            const expected = {
                osirisActionId: "DD00-21-0000-1",
                siret: "0",
                evaluation_resultat: "Lorem ipsum dolor sit amet,",
                cout_total_realise: 3600,
            };
            expect(actual).toMatchObject(expected);
        });
    });
});
