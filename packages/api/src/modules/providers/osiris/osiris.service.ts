import { AggregationCursor } from "mongodb";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { isOsirisRequestId } from "../../../shared/Validators";
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
import { VALID_REQUEST_ERROR_CODE, InvalidOsirisRequestError } from "./osiris.errors";

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

            if (Rna.isRna(rna) && Siret.isSiret(siret)) {
                rnaSirens.push({
                    rna: new Rna(rna as string),
                    siren: new Siret(siret as string).toSiren(),
                });
            }
        }

        const [metadataRequests] = await Promise.all([
            osirisRequestAdapter.bulkUpsert(requests),
            rnaSirenService.insertMany(rnaSirens),
        ]);

        return metadataRequests;
    }

    public async validateRequest(osirisRequest: OsirisRequestEntity) {
        if (!Siret.isSiret(osirisRequest.association.siret.toString())) {
            throw new InvalidOsirisRequestError({
                message: `INVALID SIRET : ${osirisRequest.association.siret.toString()}`,
                data: osirisRequest.association,
                code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET,
            });
        }

        if (!isOsirisRequestId(osirisRequest.dossier.osirisId)) {
            throw new InvalidOsirisRequestError({
                message: `INVALID OSIRIS ID : ${osirisRequest.dossier.osirisId}`,
                data: osirisRequest.dossier,
                code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID,
            });
        }

        return true;
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
