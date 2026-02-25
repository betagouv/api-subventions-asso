import { InternalServerError } from "core";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DEMARCHES_SIMPLIFIEES_TOKEN } from "../../../configurations/apis.conf";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { DefaultObject } from "../../../@types";
import ProviderCore from "../ProviderCore";
import demarchesSimplifieesDataPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesSchemaPort from "../../../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import GetDossiersByDemarcheId from "./queries/GetDossiersByDemarcheId";
import { DemarchesSimplifieesDto } from "./dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDtoAdapter from "./adapters/DemarchesSimplifieesDtoAdapter";
import DemarchesSimplifieesSchema, { DemarchesSimplifieesSchemaLine } from "./entities/DemarchesSimplifieesSchema";
import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import DemarchesSimplifieesDataEntity from "./entities/DemarchesSimplifieesDataEntity";
import {
    DemarchesSimplifieesSchemaSeed,
    DemarchesSimplifieesSchemaSeedLine,
} from "./entities/DemarchesSimplifieesSchemaSeed";
import { input } from "@inquirer/prompts";
import configurationsService from "../../configurations/configurations.service";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ReadableStream } from "stream/web";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";

export class DemarchesSimplifieesService extends ProviderCore implements ApplicationFlatProvider {
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

    async saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>): Promise<void> {
        await applicationFlatService.saveFromStream(stream);
    }

    async initApplicationFlat() {
        const cursor = demarchesSimplifieesDataPort.findAllCursor();
        const schemasByIds = await this.getSchemasByIds();
        const stream: ReadableStream<ApplicationFlatEntity> = cursorToStream(
            cursor,
            (dbo: DemarchesSimplifieesDataEntity) => this.toFlatAndValidate(dbo, schemasByIds[dbo.demarcheId]),
        );
        return this.saveApplicationsFromStream(stream);
    }

    toFlatAndValidate(
        dbo: DemarchesSimplifieesDataEntity,
        schema: DemarchesSimplifieesSchema,
    ): ApplicationFlatEntity | null {
        if (!schema?.flatSchema || this.isDraft(dbo)) return null;
        const res = DemarchesSimplifieesEntityAdapter.toFlat(dbo, schema);
        if (!res) return res;
        const mandatoryFields = ["requestedAmount", "budgetaryYear"];
        // those are the only mandatory field that comes from 'champs' or 'annotations'
        // which is why it is the only one that we check here
        for (const f of mandatoryFields) {
            if (!res[f]) return null;
        }
        return res;
    }

    bulkUpdateApplicationFlat(entities: DemarchesSimplifieesDataEntity[], schema: DemarchesSimplifieesSchema | null) {
        if (!schema) return;
        const stream = ReadableStream.from(entities.map(e => this.toFlatAndValidate(e, schema)).filter(e => !!e));
        return this.saveApplicationsFromStream(stream);
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

    async buildSchema(schemaModel: DemarchesSimplifieesSchemaSeedLine[], exampleData: DemarchesSimplifieesDataEntity) {
        const builtSchema: DemarchesSimplifieesSchemaLine[] = [];

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
        // We need to have the technical field ids to create the schema and we get them through an example
        const queryResult = await this.sendQuery(GetDossiersByDemarcheId, { demarcheNumber: demarcheId });
        const exampleData = DemarchesSimplifieesDtoAdapter.toEntities(queryResult, demarcheId)?.[0];

        const res = { demarcheId };

        for (const schemaType of Object.keys(schemaSeed)) {
            console.log(`Génération du schéma pour le type '${types[schemaType]}'`);
            res[schemaType] = await this.buildSchema(schemaSeed[schemaType], exampleData);
            console.log("\n");
        }
        return res as DemarchesSimplifieesSchema & { demarcheId: number };
    }
}

const demarchesSimplifieesService = new DemarchesSimplifieesService();

export default demarchesSimplifieesService;
