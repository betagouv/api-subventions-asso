import axios from "axios";
import { DemandeSubvention, Rna, Siren, Siret } from "@api-subventions-asso/dto";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DEMARCHES_SIMPLIFIEES_TOKEN } from "../../../configurations/apis.conf";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { DefaultObject } from "../../../@types";
import { RawGrant } from "../../grant/@types/rawGrant";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import DemarchesSimplifieesDto from "./dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import demarchesSimplifieesDataRepository from "./repositories/demarchesSimplifieesData.repository";
import demarchesSimplifieesMapperRepository from "./repositories/demarchesSimplifieesMapper.repository";
import DemarchesSimplifieesMapperEntity from "./entities/DemarchesSimplifieesMapperEntity";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";

export class DemarchesSimplifieesService implements DemandesSubventionsProvider {
    isDemandesSubventionsProvider = true;
    provider = {
        name: "Démarches Simplifiées",
        type: ProviderEnum.api,
        description: "", // TODO
        id: "demarchesSimplifiees",
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return Promise.resolve(null);
    }

    private async getSchemasByIds() {
        const schemas = await demarchesSimplifieesMapperRepository.findAll();

        return schemas.reduce((acc, schema) => {
            acc[schema.demarcheId] = schema;
            return acc;
        }, {});
    }

    private async entitiesToSubventions(entities) {
        const schemasByIds = await this.getSchemasByIds();

        return entities
            .map(demande => {
                const schema = schemasByIds[demande.demarcheId];

                if (!schema) return null;

                return DemarchesSimplifieesEntityAdapter.toSubvention(demande, schema);
            })
            .filter(sub => sub) as DemandeSubvention[];
    }

    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        const demandes = await demarchesSimplifieesDataRepository.findBySiren(siren);
        return this.entitiesToSubventions(demandes);
    }

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        const demandes = await demarchesSimplifieesDataRepository.findBySiret(siret);
        return this.entitiesToSubventions(demandes);
    }

    /**
     * |-------------------------|
     * |   Cache Maintenance     |
     * |-------------------------|
     */

    async updateAllForms() {
        const formsIds = await demarchesSimplifieesMapperRepository.getAcceptedDemarcheIds();

        if (!formsIds) {
            throw new Error("DS is not configured on this env, please add mapper");
        }

        await asyncForEach(formsIds, async formId => {
            await this.updateDataByFormId(formId);
        });
    }

    async updateDataByFormId(formId: number) {
        const result = await this.sendQuery(GetDossiersByDemarcheId, {
            demarcheNumber: formId,
        });

        if (!result || !result.data) return;

        const entities = DemarchesSimplifieesDtoAdapter.toEntities(result, formId);
        await asyncForEach(entities, async entity => {
            await demarchesSimplifieesDataRepository.upsert(entity);
        });
    }

    async sendQuery(query: string, vars: DefaultObject) {
        try {
            const result = await axios.post<DemarchesSimplifieesDto>(
                "https://www.demarches-simplifiees.fr/api/v2/graphql",
                {
                    query,
                    variables: vars,
                },
                this.buildSearchHeader(DEMARCHES_SIMPLIFIEES_TOKEN),
            );

            return result.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private buildSearchHeader(token) {
        return {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                authorization: "Bearer " + token,
                "content-type": "application/json;charset=UTF-8",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
        };
    }

    addSchemaMapper(schema: DemarchesSimplifieesMapperEntity) {
        return demarchesSimplifieesMapperRepository.upsert(schema);
    }

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
     * |-------------------------|
     */

    isGrantProvider = true;

    private async toRawGrants(providerGrants: DemarchesSimplifieesDataEntity[]): Promise<RawGrant[]> {
        const schemasById = await this.getSchemasByIds();
        const rawGrants = providerGrants.map(grant => {
            if (!schemasById?.[grant.demarcheId]) return null;
            return {
                provider: this.provider.id,
                type: "application",
                data: { grant, schema: schemasById[grant.demarcheId] },
            };
        });
        return rawGrants.filter(g => !!g) as RawGrant[];
    }

    async getRawGrantsBySiret(siret: string): Promise<RawGrant[] | null> {
        const grants = await demarchesSimplifieesDataRepository.findBySiret(siret);
        return await this.toRawGrants(grants);
    }

    async getRawGrantsBySiren(siren: string): Promise<RawGrant[] | null> {
        const grants = await demarchesSimplifieesDataRepository.findBySiren(siren);
        return await this.toRawGrants(grants);
    }

    getRawGrantsByRna(): Promise<RawGrant[] | null> {
        return Promise.resolve(null);
    }
}

const demarchesSimplifieesService = new DemarchesSimplifieesService();

export default demarchesSimplifieesService;
