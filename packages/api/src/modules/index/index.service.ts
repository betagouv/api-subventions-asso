export class IndexService {
    getIndexData() {
        return {
            message: "Bienvenue sur l'api Data.Subvention",
            doc: "https://github.com/betagouv/api-subventions-asso/wiki/Documentation-API-&-Guide-d'int%C3%A9gration",
            swagger: "/docs"
        };
    }
}

const indexService = new IndexService();

export default indexService;
