export function isAssociation(code_juridique) {
    const LEGAL_CATEGORIES_ACCEPTED = [
        // TODO: créer un package shared pour partager les cat juridique entre le front et le back
        "9210", // Association non déclarée
        "9220", // Association déclarée
        "9221", // Association déclarée d'insertion par l'économique
        "9222", // Association intermédiaire
        "9223", // Groupement d'employeurs
        "9230", // Association déclarée, reconnue d'utilité publique
        "9240", // Congrégation
        "9260", // Association de droit local (Bas-Rhin, Haut-Rhin et Moselle)
        "9300", // Fondation
        "92" // Association loi 1901 ou assimilé
    ];

    return LEGAL_CATEGORIES_ACCEPTED.includes(code_juridique);
}
