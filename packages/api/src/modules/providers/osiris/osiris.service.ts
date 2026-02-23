import { AggregationCursor, BulkWriteResult } from "mongodb";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { isAssociationName, isCompteAssoId, isOsirisActionId, isOsirisRequestId } from "../../../shared/Validators";
import ProviderCore from "../ProviderCore";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import Siret from "../../../identifierObjects/Siret";
import Siren from "../../../identifierObjects/Siren";
import Rna from "../../../identifierObjects/Rna";
import { osirisRequestPort, osirisActionPort } from "../../../dataProviders/db/providers/osiris";
import OsirisRequestMapper from "./mappers/osiris-request.mapper";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ReadableStream } from "stream/web";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import osirisJoiner, { OsirisRequestWithActions } from "../../../dataProviders/db/providers/osiris/osiris.joiner";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";

export enum VALID_REQUEST_ERROR_CODE {
    INVALID_SIRET = 1,
    INVALID_RNA = 2,
    INVALID_NAME = 3,
    INVALID_CAID = 4,
    INVALID_OSIRISID = 5,
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

    public async bulkAddRequest(requests: OsirisRequestEntity[]): Promise<void | BulkWriteResult> {
        const rnaSirens: { rna: Rna; siren: Siren }[] = [];
        for (const request of requests) {
            const { rna, siret } = request.legalInformations;
            if (rna) rnaSirens.push({ rna: new Rna(rna), siren: new Siret(siret).toSiren() });
        }
        const [metadataRequests] = await Promise.all([
            osirisRequestPort.bulkUpsert(requests),
            rnaSirenService.insertMany(rnaSirens),
        ]);

        return metadataRequests;
    }

    public validRequest(request: OsirisRequestEntity, rnaNeeded = true) {
        if (!Siret.isSiret(request.legalInformations.siret)) {
            return {
                message: `INVALID SIRET FOR ${request.legalInformations.siret}`,
                data: request.legalInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET,
            };
        }

        if (rnaNeeded && !Rna.isRna(request.legalInformations.rna)) {
            return {
                message: `INVALID RNA FOR ${request.legalInformations.rna}`,
                data: request.legalInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_RNA,
            };
        }

        if (!isAssociationName(request.legalInformations.name)) {
            return {
                message: `INVALID NAME FOR ${request.legalInformations.name}`,
                data: request.legalInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_NAME,
            };
        }

        if (!isCompteAssoId(request.providerInformations.compteAssoId)) {
            return {
                message: `INVALID COMPTE ASSO ID FOR ${request.legalInformations.name}`,
                data: request.providerInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_CAID,
            };
        }

        if (!isOsirisRequestId(request.providerInformations.osirisId)) {
            return {
                message: `INVALID OSIRIS ID FOR ${request.legalInformations.name}`,
                data: request.providerInformations,
                code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID,
            };
        }

        return true;
    }

    public async validateAndComplete(osirisRequest: OsirisRequestEntity) {
        let validation = this.validRequest(osirisRequest);

        if (validation !== true && validation.code === VALID_REQUEST_ERROR_CODE.INVALID_RNA) {
            const rnaSirenEntities = await rnaSirenService.find(
                new Siret(osirisRequest.legalInformations.siret).toSiren(),
            );

            if (!rnaSirenEntities || !rnaSirenEntities.length) {
                validation = osirisService.validRequest(osirisRequest, false); // we still want the request if there is no rna
            } else {
                osirisRequest.legalInformations.rna = rnaSirenEntities[0].rna.value;
                validation = osirisService.validRequest(osirisRequest); // Re-validate with the new rna
            }
        }

        if (validation !== true) throw new InvalidOsirisRequestError(validation);
    }

    public bulkAddActions(actions: OsirisActionEntity[]): Promise<void | BulkWriteResult> {
        return osirisActionPort.bulkUpsert(actions);
    }

    public validAction(action: OsirisActionEntity) {
        if (!isCompteAssoId(action.indexedInformations.compteAssoId)) {
            return {
                message: `INVALID COMPTE ASSO ID FOR ${action.indexedInformations.compteAssoId}`,
                data: action.indexedInformations,
            };
        }

        if (!isOsirisActionId(action.indexedInformations.osirisActionId)) {
            return {
                message: `INVALID OSIRIS ACTION ID FOR ${action.indexedInformations.osirisActionId}`,
                data: action.indexedInformations,
            };
        }

        return true;
    }

    public async findBySiret(siret: Siret) {
        const requests = await osirisRequestPort.findBySiret(siret);

        for (const request of requests) {
            request.actions = await osirisActionPort.findByRequestUniqueId(request.providerInformations.uniqueId);
        }
        return requests;
    }

    public async findBySiren(siren: Siren) {
        const requests = await osirisRequestPort.findBySiren(siren);

        const actions = await osirisActionPort.findBySiren(siren);

        for (const request of requests) {
            request.actions = actions.filter(
                a => a.indexedInformations.requestUniqueId === request.providerInformations.uniqueId,
            );
        }
        return requests;
    }

    public async findByRna(rna: Rna) {
        const requests = await osirisRequestPort.findByRna(rna);

        for (const request of requests) {
            request.actions = await osirisActionPort.findByRequestUniqueId(request.providerInformations.uniqueId);
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
            return OsirisRequestMapper.toApplicationFlat(request, actions);
        });
        return stream;
    }

    saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>) {
        return applicationFlatService.saveFromStream(stream);
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;
