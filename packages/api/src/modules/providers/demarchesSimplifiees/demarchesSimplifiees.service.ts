import lodash from "lodash";
import { DemandeSubvention } from "dto";
import { InternalServerError } from "core";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DEMARCHES_SIMPLIFIEES_TOKEN } from "../../../configurations/apis.conf";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { DefaultObject } from "../../../@types";
import ProviderCore from "../ProviderCore";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import GrantProvider from "../../grant/@types/GrantProvider";
import demarchesSimplifieesDataPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesSchemaPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import { DemarchesSimplifieesDto } from "./dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import DemarchesSimplifieesSchema, { DemarchesSimplifieesSchemaLine } from "./entities/DemarchesSimplifieesSchema";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import { DemarchesSimplifieesRawData } from "./@types/DemarchesSimplifieesRawGrant";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";
import {
    DemarchesSimplifieesSchemaSeed,
    DemarchesSimplifieesSchemaSeedLine,
} from "./entities/DemarchesSimplifieesSchemaSeed";
import { input } from "@inquirer/prompts";
import configurationsService from "../../configurations/configurations.service";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ReadableStream } from "stream/web";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";

export class DemarchesSimplifieesService
    extends ProviderCore
    implements DemandesSubventionsProvider<DemarchesSimplifieesRawData>, GrantProvider, ApplicationFlatProvider
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

    /**
     * |-------------------------|
     * |   Flat                  |
     * |-------------------------|
     */

    isApplicationFlatProvider = true as const;

    async saveFlatFromStream(stream: ReadableStream<ApplicationFlatEntity>): Promise<void> {
        await applicationFlatService.saveFromStream(stream);
    }

    async initApplicationFlat() {
        const cursor = demarchesSimplifieesDataPort.findAllCursor();
        const schemasByIds = await this.getSchemasByIds();
        const stream: ReadableStream<ApplicationFlatEntity> = cursorToStream(
            cursor,
            (dbo: DemarchesSimplifieesDataEntity) => this.toFlatAndValidate(dbo, schemasByIds[dbo.demarcheId]),
        );
        return this.saveFlatFromStream(stream);
    }

    toFlatAndValidate(
        dbo: DemarchesSimplifieesDataEntity,
        schema: DemarchesSimplifieesSchema,
    ): ApplicationFlatEntity | null {
        if (!schema?.flatSchema || this.isDraft(dbo)) return null;
        const res = DemarchesSimplifieesEntityAdapter.toFlat(dbo, schema);
        // those are the only mandatory field that comes from 'champs' or 'annotations'
        // which is why it is the only one that we check here
        if (!res.requestedAmount) return null;
        if (!res.budgetaryYear) return null;
        return res;
    }

    bulkUpdateApplicationFlat(entities: DemarchesSimplifieesDataEntity[], schema: DemarchesSimplifieesSchema | null) {
        if (!schema) return;
        const stream = ReadableStream.from(entities.map(e => this.toFlatAndValidate(e, schema)).filter(e => !!e));
        return this.saveFlatFromStream(stream);
    }

    /**
     * |-------------------------|
     * |   Général               |
     * |-------------------------|
     */

    private async getSchemasByIds() {
        const schemas = await demarchesSimplifieesSchemaPort.findAll();

        return schemas.reduce(
            (acc, schema) => {
                acc[schema.demarcheId] = schema;
                return acc;
            },
            {} as Record<string, DemarchesSimplifieesSchema>,
        );
    }

    private isDraft(entity: DemarchesSimplifieesDataEntity) {
        return entity && entity?.demande?.state === "en_construction";
    }

    private async filterAndAdaptEntities<T>(
        entities: DemarchesSimplifieesDataEntity[],
        adapter: (entity: DemarchesSimplifieesDataEntity, schema: DemarchesSimplifieesSchema) => T,
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
        const beginUpdating = new Date();
        this.lastModified = await configurationsService.getLastDsUpdate();

        if (!formsIds) {
            throw new Error("DS is not configured on this env, please add schema");
        }

        await asyncForEach(formsIds, formId => this.updateDataByFormId(formId));
        await configurationsService.setLastDsUpdate(beginUpdating);
    }

    async updateDataByFormId(formId: number) {
        console.log(`Syncing demarche ${formId}`);

        const schema = await demarchesSimplifieesSchemaPort.findById(formId);
        // TODO English or French?
        if (!schema)
            throw new InternalServerError(
                `demarche ${formId} is being synced but we do not have a schema for it. Skipping`,
            );

        const upsertRawAndFlat = async (bulk: DemarchesSimplifieesDataEntity[], schema: DemarchesSimplifieesSchema) => {
            await demarchesSimplifieesDataPort.bulkUpsert(bulk);
            await this.bulkUpdateApplicationFlat(bulk, schema);
        };

        let result: DemarchesSimplifieesDto;
        let nextCursor: string | undefined = undefined;
        let bulk: DemarchesSimplifieesDataEntity[] = [];
        const MAX_BULK = 1000;
        do {
            result = await this.sendQuery(GetDossiersByDemarcheId, { demarcheNumber: formId, after: nextCursor });
            if (result.data.demarche.state != "publiee") {
                console.log(`demarche ${formId} has status '${result.data.demarche.state}'. skipping`);
                return;
            }

            const entities = DemarchesSimplifieesDtoAdapter.toEntities(result, formId).filter(
                entity => new Date(entity.demande.dateDerniereModification) > this.lastModified,
            );
            bulk.push(...entities);
            if (bulk.length >= MAX_BULK) {
                await upsertRawAndFlat(bulk, schema);
                bulk = [];
            }

            nextCursor = result?.data?.demarche?.dossiers?.pageInfo?.endCursor;
        } while (result?.data?.demarche?.dossiers?.pageInfo?.hasNextPage);
        await upsertRawAndFlat(bulk, schema);
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

    addSchema(schema: DemarchesSimplifieesSchema) {
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
        if ("value" in joinKeySchemaItem) return joinKeySchemaItem.value.toString();

        const joinKeyFieldName = joinKeySchemaItem.from;
        let joinKey: string | undefined;
        if (joinKeyFieldName) joinKey = lodash.get(data.entity, joinKeyFieldName);
        return joinKey?.toString();
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

    async buildSchema(schemaModel: DemarchesSimplifieesSchemaSeedLine[], formId: number) {
        const builtSchema: DemarchesSimplifieesSchemaLine[] = [];
        const queryResult = await this.sendQuery(GetDossiersByDemarcheId, { demarcheNumber: formId });
        const exampleData = DemarchesSimplifieesDtoAdapter.toEntities(queryResult, formId)?.[0];

        for (const champ of schemaModel) {
            if (!("to" in champ))
                throw new Error(`"invalid schemaSeed. 'to' missing in seed item ${JSON.stringify(champ)}`);
            const singleSchemaPart = await this.generateSchemaInstruction(champ, exampleData);
            if (!singleSchemaPart) continue;
            builtSchema.push({ ...singleSchemaPart, to: champ.to });
        }
        return builtSchema;
    }

    private async generateSchemaInstruction(
        champ: DemarchesSimplifieesSchemaSeedLine,
        exampleDemarche: DemarchesSimplifieesDataEntity,
    ): Promise<{ value: string | number } | { from: string } | undefined> {
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
            if (inputValue) return { value: parseFloat(inputValue) || inputValue };
            if ("value" in champ) return { value: champ.value };
        }

        console.log(`no instruction found for target field ${champ.to}`);
        if (champ.to === "exercice")
            console.log("L'exercice peut être déduit de la date de début de projet si celle-ci est mappée");
        return;
    }

    async buildFullSchema(
        schemaSeed: DemarchesSimplifieesSchemaSeed,
        demarcheId: number,
    ): Promise<DemarchesSimplifieesSchema & { demarcheId: number }> {
        const types = {
            schema: "DemandeSubvention",
            commonSchema: "CommonGrant",
            flatSchema: "ApplicationFlat",
        };

        const res = { demarcheId };
        for (const schemaType of Object.keys(schemaSeed)) {
            console.log(`Génération du schéma pour le type '${types[schemaType]}'`);
            res[schemaType] = await demarchesSimplifieesService.buildSchema(schemaSeed[schemaType], demarcheId);
            console.log("\n");
        }
        return res as DemarchesSimplifieesSchema & { demarcheId: number };
    }
}

const demarchesSimplifieesService = new DemarchesSimplifieesService();

export default demarchesSimplifieesService;
