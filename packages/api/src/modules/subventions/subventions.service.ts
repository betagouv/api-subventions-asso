import { Siret, AssociationIdentifiers } from "dto";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import Flux from "../../shared/Flux";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import { demandesSubventionsProviders } from "../providers";
import { SubventionsFlux } from "./@types/SubventionsFlux";

export class SubventionsService {
    public providers = demandesSubventionsProviders;
    public getBySirenMethod = "getDemandeSubventionBySiren";
    public getBySiretMethod = "getDemandeSubventionBySiret";

    async getDemandesByAssociation(identifier: AssociationIdentifiers) {
        const type = getIdentifierType(identifier);
        if (!type) throw new AssociationIdentifierError();
        if (type === StructureIdentifiersEnum.rna) {
            const rnaSirenEntities = await rnaSirenService.find(identifier);
            if (rnaSirenEntities && rnaSirenEntities.length) {
                return this.getApplicationFetcher(this.getBySirenMethod)(rnaSirenEntities[0].siren);
            } else return null;
        } else {
            if (type === StructureIdentifiersEnum.siret)
                return this.getApplicationFetcher(this.getBySiretMethod)(identifier);
            return this.getApplicationFetcher(this.getBySirenMethod)(identifier);
        }
    }

    getDemandesByEtablissement(siret: Siret) {
        const type = getIdentifierType(siret);
        if (type !== StructureIdentifiersEnum.siret)
            throw new StructureIdentifiersError(StructureIdentifiersEnum.siret);
        return this.getApplicationFetcher(this.getBySiretMethod)(siret);
    }

    getApplicationFetcher(getterName) {
        return identifier => {
            const subventionsFlux = new Flux<SubventionsFlux>();
            const defaultMeta = {
                totalProviders: this.providers.length,
            };

            subventionsFlux.push({
                __meta__: defaultMeta,
            });

            let countAnswers = 0;

            this.providers.forEach(providerService =>
                providerService[getterName](identifier).then(subventions => {
                    countAnswers++;
                    subventionsFlux.push({
                        __meta__: { ...defaultMeta, provider: providerService.provider.name },
                        subventions: subventions || [],
                    });

                    if (countAnswers === this.providers.length) subventionsFlux.close();
                }),
            );
            return subventionsFlux;
        };
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
