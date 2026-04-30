import OsirisRequestMapper from "./osiris-request.mapper";

describe("OsirisRequestMapper", () => {
    it("maps OSIRIS raw headers to the stable raw entity format", () => {
        const actual = OsirisRequestMapper.toEntity(
            {
                Dossier: {
                    "N° Dossier Osiris": "DD59-22-0654",
                    "N° Dossier Compte Asso": "22-040341",
                    "N° EJ": "EJ00001",
                    "Date Reception": 43549.44370065972,
                },
                Bénéficiaire: {
                    "N° RNA": "W595004053",
                    "N° Siret": "35130347400024",
                    IBAN: "FR7642559100000800330277358",
                    BIC: "CCOPFRPPXXX",
                },
                "Coordonnées correspondance (publipostage)": {
                    Voie: "98 rue de Paris",
                    "Code Postal": "59200",
                    Commune: "TOURCOING",
                },
                "Nb Actions": {
                    "Nombre Actions": 1,
                },
            },
            2024,
            new Date("2026-01-01"),
        );

        expect(actual.dossier.osirisId).toBe("DD59-22-0654");
        expect(actual.dossier.compteAssoId).toBe("22-040341");
        expect(actual.dossier.ej).toBe("EJ00001");
        expect(actual.dossier.exerciceBudgetaire).toBe(2024);
        expect(actual.beneficiaire?.rna).toBe("W595004053");
        expect(actual.beneficiaire?.siret).toBe("35130347400024");
        expect(actual.beneficiaire?.iban).toBe("FR7642559100000800330277358");
        expect(actual.beneficiaire?.bic).toBe("CCOPFRPPXXX");
        expect(actual.coordonnees?.voie).toBe("98 rue de Paris");
        expect(actual.coordonnees?.codePostal).toBe("59200");
        expect(actual.coordonnees?.commune).toBe("TOURCOING");
        expect(actual.nbActions?.nombreActions).toBe(1);

        expect(actual.dossier.noDossierOsiris).toBeUndefined();
        expect(actual.dossier.noDossierCompteAsso).toBeUndefined();
        expect(actual.dossier.noEj).toBeUndefined();
        expect(actual.beneficiaire?.noRna).toBeUndefined();
        expect(actual.beneficiaire?.noSiret).toBeUndefined();
        expect(actual.coordonneesCorrespondancePublipostage).toBeUndefined();
    });

    it("merges Dossier and Dossier/action into the same dossier object", () => {
        const actual = OsirisRequestMapper.toEntity(
            {
                "Dossier/action": {
                    "N° Dossier Osiris": "DD71-24-0094",
                    "N° Dossier Compte Asso": "LE_COMPTE_ASSO_ID",
                },
                Dossier: {
                    "N° EJ": "EJ00001",
                },
            },
            2024,
            new Date("2026-01-01"),
        );

        expect(actual.dossier.osirisId).toBe("DD71-24-0094");
        expect(actual.dossier.compteAssoId).toBe("LE_COMPTE_ASSO_ID");
        expect(actual.dossier.ej).toBe("EJ00001");
        expect(actual.dossier.exerciceBudgetaire).toBe(2024);
        expect(actual.dossierAction).toBeUndefined();
    });
});
