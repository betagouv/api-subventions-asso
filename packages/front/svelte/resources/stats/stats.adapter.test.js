import statsAdapter from "@resources/stats/stats.adapter";

describe("StatsAdapter", () => {
    describe("formatUserCount", () => {
        const SRC_DATA = {
            nombres_utilisateurs_avant_annee: 42,
            evolution_nombres_utilisateurs: [43, 44],
        };
        const OUT_DATA = {
            lastYearNbUser: 42,
            monthlyData: [43, 44],
        };

        it("should format data", async () => {
            const expected = OUT_DATA;
            const actual = statsAdapter.formatUserCount(SRC_DATA);
            expect(actual).toEqual(expected);
        });
    });

    describe("formatRequestCount", () => {
        const SRC_DATA = {
            nb_requetes_par_mois: [43, 44],
            nb_requetes_moyen: 4.8,
            somme_nb_requetes: 90,
        };
        const OUT_DATA = {
            monthlyData: [43, 44],
            average: 4.8,
            sum: 90,
        };

        it("should format data", async () => {
            const expected = OUT_DATA;
            const actual = statsAdapter.formatRequestCount(SRC_DATA);
            expect(actual).toEqual(expected);
        });
    });
});
