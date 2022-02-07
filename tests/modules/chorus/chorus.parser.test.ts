import fs from "fs";
import path from "path";

import ChorusPaser from "../../../src/modules/chorus/chorus.parser";

describe("chorus.parser.ts", () => {
    it("should parse file", () => {
        const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/infbud-53.tests.csv"));
        const entities = ChorusPaser.parse(buffer);

        expect(entities).toHaveLength(1);
        expect(entities[0]).toMatchObject( {
            "_id": undefined,
            "data":  {
                "Code taxe 1": "10000000000000",
                "Compte budgétaire": "Dépenses de fonction",
                "Compte général": "AUTRES PREST SERVICE",
                "Date de dernière opération sur la DP": "01.01.1970",
                "EUR": "1,00",
                "Fournisseur payé (DP)": "CAISSE DES DEPOTS ET CONSIGNATIONS",
                "N° DP": "100000000",
                "N° EJ": "2100000000",
                "Référentiel de programmation": "Cpte engagmt citoyen",
                "Type d'opération": "Subventions",
            },
            "indexedInformations":  {
                "amount": 1,
                "compte": "AUTRES PREST SERVICE",
                "dateOperation": new Date(1970,0 ,1),
                "ej": "2100000000",
                "siret": "10000000000000",
            },
            "provider": "Chorus",
        }
        );
    })
});