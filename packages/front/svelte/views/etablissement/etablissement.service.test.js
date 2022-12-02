import etablissementService from "./etablissement.service";

describe("Etablissement Service", () => {
    describe("getContactsList()", () => {
        it("should return the list of contacts", () => {
            const etablissement = {
                contacts: [
                    { value: { nom: "Rémi", prenom: "Saintagne", role: "Chargé de mission" }, provider: "providerA" },
                    { value: { nom: "Sandrine", prenom: "Guérin", role: "Présidente" }, provider: "providerA" }
                ]
            };
            const expected = [
                { nom: "Rémi", prenom: "Saintagne", role: "Chargé de mission" },
                { nom: "Sandrine", prenom: "Guérin", role: "Présidente" }
            ];
            const actual = etablissementService.getContactsList(etablissement);
            expect(actual).toEqual(expected);
        });
    });
});
