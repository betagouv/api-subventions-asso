import axios from "axios";
import { ProviderEnum } from '../../../@enums/ProviderEnum';
import { Rna, Siren, Siret, Association, Etablissement } from "@api-subventions-asso/dto";
import CacheData from "../../../shared/Cache";
import EventManager from "../../../shared/EventManager";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import { waitPromise } from "../../../shared/helpers/WaitHelper";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import AssociationDtoAdapter from "./adapters/AssociationDtoAdapter";
import EntrepriseDtoAdapter from "./adapters/EntrepriseDtoAdapter";
import EtablissementDtoAdapter from "./adapters/EtablissementDtoAdapter";
import AssociationDto from "./dto/AssociationDto";
import EntrepriseDto from "./dto/EntrepriseDto";
import EtablisementDto from "./dto/EtablissementDto";
import rnaSirenService from '../../open-data/rna-siren/rnaSiren.service';

export class DataEntrepriseService implements AssociationsProvider, EtablissementProvider {
    provider = {
        name: "API SIRENE données ouvertes + API Répertoire des Associations (RNA)",
        type: ProviderEnum.api,
        description: "L'API SIRENE données ouvertes est une API qui a été créée par la Dinum et s'appuie sur les données publiées en open data par l'INSEE sur les entreprises sur data.gouv. L'API RNA est une API portée par la Dinum exposant les données publiées en open data par le RNA sur data.gouv."
    }

    private BASE_URL = "https://entreprise.data.gouv.fr";
    private RNA_ROUTE = "api/rna/v1/id"
    private SIRETTE_ROUTE = "api/sirene/v3/etablissements";
    private SIRENE_ROUTE = "api/sirene/v3/unites_legales";
    private LIMITATION_NB_REQUEST_SEC = 7;

