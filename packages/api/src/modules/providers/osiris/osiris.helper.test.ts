import * as osirisHelper from "./osiris.helper";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import Ridet from "../../../identifier-objects/Ridet";
import Siret from "../../../identifier-objects/Siret";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";

describe("osiris.helper", () => {
    describe("getAssoIdType", () => {
        it.each`
            osirisRidet
            ${"990001234567891"}
            ${"99001234567891"}
        `("returns ridet", ({ osirisRidet }) => {
            const expected = Ridet.getName();
            const actual = osirisHelper.getAssoIdType(osirisRidet);
            expect(actual).toEqual(expected);
        });

        it("returns siret", () => {
            const expected = Siret.getName();
            const actual = osirisHelper.getAssoIdType(DEFAULT_ASSOCIATION.siret);
            expect(actual).toEqual(expected);
        });
    });

    describe("cleanRidet", () => {
        it.each`
            osirisRidet
            ${"990001234567891"}
            ${"99001234567891"}
        `("returns well formatted ridet", ({ osirisRidet }) => {
            const expected = "1234567891";
            const actual = osirisHelper.cleanRidet(osirisRidet);
            expect(actual).toEqual(expected);
        });

        it("throws error if cleaned ridet is not valid", () => {
            expect(() => osirisHelper.cleanRidet("99000123456")).toThrow("Cleaned Ridet is not valid");
        });
    });

    describe("getPluriannualYears", () => {
        it("returns years", () => {
            const expected = [2023, 2024, 2025];
            const actual = osirisHelper.getPluriannualYears({
                dossier: { exerciceDebut: 2023, exerciceFin: 2025 },
            } as OsirisRequestEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("getCofinancers", () => {
        it("returns array of unique cofinancers", () => {
            const expected = [
                "Direction départementale de Saône-et-Loire",
                "DRAC",
                "ARS",
                "Bourgogne-Franche-Comté",
                "Saône-et-Loire",
                "Politque de la ville",
                "CAF",
                "Aides privées",
            ];

            const actual = osirisHelper.getCofinancers([
                {
                    cofinanceurs: {
                        noms: "Direction départementale de Saône-et-Loire;DRAC;ARS;Bourgogne-Franche-Comté;Saône-et-Loire;Politque de la ville;CAF;",
                    },
                } as OsirisActionEntity,
                {
                    cofinanceurs: {
                        noms: "Politque de la ville;CAF;Aides privées;",
                    },
                } as OsirisActionEntity,
            ]);
            expect(actual).toEqual(expected);
        });

        it("returns empty array if no cofinancers", () => {
            const expected = [];

            const actual = osirisHelper.getCofinancers([
                {
                    cofinanceurs: {
                        noms: "",
                    },
                } as OsirisActionEntity,
                {
                    cofinanceurs: undefined,
                } as unknown as OsirisActionEntity,
            ]);
            expect(actual).toEqual(expected);
        });
    });
});
