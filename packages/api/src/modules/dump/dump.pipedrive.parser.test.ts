import DumpPipedriveParser from "./dump.pipedrive.parser";
import { AgentJobTypeEnum } from "dto";

describe("DumpPipedriveParser", () => {
    describe("adapts", () => {
        it("adapts correctly", () => {
            const headers = [
                "Personne - Nom",
                "Structure",
                "AgentType",
                "DecentralizedLevel",
                "Email",
                "Base - E-mail",
                "Personne - Département",
                "Personne - Région",
                "JobType",
                "Personne - Data.Subvention - Compte actif",
                "Personne - Fonction",
                "Personne - Service",
                "LastName",
                "FirstName",
                "PhoneNumber",
            ];
            const values = [
                [
                    "Prenom NOM",
                    "UNIVERSITE",
                    "Administration déconcentrée",
                    "Départementale",
                    "prenom.nom@base.fr",
                    "prenom.nom",
                    "69 - Rhône",
                    "Auvergne-Rhône-Alpes",
                    "Chef de service,Expert métier",
                    "oui",
                    "",
                    "",
                    "NOM",
                    "Prenom",
                    "06 00 00 00 00",
                ],
                [
                    "Prenom2 NOM2",
                    "UNIVERSITE",
                    "Administration centrale",
                    "Centrale",
                    "prenom2.nom2@base.fr",
                    "prenom2.nom2",
                    "69 - Rhône",
                    "Auvergne-Rhône-Alpes",
                    "",
                    "oui",
                    "",
                    "",
                    "NOM2",
                    "Prenom2",
                    600000000,
                ],
            ];
            // @ts-expect-error test private
            const actual = DumpPipedriveParser.adapts([headers, ...values]);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("pathObject adapters", () => {
        describe("jobType adapter", () => {
            it("returns empty array if empty string", () => {
                const toAdapt = undefined;
                const expected = [];
                // @ts-expect-error test private
                const actual = DumpPipedriveParser.pathObject.jobType.adapter(toAdapt);
                expect(actual).toEqual(expected);
            });

            it("returns empty array if undefined", () => {
                const toAdapt = "";
                const expected = [];
                // @ts-expect-error test private
                const actual = DumpPipedriveParser.pathObject.jobType.adapter(toAdapt);
                expect(actual).toEqual(expected);
            });

            it("returns array", () => {
                const toAdapt = "Gestionnaire";
                const expected = [AgentJobTypeEnum.ADMINISTRATOR];
                // @ts-expect-error test private
                const actual = DumpPipedriveParser.pathObject.jobType.adapter(toAdapt);
                expect(actual).toEqual(expected);
            });

            it("returns array with multiple values if coma", () => {
                const toAdapt = "Contrôleur, Expert métier";
                const expected = [AgentJobTypeEnum.CONTROLLER, AgentJobTypeEnum.EXPERT];
                // @ts-expect-error test private
                const actual = DumpPipedriveParser.pathObject.jobType.adapter(toAdapt);
                expect(actual).toEqual(expected);
            });
        });
    });
});
