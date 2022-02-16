import leCompteAssoService from "../providers/leCompteAsso/leCompteAsso.service";
import etablissementService from "../etablissements/etablissements.service";
import associationsService from "../associations/associations.service";
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import chorusService from "../providers/chorus/chorus.service";
import osirisService from "../providers/osiris/osiris.service";
import RequestEntity from "./entities/RequestEntity";

import ProviderRequestInterface from "./@types/ProviderRequestInterface";
import IBudgetLine from "./@types/IBudgetLine";
import { Siret } from "../../@types/Siret";
import { Rna } from "../../@types/Rna";
import demandesSubventionsService from "../demandes_subventions/demandes_subventions.service";
import Etablissement from "../etablissements/interfaces/Etablissement";

export class SearchService {

    public async getBySiret(siret: Siret) {
        const siren = siretToSiren(siret);

        const association = await associationsService.getAssociationBySiren(siren)

        if (!association || !association.etablisements_siret?.find(providerValue => providerValue.value.includes(siret))) return null;

        const etablissement = await etablissementService.getEtablissement(siret);
        if (!etablissement) return null;

        return {
            ...etablissement,
            association,
            demandes_subventions: await demandesSubventionsService.getDemandeSubventionsBySiret(siret),
        };
    }

    public async getByRna(rna: Rna) {
        const siret = await this.findSiretByRna(rna);

        if (!siret) return null;

        const siren = siretToSiren(siret);

        const association = await associationsService.getAssociationBySiren(siren, rna);

        if (!association) return null;

        const sirets = (association.etablisements_siret || [])
            .map(value => value.value)
            .flat();

        const etablissements = (await Promise.all(
            [...new Set(sirets)].map(siret => etablissementService.getEtablissement(siret))
        )).filter(e => e) as Etablissement[];

        return {
            ...association,
            etablissements: await Promise.all(
                etablissements.map(async (etablissement) => ({
                    ...etablissement,
                    demandes_subventions: await demandesSubventionsService.getDemandeSubventionsBySiret(etablissement.siret[0].value)
                }))
            )
        }
    }

    public findRequestsBySiret(siret: Siret) {
        return this.findRequests(siret, "siret");
    }

    public findRequestsByRna(rna: Rna) {
        return this.findRequests(rna, "rna");
    }

    private findSiretByRna(rna: Rna) {
        const providers: ProviderRequestInterface[] = [ // Set in method because LCA need Search and Search need LCA (Import loop)
            osirisService,
            leCompteAssoService,
        ];

        return providers.reduce(async (acc, provider) => {
            const siret = await acc;
            if (siret) return siret;
            const requests = await provider.findByRna(rna);

            return requests.find(r => r.legalInformations.siret)?.legalInformations.siret || null;
        }, Promise.resolve(null) as Promise<null|string>);
    }

    private findRequests(id: string, type: "siret" | "rna") {
        const providers: ProviderRequestInterface[] = [ // Set in method because LCA need Search and Search need LCA (Import loop)
            osirisService,
            leCompteAssoService,
        ];

        return providers.reduce((acc, provider) => {
            return acc.then(async (requests) => {
                if (type === "siret") {
                    requests.push(...await provider.findBySiret(id));
                } else {
                    requests.push(...await provider.findByRna(id));
                }
                return requests;
            });
        }, Promise.resolve([]) as Promise<RequestEntity[]>);
    }

    private findBudgetLines(siret: Siret) {
        const providers = [
            chorusService
        ]

        return providers.reduce((acc, provider) => {
            return acc.then(async (requests) => {
                requests.push(...await provider.findsBySiret(siret));
                return requests;
            });
        }, Promise.resolve([]) as Promise<{ indexedInformations: IBudgetLine }[]>);
    }
}

const searchService = new SearchService();

export default searchService;