class StatsAdapter {
    formatUserCount(apiData) {
        return {
            lastYearNbUser: apiData.nombres_utilisateurs_avant_annee,
            monthlyData: apiData.evolution_nombres_utilisateurs,
        };
    }

    formatRequestCount(apiData) {
        return {
            monthlyData: apiData.nb_requetes_par_mois,
            sum: apiData.somme_nb_requetes,
            average: apiData.nb_requetes_moyen,
        };
    }
}

const statsAdapter = new StatsAdapter();
export default statsAdapter;
