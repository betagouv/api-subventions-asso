import { AggregationCursor } from "mongodb";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { isAssociationName, isCompteAssoId, isOsirisRequestId } from "../../../shared/Validators";
import ProviderCore from "../provider.core";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import Siret from "../../../identifier-objects/Siret";
import Siren from "../../../identifier-objects/Siren";
import Rna from "../../../identifier-objects/Rna";
import { osirisRequestAdapter, osirisActionAdapter } from "../../../adapters/outputs/db/providers/osiris";
import OsirisMapper from "./osiris.mapper";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import ApplicationFlatProvider from "../../application-flat/@types/applicationFlatProvider";
import { ReadableStream } from "stream/web";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import applicationFlatService from "../../application-flat/application-flat.service";
import osirisJoiner, { OsirisRequestWithActions } from "../../../adapters/outputs/db/providers/osiris/osiris.joiner";
import { cursorToStream } from "../../application-flat/application-flat.helper";
import { BulkUpsertResult } from "../../../adapters/outputs/db/@types/bulk-upsert-result";

export enum VALID_REQUEST_ERROR_CODE {
    INVALID_SIRET = 1,
    INVALID_OSIRISID = 2,
    INVALID_RNA = 3,
}

type OsirisRequestValidation = {
    message: string;
    data: unknown;
    code: VALID_REQUEST_ERROR_CODE;
};

export class InvalidOsirisRequestError extends Error {
    constructor(public validation: OsirisRequestValidation) {
        super();
    }
}

export class OsirisService extends ProviderCore implements ApplicationFlatProvider {
    constructor() {
        super({
            name: "OSIRIS",
            type: ProviderEnum.raw,
            description:
                "Osiris est le système d'information permettant la gestion des subventions déposées via le Compte Asso par les services instructeurs (instruction, décision, édition des documents, demandes de mise en paiement).",
            id: "osiris",
        });
    }

    public async bulkAddRequest(requests: OsirisRequestEntity[]): Promise<BulkUpsertResult> {
        const rnaSirens: { rna: Rna; siren: Siren }[] = [];

        for (const request of requests) {
            const rna = request.association?.rna;
            const siret = request.association?.siret;
            if (rna && siret) rnaSirens.push({ rna: new Rna(rna), siren: new Siret(siret).toSiren() });
        }

        const [metadataRequests] = await Promise.all([
            osirisRequestAdapter.bulkUpsert(requests),
            rnaSirenService.insertMany(rnaSirens),
        ]);

        return metadataRequests;
    }

    /**
     * Check if SIRET, OSIRIS ID, RNA are valid and return an error if not
     * If name is not valid, set it to undefined
     * If compteAssoId is not valid, set it to undefined
     * If rnaNeeded is false, the request is validated even if the rna is not valid
     */
    public validRequest(request: OsirisRequestEntity, rnaNeeded = true) {
        const association = request.association || {};
        const siret = association.siret as string;
        const rna = association.rna as string;
        const name = association.nom as string;
        const compteAssoId = request.dossier?.compteAssoId as string;
        const osirisId = request.dossier?.osirisId as string;

        if (!Siret.isSiret(siret)) {
            return {
                message: `INVALID SIRET : ${siret}`,
                data: { siret, rna, name },
                code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET,
            };
        }

        if (!isOsirisRequestId(osirisId)) {
            return {
                message: `INVALID OSIRIS ID : ${osirisId}`,
                data: { compteAssoId, osirisId },
                code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID,
            };
        }

        if (rnaNeeded && !Rna.isRna(rna)) {
            return {
                message: `INVALID RNA : ${rna}`,
                data: { siret, rna, name },
                code: VALID_REQUEST_ERROR_CODE.INVALID_RNA,
            };
        }

        if (!isAssociationName(name)) {
            request.association = request.association || {};
            request.association.nom = undefined;
        }

        if (compteAssoId && !isCompteAssoId(compteAssoId)) {
            request.dossier.compteAssoId = undefined;
        }

        return true;
    }

    /**
     * Validate the request and complete the association data if needed
     * If rnaNeeded is false, the request is validated even if the rna is not valid
     */
    public async validateAndComplete(osirisRequest: OsirisRequestEntity, rnaNeeded = true) {
        const siret = osirisRequest.association?.siret as string;
        const rna = osirisRequest.association?.rna as string;

        if (!Rna.isRna(rna) && Siret.isSiret(siret)) {
            try {
                const rnaSirenEntities = await rnaSirenService.find(new Siret(siret).toSiren());
                if (rnaSirenEntities?.length) {
                    osirisRequest.association = osirisRequest.association || {};
                    osirisRequest.association.rna = rnaSirenEntities[0].rna.value;
                }
            } catch (e) {
                console.warn(`RNA lookup failed for siret ${siret}: ${e instanceof Error ? e.message : String(e)}`);
            }
        }

        const validation = this.validRequest(osirisRequest, rnaNeeded);
        if (validation !== true) throw new InvalidOsirisRequestError(validation);
    }

    public bulkAddActions(actions: OsirisActionEntity[]): Promise<void | BulkUpsertResult> {
        return osirisActionAdapter.bulkUpsert(actions);
    }

    public async findBySiret(siret: Siret) {
        const requests = await osirisRequestAdapter.findBySiret(siret);

        for (const request of requests) {
            const uniqueId = `${request.dossier.osirisId}-${request.dossier.exerciceBudgetaire}`;
            request.actions = await osirisActionAdapter.findByRequestUniqueId(uniqueId);
        }

        return requests;
    }

    public async findBySiren(siren: Siren) {
        const requests = await osirisRequestAdapter.findBySiren(siren);
        const actions = await osirisActionAdapter.findBySiren(siren);

        for (const request of requests) {
            const uniqueId = `${request.dossier.osirisId}-${request.dossier.exerciceBudgetaire}`;
            request.actions = actions.filter(a => a.dossier.requestUniqueId === uniqueId);
        }

        return requests;
    }

    public async findByRna(rna: Rna) {
        const requests = await osirisRequestAdapter.findByRna(rna);

        for (const request of requests) {
            const uniqueId = `${request.dossier.osirisId}-${request.dossier.exerciceBudgetaire}`;
            request.actions = await osirisActionAdapter.findByRequestUniqueId(uniqueId);
        }

        return requests;
    }

    /**
     * |--------------------------------|
     * |   Application Flat Part        |
     * |--------------------------------|
     */

    initApplicationFlat() {
        const cursor = osirisJoiner.findAllCursor();
        return this.saveApplicationsFromStream(this.createStream(cursor));
    }

    syncApplicationFlat(exercise: number) {
        const cursor = osirisJoiner.findByExerciseCursor(exercise);
        return this.saveApplicationsFromStream(this.createStream(cursor));
    }

    private createStream(cursor: AggregationCursor<OsirisRequestWithActions>) {
        const stream: ReadableStream<ApplicationFlatEntity> = cursorToStream(cursor, requestWithActions => {
            const { actions, ...request } = requestWithActions;
            return OsirisMapper.toApplicationFlat(request, actions);
        });

        return stream;
    }

    saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>) {
        return applicationFlatService.saveFromStream(stream);
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;
