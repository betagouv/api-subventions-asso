import { Siren, Siret } from "../../@types";
import Versement from "./@types/Versement";
import VersementsProvider from "./@types/VersementsProvider";
import providers from "../providers";
import AssociationDto from "../search/interfaces/http/dto/AssociationDto";
import EtablissementDto from "../search/interfaces/http/dto/EtablissmentDto";

export class VersementsService {

    async aggregateVersementsByAssoSearch(asso: AssociationDto) {
        if (!asso.siren || asso.siren?.length === 0) return null;

        const siren = asso.siren[0].value;
        const versements = await this.getVersementsBySiren(siren);

        asso.versements = versements;

        asso.etablissements?.forEach(etablissement => {
            etablissement.versements = versements.filter(versement => versement.siret.value === etablissement.siret[0].value);

            etablissement.demandes_subventions?.forEach(demandeSubvention => {
                const ej = demandeSubvention.ej && demandeSubvention.ej.value;

                if (!ej) return;

                demandeSubvention.versements = (etablissement.versements as Versement[]).filter(versement => versement.ej.value === ej);
            })
        })

        return asso;
    }

    async aggregateVersementsByEtablissementSearch(etablissement: EtablissementDto) {
        if (!etablissement.siret || etablissement.siret.length === 0) return null;

        const versements = await this.getVersementsBySiret(etablissement.siret[0].value);

        etablissement.versements = versements;

        etablissement.demandes_subventions?.forEach(demandeSubvention => {
            const ej = demandeSubvention.ej && demandeSubvention.ej.value;

            if (!ej) return;

            demandeSubvention.versements = versements.filter(versement => versement.ej.value === ej);
        })

        return etablissement;
    }

    private async getVersementsBySiret(siret: Siret): Promise<Versement[]> {
        const providers = this.getProviders()
        return [...(await Promise.all(
            providers.map(p => p.getVersementsBySiret(siret))
        )).flat()];
    }

    private async getVersementsBySiren(siren: Siren): Promise<Versement[]> {
        const providers = this.getProviders()
        return [...(await Promise.all(
            providers.map(p => p.getVersementsBySiren(siren))
        )).flat()];
    }

    private getProviders(): VersementsProvider[] {
        return Object.values(providers).filter((p) => this.isVersementsProvider(p)) as unknown as VersementsProvider[];
    }

    private isVersementsProvider(data: unknown): data is VersementsProvider {
        return (data as VersementsProvider).isVersementsProvider
    }
}

const versementsService = new VersementsService();

export default versementsService;