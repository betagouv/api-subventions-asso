import { ENV } from "$env/static/public";

export default {
    getEnv: () => ENV,
    getName: () => "Data.Subvention",
    getDescription: () => "Les dernières informations sur les associations et leurs subventions",
    getContact: () => "contact@datasubvention.beta.gouv.fr",
    getRepo: () => "https://github.com/betagouv/api-subventions-asso",
};
