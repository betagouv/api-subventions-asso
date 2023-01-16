import { Siren, Siret, Versement, Association, Etablissement, DemandeSubvention } from "@api-subventions-asso/dto";
import VersementsProvider from "./@types/VersementsProvider";
import providers from "../providers";
import { AssociationIdentifiers } from "../../@types";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import rnaSirenService from "../open-data/rna-siren/rnaSiren.service";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";

export class VersementsService {
    async getVersementsByAssociation(identifier: AssociationIdentifiers) {
        const type = getIdentifierType(identifier);
        if (!type || type === StructureIdentifiersEnum.siret) throw new AssociationIdentifierError();

        let siren = type === StructureIdentifiersEnum.siren ? identifier : null;
        if (!siren) {
            siren = await rnaSirenService.getSiren(identifier);
        }

        if (!siren) return [];

        return this.getVersementsBySiren(siren);
    }

    async aggregateVersementsByAssoSearch(asso: Association) {
        if (!asso.siren || asso.siren?.length === 0) return null;

        const siren = asso.siren[0].value;
        const versements = await this.getVersementsBySiren(siren);

        asso.versements = versements;

        asso.etablissements?.forEach(etablissement => {
            etablissement.versements = versements.filter(
                versement => versement.siret.value === etablissement.siret[0].value
            );

            if (!etablissement.versements) return;

            etablissement.demandes_subventions?.forEach(demandeSubvention => {
                if (!this.hasVersements(demandeSubvention)) return;
                demandeSubvention.versements = this.filterVersementByKey(
                    etablissement.versements,
                    demandeSubvention.versementKey?.value
                );
            });
        });

        return asso;
    }

    hasVersements(demandeSubvention: DemandeSubvention) {
        return !!(demandeSubvention.versementKey && demandeSubvention.versementKey.value);
    }

    filterVersementByKey(versements, key) {
        if (!versements) return null;
        return versements.filter(versement => (versement.ej?.value || versement.codePoste?.value) === key);
    }

    async aggregateVersementsByEtablissementSearch(etablissement: Etablissement) {
        if (!etablissement.siret || etablissement.siret.length === 0) return null;

        const versements = await this.getVersementsBySiret(etablissement.siret[0].value);

        etablissement.versements = versements;

        etablissement.demandes_subventions?.forEach(demandeSubvention => {
            if (!this.hasVersements(demandeSubvention)) return;
            demandeSubvention.versements = this.filterVersementByKey(versements, demandeSubvention.versementKey?.value);
        });

        return etablissement;
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
