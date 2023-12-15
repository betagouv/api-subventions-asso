import fs from "fs";
import path from "path";

import LeCompteAssoParser from "../../../../src/modules/providers/leCompteAsso/leCompteAsso.parser";

describe("leCompteAsso.parser", () => {
    it("should parse file", () => {
        const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/le-compte-asso-export-tests.csv"));
        const entities = LeCompteAssoParser.parse(buffer);

        expect(entities).toHaveLength(1);
        expect(entities[0]).toMatchObject({
            data: {
                "Compte du créateur": "Lorem@ipsum-dolor.sit",
                "Créé le": "01/01/1970",
                "Dossier supprimé?": "Non",
                "Etat du dossier": "En cours d'instruction",
                "Etat du dossier CRF": "Non débuté",
                "Exercice de début": "2021",
                "Exercice de fin": "2021",
                "Identifiant technique": '"00aa00aa000aaa00aaa000aaa00a"',
                "Nom association": "Lorem ipsum dolor sit",
                "Nom du dispositif": "AAAA",
                "Nom du sous-dispositif": "Lorem ipsum dolor sit",
                "Nombre de projets saisis": "1",
                "Numéro Siret": "0",
                "Numéro dossier LCA": "21-000000",
                "Pluriannuel?": "Non",
                "Service(s) instructeur(s)": "DR-AAA",
                "Transmis le": "01/01/1970 12:00",
            },
            legalInformations: {
                name: "Lorem ipsum dolor sit",
                rna: null,
                siret: "0",
            },
            providerInformations: {
                compteAssoId: "21-000000",
            },
        });
    });
});
