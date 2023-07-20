import versementsPort from "./versements.port";

export class VersementsService {
    getEtablissementVersements(identifier) {
        return versementsPort.getEtablissementVersements(identifier);
    }

    getAssociationVersements(identifier) {
        return versementsPort.getAssociationVersements(identifier);
    }
}

const versementsService = new VersementsService();

export default versementsService;
