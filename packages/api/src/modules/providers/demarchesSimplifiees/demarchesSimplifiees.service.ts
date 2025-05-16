import lodash from "lodash";
import { DemandeSubvention } from "dto";
import { InternalServerError } from "core";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DEMARCHES_SIMPLIFIEES_TOKEN } from "../../../configurations/apis.conf";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { DefaultObject, StructureIdentifier } from "../../../@types";
import ProviderCore from "../ProviderCore";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import GrantProvider from "../../grant/@types/GrantProvider";
import demarchesSimplifieesDataPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesSchemaPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import { DemarchesSimplifieesDto } from "./dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import DemarchesSimplifieesSchemaEntity from "./entities/DemarchesSimplifieesSchemaEntity";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import { DemarchesSimplifieesRawData } from "./@types/DemarchesSimplifieesRawGrant";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";
import configurationsService from "../../configurations/configurations.service";

export class DemarchesSimplifieesService
    extends ProviderCore
    implements DemandesSubventionsProvider<DemarchesSimplifieesRawData>, GrantProvider
{
    isDemandesSubventionsProvider = true;
    lastModified: Date;

    constructor() {
        super({
            name: "Démarches Simplifiées",
            type: ProviderEnum.api,
            description: "", // TODO
            id: "demarchesSimplifiees",
        });
        this.lastModified = new Date(0);
    }

    private async getSchemasByIds() {
        const schemas = await demarchesSimplifieesSchemaPort.findAll();

        return schemas.reduce(
            (acc, schema) => {
                acc[schema.demarcheId] = schema;
                return acc;
            },
            {} as Record<string, DemarchesSimplifieesSchemaEntity>,
        );
    }

    private isDraft(entity: DemarchesSimplifieesDataEntity) {
        return entity && entity?.demande?.state === "en_construction";
    }

    private async filterAndAdaptEntities<T>(
        entities: DemarchesSimplifieesDataEntity[],
        adapter: (entity: DemarchesSimplifieesDataEntity, schema: DemarchesSimplifieesSchemaEntity) => T,
    ) {
        const schemasByIds = await this.getSchemasByIds();
        const reduceToValidEntities = (acc, entity) => {
            const schema = schemasByIds[entity.demarcheId];
            if (!schema || this.isDraft(entity)) return acc;
            acc.push(adapter(entity, schema));
            return acc;
        };
        return entities.reduce(reduceToValidEntities, []) as T[];
    }

    private async entitiesToSubventions(entities: DemarchesSimplifieesDataEntity[]) {
        return await this.filterAndAdaptEntities<DemandeSubvention>(
            entities,
            DemarchesSimplifieesEntityAdapter.toSubvention,
        );
    }

    async getDemandeSubvention(id: StructureIdentifier): Promise<DemandeSubvention[]> {
        let demandes: DemarchesSimplifieesDataEntity[] = [];

        if (id instanceof EstablishmentIdentifier && id.siret) {
            demandes = await demarchesSimplifieesDataPort.findBySiret(id.siret);
        } else if (id instanceof AssociationIdentifier && id.siren) {
            demandes = await demarchesSimplifieesDataPort.findBySiren(id.siren);
        }

        return this.entitiesToSubventions(demandes);
    }

    /**
     * |-------------------------|
     * |   Cache Maintenance     |
     * |-------------------------|
     */

    async updateAllForms() {
        const formsIds = await demarchesSimplifieesSchemaPort.getAcceptedDemarcheIds();

        if (!formsIds) {
            throw new Error("DS is not configured on this env, please add schema");
        }

        await asyncForEach(formsIds, formId => this.updateDataByFormId(formId));
        await configurationsService.setLastDsUpdate(beginUpdating);
    }

    async updateDataByFormId(formId: number) {
        console.log(`Synchronisation de la démarche ${formId}`);
        let result: DemarchesSimplifieesDto;
        let nextCursor: string | undefined = undefined;
        let bulk: DemarchesSimplifieesDataEntity[] = [];
        const MAX_BULK = 1000;
        do {
            result = await this.sendQuery(GetDossiersByDemarcheId, { demarcheNumber: formId, after: nextCursor });

            if (result?.errors?.length)
                throw new InternalServerError(result?.errors?.map(error => error.message).join(" - "));
            if (!result?.data?.demarche)
                throw new InternalServerError("empty Démarches Simplifiées result (not normal with graphQL)");
            if (result.data.demarche.state != "publiee") {
                console.log(`demarche ${formId} a le statut '${result.data.demarche.state}', on passe`);
                return;
            }

            const entities = DemarchesSimplifieesDtoAdapter.toEntities(result, formId).filter(
                entity => new Date(entity.demande.dateDerniereModification) > this.lastModified,
            );
            bulk.push(...entities);
            if (bulk.length >= MAX_BULK) {
                await demarchesSimplifieesDataPort.bulkUpsert(bulk);
                bulk = [];
            }

            nextCursor = result?.data?.demarche?.dossiers?.pageInfo?.endCursor;
        } while (result?.data?.demarche?.dossiers?.pageInfo?.hasNextPage);
        await demarchesSimplifieesDataPort.bulkUpsert(bulk);
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

    addSchema(schema: DemarchesSimplifieesSchemaEntity) {
        return demarchesSimplifieesSchemaPort.upsert(schema);
    }

    /**
     * |-------------------------|
     * |       Grant Part        |
     * |-------------------------|
     */

    isGrantProvider = true;

    /** GRANT */

    public getJoinKey(data: DemarchesSimplifieesRawData) {
        // TODO: rename schema to schemas and sub schema to default ?
        const schema = data.schema.schema;

        // EJ and versementKey are the same.
        // versementKey abstracts the EJ key that is not always the name of the joiner to match with payments
        // i.e: in Fonjep we use code_poste instead of EJ

        const joinKeySchemaItem = schema.find(field => field.to === "ej" || field.to === "versementKey");
        if (!joinKeySchemaItem) return;
        if ("value" in joinKeySchemaItem) return joinKeySchemaItem.value;

        const joinKeyFieldName = joinKeySchemaItem.from;
        let joinKey: string | undefined;
        if (joinKeyFieldName) joinKey = lodash.get(data.entity, joinKeyFieldName);
        return joinKey;
    }

    /** RAW GRANT */

    private async toRawGrants(providerGrants: DemarchesSimplifieesDataEntity[]) {
        // améliorer l'adapter pour voir l'ej en joinKey
        return await this.filterAndAdaptEntities<RawGrant>(
            providerGrants,
            DemarchesSimplifieesEntityAdapter.toRawGrant,
        );
    }

    async getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
        let entities: DemarchesSimplifieesDataEntity[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await demarchesSimplifieesDataPort.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await demarchesSimplifieesDataPort.findBySiren(identifier.siren);
        }

        return await this.toRawGrants(entities);
    }

    rawToApplication(rawApplication: RawApplication<DemarchesSimplifieesRawData>) {
        return DemarchesSimplifieesEntityAdapter.rawToApplication(rawApplication);
    }

    rawToCommon(raw: RawGrant) {
        // @ts-expect-error: something is broken in Raw Types since #3360 => #3375
        return DemarchesSimplifieesEntityAdapter.toCommon(raw.data.grant, raw.data.schema);
    }
}

const demarchesSimplifieesService = new DemarchesSimplifieesService();

export default demarchesSimplifieesService;