    private etablissementsCache = new CacheData<Etablissement>(CACHE_TIMES.ONE_DAY);
    private associationsCache = new CacheData<Association>(CACHE_TIMES.ONE_DAY);
    private associationsRnaCache = new CacheData<Association>(CACHE_TIMES.ONE_DAY);
    private requestCache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);

    private async sendRequest<T>(route: string, wait: boolean): Promise<T | null> {
        if (this.requestCache.has(route)) return this.requestCache.get(route)[0] as T;
        if (wait) {
            await waitPromise(1000 / this.LIMITATION_NB_REQUEST_SEC);
        }

        try {
            const res = await axios.get<T>(`${this.BASE_URL}/${route}`);
            this.requestCache.add(route, res.data);
            return res.data;
        } catch {
            return null;
        }
    }

    public async findEtablissementBySiret(siret: Siret, wait = false): Promise<Etablissement | null> {
        const data = await this.sendRequest<{etablissement: EtablisementDto}>(`${this.SIRETTE_ROUTE}/${siret}`, wait);
        if (!data?.etablissement) return null;

        const association = data.etablissement?.unite_legale;
        const rna = association?.identifiant_association;

        if (rna) {
            EventManager.call('rna-siren.matching', [{ rna, siren: siret}]);
            const name = association.denomination;
            if (name) EventManager.call('association-name.matching', [{rna, siren: siret, name, provider: this.provider.name, lastUpdate: data.etablissement.updated_at}]);
        }

        const etablissement = EtablissementDtoAdapter.toEtablissement(data.etablissement);
        this.etablissementsCache.add(siret, etablissement);

        return etablissement;
    }

    public async findAssociationBySiren(siren: Siren, wait = false) {
        const data = await this.sendRequest<EntrepriseDto>(`${this.SIRENE_ROUTE}/${siren}`, wait);
        if (!data) return null;

        const association = data.unite_legale;
        const rna = association.identifiant_association;
        if (rna) {
            const name = association.denomination;
            EventManager.call('rna-siren.matching', [{ rna, siren}]);
            EventManager.call('association-name.matching', [{rna, siren, name, provider: this.provider.name, lastUpdate: association.updated_at}]);
        }
        
        if (data.unite_legale.etablissements) {
            data.unite_legale.etablissements.forEach(etablissement => {
                const etab = EtablissementDtoAdapter.toEtablissement({ ...etablissement, unite_legale: data.unite_legale });
                this.etablissementsCache.add(etablissement.siret, etab);
            });
        }
        
        return EntrepriseDtoAdapter.toAssociation(data);
    }
    
    public async findAssociationByRna(rna: Rna, wait = false) {
        const data = await this.sendRequest<AssociationDto>(`${this.RNA_ROUTE}/${rna}`, wait);
        if (!data) return null;
        
        const association = data.association;
        if (association.siret) {
            const name = association.titre;
            EventManager.call('rna-siren.matching', [{rna, siren: association.siret}])
            EventManager.call('association-name.matching', [{rna, siren: association.siret, name, provider: this.provider.name, lastUpdate: association.updated_at}]);
        }

        return AssociationDtoAdapter.toAssociation(data);
    }

    /**
     * |-------------------------|
     * |    Associations Part    |
     * |-------------------------|
     */
    
    isAssociationsProvider = true;

    async getAssociationsBySiren(siren: Siren): Promise<Association[] | null> {
        if (this.associationsCache.has(siren)) return this.associationsCache.get(siren);

        const assos = [];
        const assoFromSiren = await this.findAssociationBySiren(siren);
        if (assoFromSiren) assos.push(assoFromSiren);

        let rna = await rnaSirenService.getRna(siren);
        if (!rna && assoFromSiren?.rna?.length && assoFromSiren.rna[0].value) {
            rna = assoFromSiren.rna[0].value;
        }
        
        if (rna) {
            const assoFromRna = await this.findAssociationByRna(rna);
            if (assoFromRna) assos.push(assoFromRna);
        }

        if (assos.length) {
            assos.forEach(asso => this.associationsCache.add(siren, asso));
            return assos;
        }

        return null;
    }

    async getAssociationsBySiret(siret: Siret): Promise<Association[] | null> {
        const siren = siretToSiren(siret);
        if (this.associationsCache.has(siren)) return this.associationsCache.get(siren);
        const assos = [];
        const result = await this.sendRequest<{etablissement: EtablisementDto}>(`${this.SIRETTE_ROUTE}/${siret}`, false);

        if (result?.etablissement) assos.push(
            EntrepriseDtoAdapter.toAssociation({
                unite_legale: {
                    ...result.etablissement.unite_legale
                }
            })
        );

        const rna = await rnaSirenService.getRna(siren);
        if (rna) {
            const data = await this.findAssociationByRna(rna);
            if (data) assos.push(data);
        }

        return assos;
    }

    async getAssociationsByRna(rna: Rna): Promise<Association[] | null> {
        if (this.associationsRnaCache.has(rna)) return this.associationsRnaCache.get(rna);

        const asso = await this.findAssociationByRna(rna);

        if (!asso) return null; 
        
        this.associationsRnaCache.add(rna, asso);

        return [ asso ];
    }


    /**
     * |-------------------------|
     * |   Etablisesement Part   |
     * |-------------------------|
     */
    
    isEtablissementProvider = true;

    async getEtablissementsBySiret(siret: Siret): Promise<Etablissement[] | null> {
        if (this.etablissementsCache.has(siret)) return this.etablissementsCache.get(siret);

        const result = await this.findEtablissementBySiret(siret);

        if (!result) return null

        return [result];
    }

    async getEtablissementsBySiren(siren: Siren): Promise<Etablissement[] | null> {
        let etablisementsList: string[] = [];

        const associations = await this.getAssociationsBySiren(siren);

        
        if (associations && associations.length) {
            const association = associations.find(a => a.etablisements_siret?.length);
            const associationWithEtablisements = association?.etablisements_siret?.flat()[0].value;

            if (!associationWithEtablisements) return null;

            etablisementsList = associationWithEtablisements;
        }

        return etablisementsList.reduce(async (acc, siret) => {
            const data = await acc;
            return data.concat(... (await this.getEtablissementsBySiret(siret)) as Etablissement[]);
        }, Promise.resolve([]) as Promise<Etablissement[]>);
    }

}

const dataEntrepriseService = new DataEntrepriseService();

export default dataEntrepriseService;