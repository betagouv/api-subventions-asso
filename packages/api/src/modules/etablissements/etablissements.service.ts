import { ProviderValues, Siren, Siret, Etablissement } from "@api-subventions-asso/dto";

import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import EtablissementDtoAdapter from "../providers/dataEntreprise/adapters/EtablissementDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import { DefaultObject } from "../../@types";
import EtablissementProvider from "./@types/EtablissementProvider";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import providers from "../providers";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import subventionsService from "../subventions/subventions.service";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import { isSiren } from "../../shared/Validators";
import versementsService from "../versements/versements.service";
import documentsService from "../documents/documents.service";
import ApiEntrepriseAdapter from "../providers/apiEntreprise/adapters/ApiEntrepriseAdapter";
import { EtablissementAdapter } from "./EtablissementAdapter";
import associationsService from "../associations/associations.service";

export class EtablissementsService {
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [EtablissementDtoAdapter.PROVIDER_NAME]: 1,
        [ApiEntrepriseAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5,
        [FonjepEntityAdapter.PROVIDER_NAME]: 0.5
    };

    async getEtablissement(siret: Siret) {
        const data = await this.aggregate(siret);
        if (!data.length) return null;
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown"
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Etablissement;
    }

    async getEtablissementsBySiren(siren: Siren) {
        const data = await this.aggregate(siren);

        if (!data.length) return null;

        const groupBySiret = data.reduce((acc, etablissement) => {
            const siret = etablissement.siret[0].value;

            if (!siret) return acc;

            if (!acc[siret]) acc[siret] = [];
            acc[siret].push(etablissement);

            return acc;
        }, {} as DefaultObject<Etablissement[]>);
        const etablissements = Object.values(groupBySiret).map(
            etablissements =>
                // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown"
                FormaterHelper.formatData(
                    // @ts-expect-error: idem
                    etablissements as DefaultObject<ProviderValues>[],
                    this.provider_score
                ) as Etablissement
        );

        const sortEtablissmentsByStatus = (etablisementA: Etablissement, etablisementB: Etablissement) =>
            this.scoreEtablisement(etablisementB) - this.scoreEtablisement(etablisementA);
        const sortedEtablissement = etablissements.sort(sortEtablissmentsByStatus); // The order is the "siege" first, the secondary is open, the third is closed.
        return sortedEtablissement.map(etablissement => EtablissementAdapter.toSimplifiedEtablissement(etablissement));
    }

    getSubventions(siret: Siret) {
        return subventionsService.getDemandesByEtablissement(siret);
    }

    async getVersements(siret: Siret) {
        return await versementsService.getVersementsBySiret(siret);
    }

    async getDocuments(siret: Siret) {
        return await documentsService.getDocumentBySiret(siret);
    }

    private async aggregate(id: Siren | Siret) {
        const getter = isSiren(id) ? "getEtablissementsBySiren" : "getEtablissementsBySiret";
        const etablisementProviders = this.getEtablissementProviders();

        const promises = etablisementProviders.map(async provider => {
            const etabs = await provider[getter](id, true);
            if (etabs) return etabs;
            else return null;
        });
        return (await Promise.all(promises))
            .flat()
            .flat()
            .filter(etablissement => etablissement) as Etablissement[];
    }

    private getEtablissementProviders() {
        return Object.values(providers).filter(this.isEtablissementProvider) as EtablissementProvider[];
    }

    private isEtablissementProvider(data: unknown): data is EtablissementProvider {
        return (data as EtablissementProvider).isEtablissementProvider;
    }

    private scoreEtablisement(etablisement: Etablissement) {
        let score = 0;

        if (etablisement.ouvert && etablisement.ouvert[0].value) score += 1;
        if (etablisement.siege && etablisement.siege[0].value) score += 10;
        return score;
    }

    async registerRequest(etablissement: Etablissement) {
        const association = await associationsService.getAssociationBySiret(etablissement?.siret?.[0]?.value);
        if (!association) return;
        return associationsService.registerRequest(association);
    }
}

const etablissementService = new EtablissementsService();

export default etablissementService;
