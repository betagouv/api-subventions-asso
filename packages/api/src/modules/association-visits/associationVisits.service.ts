import { Association } from "@api-subventions-asso/dto";

import assoVisitsRepository from "../association-visits/repositories/associationVisits.repository";

export class AssociationVisitsService {
    public registerRequest(association: Association) {
        const name = association?.denomination_rna?.[0]?.value || association?.denomination_siren?.[0]?.value;
        if (!name)
            return console.warn("no association name, so the request is not counted in association top visits stats");
        return assoVisitsRepository.updateAssoVisitCountByIncrement(name);
    }

    public getTopAssociations(limit: number) {
        return assoVisitsRepository.selectMostRequestedAssos(limit);
    }
}

const associationVisitsService = new AssociationVisitsService();

export default associationVisitsService;
