import { DemandeSubvention, Rna, Siren, Siret } from "dto";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DEMARCHES_SIMPLIFIEES_TOKEN } from "../../../configurations/apis.conf";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { DefaultObject } from "../../../@types";
import { RawGrant } from "../../grant/@types/rawGrant";
import { InternalServerError } from "../../../shared/errors/httpErrors";
import ProviderCore from "../ProviderCore";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import { DemarchesSimplifieesDto } from "./dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import demarchesSimplifieesDataRepository from "./repositories/demarchesSimplifieesData.repository";
import demarchesSimplifieesMapperRepository from "./repositories/demarchesSimplifieesMapper.repository";
import DemarchesSimplifieesMapperEntity from "./entities/DemarchesSimplifieesMapperEntity";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";

export class DemarchesSimplifieesService extends ProviderCore implements DemandesSubventionsProvider {
    isDemandesSubventionsProvider = true;

    constructor() {
        super({
            name: "Démarches Simplifiées",
            type: ProviderEnum.api,
            description: "", // TODO
            id: "demarchesSimplifiees",
        });
    }

    private async getSchemasByIds() {
        const schemas = await demarchesSimplifieesMapperRepository.findAll();

        return schemas.reduce((acc, schema) => {
            acc[schema.demarcheId] = schema;
            return acc;
        }, {} as Record<string, DemarchesSimplifieesMapperEntity>);
    }

    private isDraft(entity: DemarchesSimplifieesDataEntity) {
        return entity && entity?.demande?.state === "en_construction";
    }

    private async filterAndAdaptEntities(
        entities: DemarchesSimplifieesDataEntity[],
        adapter: (entity: DemarchesSimplifieesDataEntity, mapper: DemarchesSimplifieesMapperEntity) => unknown,
    ) {
        // TODO: I think we use schema and mapper to talk about the same thing here and we choose only one term
        const schemasByIds = await this.getSchemasByIds();
        const reduceToValidEntities = (acc, entity) => {
            const schema = schemasByIds[entity.demarcheId];
            if (!schema || this.isDraft(entity)) return acc;
            acc.push(adapter(entity, schema));
            return acc;
        };
        return entities.reduce(reduceToValidEntities, []);
    }

    private async entitiesToSubventions(entities: DemarchesSimplifieesDataEntity[]) {
        return await this.filterAndAdaptEntities(entities, DemarchesSimplifieesEntityAdapter.toSubvention);
    }

    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        const demandes = await demarchesSimplifieesDataRepository.findBySiren(siren);
        return this.entitiesToSubventions(demandes);
    }

    async getGrantBySiren(siren: Siren) {
        const grants = await this.getDemandeSubventionBySiren(siren);
        return grants?.map(grant => ({
            provider: this.provider.id,
            type: "application",
            // TODO?: add schema ? see toRawGrants
            data: grant,
        }));
    }

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        const demandes = await demarchesSimplifieesDataRepository.findBySiret(siret);
        return this.entitiesToSubventions(demandes);
    }

    async getGrantBySiret(siret: Siret) {
        const grants = await this.getDemandeSubventionBySiret(siret);
        return grants?.map(grant => ({
            provider: this.provider.id,
            type: "application",
            // TODO?: add schema ? see toRawGrants
            data: grant,
        }));
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
        let result: DemarchesSimplifieesDto;
        let nextCursor: string | undefined = undefined;
        do {
            result = await this.sendQuery(GetDossiersByDemarcheId, {
                demarcheNumber: formId,
                after: nextCursor,
            });

            if (result?.errors?.length)
                throw new InternalServerError(result?.errors?.map(error => error.message).join(" - "));
            if (!result?.data?.demarche)
                throw new InternalServerError("empty Démarches Simplifiées result (not normal with graphQL)");

            const entities = DemarchesSimplifieesDtoAdapter.toEntities(result, formId);
            await asyncForEach(entities, async entity => {
                await demarchesSimplifieesDataRepository.upsert(entity);
            });
            nextCursor = result?.data?.demarche?.dossiers?.pageInfo?.endCursor;
        } while (result?.data?.demarche?.dossiers?.pageInfo?.hasNextPage);
    }

    async sendQuery(query: string, vars: DefaultObject) {
        if (!DEMARCHES_SIMPLIFIEES_TOKEN) throw new InternalServerError("DEMARCHES_SIMPLIFIEES_TOKEN is not defined");
        try {
            const result = await this.http.post<DemarchesSimplifieesDto>(
                "https://www.demarches-simplifiees.fr/api/v2/graphql",
                {
                    query,
                    variables: vars,
                },
                {
                    ...this.buildSearchHeader(DEMARCHES_SIMPLIFIEES_TOKEN),
                    keepAlive: true,
                },
            );

            return result.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    private buildSearchHeader(token: string) {
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
        return await this.filterAndAdaptEntities(providerGrants, DemarchesSimplifieesEntityAdapter.toRawGrant);
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

    rawToCommon(raw: RawGrant) {
        return DemarchesSimplifieesEntityAdapter.toCommon(raw.data.grant, raw.data.schema);
    }
}

const demarchesSimplifieesService = new DemarchesSimplifieesService();

export default demarchesSimplifieesService;
