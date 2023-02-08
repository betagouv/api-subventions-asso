import { Siren, Siret, Versement, Association, Etablissement, DemandeSubvention } from "@api-subventions-asso/dto";
import VersementsProvider from "./@types/VersementsProvider";
import providers from "../providers";
import { AssociationIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import rnaSirenService from "../open-data/rna-siren/rnaSiren.service";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import { NotFoundError } from "../../shared/errors/httpErrors";

export class VersementsService {
    async getVersementsByAssociation(identifier: AssociationIdentifiers) {
        const type = getIdentifierType(identifier);
        if (!type || type === StructureIdentifiersEnum.siret) throw new AssociationIdentifierError();

        let siren = type === StructureIdentifiersEnum.siren ? identifier : null;
        if (!siren) {
            siren = await rnaSirenService.getSiren(identifier);
        }

        if (!siren) throw new NotFoundError("Impossible to recover the SIREN");

        return this.getVersementsBySiren(siren);
    }

    hasVersements(demandeSubvention: DemandeSubvention) {
        return !!(demandeSubvention.versementKey && demandeSubvention.versementKey.value);
    }

    filterVersementByKey(versements, key) {
        if (!versements) return null;
        return versements.filter(versement => (versement.ej?.value || versement.codePoste?.value) === key);
    }

    async getVersementsBySiret(siret: Siret): Promise<Versement[]> {
        const providers = this.getProviders();
        return [...(await Promise.all(providers.map(p => p.getVersementsBySiret(siret)))).flat()];
    }

    private async getVersementsBySiren(siren: Siren) {
        const providers = this.getProviders();
        return [...(await Promise.all(providers.map(p => p.getVersementsBySiren(siren)))).flat()];
    }

    private getProviders(): VersementsProvider[] {
        return Object.values(providers).filter(p => this.isVersementsProvider(p)) as unknown as VersementsProvider[];
    }

    private isVersementsProvider(data: unknown): data is VersementsProvider {
        return (data as VersementsProvider).isVersementsProvider;
    }
}

const versementsService = new VersementsService();

export default versementsService;
