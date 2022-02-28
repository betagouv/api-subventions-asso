import { Siren } from "../../@types/Siren";
import { Siret } from "../../@types/Siret";
import Versement from "./interfaces/Versement";
import VersementsProvider from "./interfaces/VersementsProvider";
import providers from "../providers";
import AssociationDto from "../search/interfaces/http/dto/AssociationDto";
import EtablissementDto from "../search/interfaces/http/dto/EtablissmentDto";

export class VersementsService {

    async aggregateVersementsByAssoSearch(asso: AssociationDto) {
        if (!asso.siren || asso.siren?.length === 0) return null;

        const siren = asso.siren[0].value;
        const versements = await this.getVersementsBySiren(siren);

        const ejDemandesSub = asso.etablissements?.map(etab => {
            return etab.demandes_subventions?.map(demandeSub => demandeSub.ej?.value);
        }).flat().filter(ej => ej) || [];

        const { versementsND, versementSub } = versements.reduce((acc, versement)=> {
            if (ejDemandesSub.includes(versement.ej.value)) acc.versementSub.push(versement)
            else acc.versementsND.push(versement);
            return acc;
        }, { versementsND: [] as Versement[], versementSub: [] as Versement[] });
        
        asso.versements = {
            versements_subventions: versementSub,
            versements_autres: versementsND,
        };

        asso.etablissements?.forEach(etablissement => {
            etablissement.versements = {
                versements_subventions: versementSub.filter(versement => versement.siret.value === etablissement.siret[0].value),
                versements_autres: versementsND.filter(versement => versement.siret.value === etablissement.siret[0].value),
            };

            etablissement.demandes_subventions?.forEach(demandeSubvention => {
                const ej = demandeSubvention.ej && demandeSubvention.ej.value;

                if (!ej) return;

                demandeSubvention.versements = versementSub.filter(versement => versement.ej.value === ej);
            })
        })

        return asso;
    }

    async aggregateVersementsByEtablissementSearch(etablissement: EtablissementDto) {
        if (!etablissement.siret || etablissement.siret.length === 0) return null;

        const versements = await this.getVersementsBySiret(etablissement.siret[0].value);

        const ejDemandesSub = etablissement.demandes_subventions?.map(demandeSub => demandeSub.ej?.value).flat().filter(ej => ej) || [];

        const { versementsND, versementSub } = versements.reduce((acc, versement)=> {
            if (ejDemandesSub.includes(versement.ej.value)) acc.versementSub.push(versement)
            else acc.versementsND.push(versement);
            return acc;
        }, { versementsND: [] as Versement[], versementSub: [] as Versement[] });
        
        etablissement.versements = {
            versements_subventions: versementSub.filter(versement => versement.siret.value === etablissement.siret[0].value),
            versements_autres: versementsND.filter(versement => versement.siret.value === etablissement.siret[0].value),
        };

        etablissement.demandes_subventions?.forEach(demandeSubvention => {
            const ej = demandeSubvention.ej && demandeSubvention.ej.value;

            if (!ej) return;

            demandeSubvention.versements = versementSub.filter(versement => versement.ej.value === ej);
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