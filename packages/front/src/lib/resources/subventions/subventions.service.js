import subventionsPort from "./subventions.port";

export class SubventionsService {
    getEtablissementsSubventionsStore(identifier) {
        return subventionsPort.getEtablissementSubventionsStore(identifier);
    }

    getAssociationsSubventionsStore(identifier) {
        return subventionsPort.getAssociationSubventionsStore(identifier);
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
