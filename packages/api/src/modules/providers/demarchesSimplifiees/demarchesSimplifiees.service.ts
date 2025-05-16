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
import DemarchesSimplifieesSchemaEntity, {
    DemarchesSimplifieesSingleSchema,
} from "./entities/DemarchesSimplifieesSchemaEntity";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import { DemarchesSimplifieesRawData } from "./@types/DemarchesSimplifieesRawGrant";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";
import {
    DemarchesSimplifieesSchemaSeed,
    DemarchesSimplifieesSingleSchemaSeed,
} from "./entities/DemarchesSimplifieesSchemaSeedEntity";
import { input } from "@inquirer/prompts";

export class DemarchesSimplifieesService
    extends ProviderCore
    implements DemandesSubventionsProvider<DemarchesSimplifieesRawData>, GrantProvider
{
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

        await asyncForEach(formsIds, async formId => {
            await this.updateDataByFormId(formId);
        });
    }

    async updateDataByFormId(formId: number) {
        let result: DemarchesSimplifieesDto;
        let nextCursor: string | undefined = undefined;
        do {
            result = await this.sendQuery(GetDossiersByDemarcheId, { demarcheNumber: formId, after: nextCursor });
            const entities = DemarchesSimplifieesDtoAdapter.toEntities(result, formId);
            await asyncForEach(entities, async entity => {
                await demarchesSimplifieesDataPort.upsert(entity);
            });
            nextCursor = result?.data?.demarche?.dossiers?.pageInfo?.endCursor;
        } while (result?.data?.demarche?.dossiers?.pageInfo?.hasNextPage);
    }

    async sendQuery(query: string, vars: DefaultObject) {
        if (!DEMARCHES_SIMPLIFIEES_TOKEN) throw new InternalServerError("DEMARCHES_SIMPLIFIEES_TOKEN is not defined");
        let result: { data: DemarchesSimplifieesDto };
        try {
            result = await this.http.post<DemarchesSimplifieesDto>(
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
        } catch (e) {
            console.error(e);
            throw e;
        }

        if (result.data?.errors?.length)
            throw new InternalServerError(result.data.errors?.map(error => error.message).join(" - "));
        if (!result.data?.data?.demarche)
            throw new InternalServerError("empty Démarches Simplifiées result (not normal with graphQL)");

        return result.data;
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

    async buildSchema(schemaModel: DemarchesSimplifieesSingleSchemaSeed[], formId: number) {
        const builtSchema: DemarchesSimplifieesSingleSchema[] = [];
        const queryResult = await this.sendQuery(GetDossiersByDemarcheId, { demarcheNumber: formId });
        const exampleData = DemarchesSimplifieesDtoAdapter.toEntities(queryResult, formId)?.[0];

        for (const champ of schemaModel) {
            const singleSchemaPart = await this.generateSchemaInstruction(champ, exampleData);
            if (!singleSchemaPart) continue;
            builtSchema.push({ ...singleSchemaPart, to: champ.to });
        }
        return builtSchema;
    }

    private async generateSchemaInstruction(
        champ: DemarchesSimplifieesSingleSchemaSeed,
        exampleDemarche: DemarchesSimplifieesDataEntity,
    ): Promise<{ value: string } | { from: string } | undefined> {
        // TODO test when multiple stuff are noted
        if ("from" in champ) return { from: champ.from };
        if ("possibleLabels" in champ) {
            for (const [id, field] of Object.entries(exampleDemarche.demande.annotations))
                if (champ.possibleLabels.includes(field.label)) return { from: `demande.annotations.${id}.value` };
            for (const [id, field] of Object.entries(exampleDemarche.demande.champs))
                if (champ.possibleLabels.includes(field.label)) return { from: `demande.champs.${id}.value` };
        }
        if ("valueToPrompt" in champ || "value" in champ) {
            const inputValue = await input({
                message: `Entrer une valeur figée pour le champ ${champ.to}`,
                default: "value" in champ ? String(champ.value) : undefined,
            });
            if (inputValue) return { value: inputValue };
            if ("value" in champ && champ.value) return { value: champ.value };
        }

        console.log(`no instruction found for target field ${champ.to}`);
        if (champ.to === "exercice")
            console.log("L'exercice peut- être déduit de la date de début de projet si celle-ci est mappée");
        return;
    }

    async buildFullSchema(schemaSeed: DemarchesSimplifieesSchemaSeed, demarcheId: number) {
        return {
            schema: await demarchesSimplifieesService.buildSchema(schemaSeed.schema, demarcheId),
            commonSchema: await demarchesSimplifieesService.buildSchema(schemaSeed.commonSchema, demarcheId),
            demarcheId,
        };
    }
}

const demarchesSimplifieesService = new DemarchesSimplifieesService();

export default demarchesSimplifieesService;
