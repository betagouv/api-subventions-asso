import ApplicationFlatEntity from "./ApplicationFlatEntity";
import Siret from "../valueObjects/Siret";
import Siren from "../valueObjects/Siren";

describe("ApplicationFlatEntity", () => {
    describe("constructor", () => {
        it("defines ids", () => {
            const draft = {
                provider: "source",
                idSubventionProvider: "001",
                exerciceBudgetaire: 2042,
            };
            // @ts-expect-error -- incomplete draft
            const entity = new ApplicationFlatEntity(draft);
            expect(entity).toMatchObject({
                idSubvention: "source--001",
                idUnique: "source--001--2042",
            });
        });
    });

    describe("siret", () => {
        it("gets siret from siret", () => {
            const SIRET = new Siret("12345678901234");
            // @ts-expect-error -- incomplete draft
            const entity = new ApplicationFlatEntity({ typeIdBeneficiaire: "siret", idBeneficiaire: SIRET.value });
            expect(entity.siret).toEqual(SIRET);
        });
        it("else returns undefined", () => {
            // @ts-expect-error -- incomplete draft
            const entity = new ApplicationFlatEntity({ typeIdBeneficiaire: "ridet", idBeneficiaire: "" });
            expect(entity.siret).toBeUndefined();
        });
    });

    describe("siren", () => {
        it("gets siren from siret", () => {
            const SIRET = new Siret("12345678901234");
            const SIREN = new Siren("123456789");
            // @ts-expect-error -- incomplete draft
            const entity = new ApplicationFlatEntity({ typeIdBeneficiaire: "siret", idBeneficiaire: SIRET.value });
            expect(entity.siren).toEqual(SIREN);
        });
        it("gets siret from siret", () => {
            const SIREN = new Siren("123456789");
            // @ts-expect-error -- incomplete draft
            const entity = new ApplicationFlatEntity({ typeIdBeneficiaire: "siren", idBeneficiaire: SIREN.value });
            expect(entity.siren).toEqual(SIREN);
        });
        it("else returns undefined", () => {
            // @ts-expect-error -- incomplete draft
            const entity = new ApplicationFlatEntity({ typeIdBeneficiaire: "ridet", idBeneficiaire: "" });
            expect(entity.siren).toBeUndefined();
        });
    });
});
