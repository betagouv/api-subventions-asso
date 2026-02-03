import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../ProviderCore";
import Siren from "../../../identifierObjects/Siren";
import chorusLinePort from "../../../dataProviders/db/providers/chorus/chorus.line.port";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import associationHelper from "../../associations/associations.helper";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siret from "../../../identifierObjects/Siret";

export interface RejectedRequest {
    state: "rejected";
    result: { message: string; data: unknown };
}

export class ChorusService extends ProviderCore {
    constructor() {
        super({
            name: "Chorus",
            type: ProviderEnum.raw,
            description:
                "Chorus est un système d'information porté par l'AIFE pour les services de l'État qui permet de gérer les paiements des crédits État, que ce soit des commandes publiques ou des subventions et d'assurer la gestion financière du budget de l'État.",
            id: "chorus",
        });
    }

    private sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);

    public async upsertMany(entities: ChorusLineEntity[]) {
        return chorusLinePort.upsertMany(entities);
    }

    /*
     * it is weird that this filter, that essentially accepts according to structure being an asso or not.
     * The check about that should be associationHelper.isIdentifierFromAsso but we historically have this one
     * that use chorus specific data
     * */
    public async isAcceptedEntity(entity: ChorusLineEntity) {
        // quick fix to handle payments to assocations without siret but ridet or tahiti
        // there is cases where both siret and ridet/tahiti columns values are #
        // for now we insert all because we don't know the rules behind it
        // and we don't want to lose any information
        if (entity.indexedInformations.siret === "#") {
            return true;
        } else {
            const siren = new Siret(entity.indexedInformations.siret).toSiren();

            const sirenBelongAssoValue = this.sirenBelongAssoCache.get(siren.value);
            if (sirenBelongAssoValue !== null) return sirenBelongAssoValue;

            const sirenIsAsso = await this.sirenBelongAsso(siren);

            this.sirenBelongAssoCache.add(siren.value, sirenIsAsso);
            return sirenIsAsso;
        }
    }

    /**
     * @param entities /!\ entities must be validated upstream
     */
    public async insertBatchChorusLine(entities: ChorusLineEntity[]) {
        const acceptedEntities = await asyncFilter(entities, entity => this.isAcceptedEntity(entity));
        if (acceptedEntities.length) await this.upsertMany(acceptedEntities);

        return {
            rejected: entities.length - acceptedEntities.length,
            created: acceptedEntities.length,
        };
    }

    public sirenBelongAsso(siren: Siren): Promise<boolean> {
        return associationHelper.isIdentifierFromAsso(AssociationIdentifier.fromSiren(siren));
    }

    public cursorFind(exerciceBudgetaire?: number) {
        if (!exerciceBudgetaire) return chorusLinePort.cursorFind({});
        else return chorusLinePort.cursorFindOnExercise(exerciceBudgetaire);
    }

    // TODO: unit test this
    public getProgramCode(entity: ChorusLineEntity) {
        return parseInt(entity.indexedInformations.codeDomaineFonctionnel.slice(0, 4), 10); // for exemple codeDomaineFonctionnel = "0143-03-01", codeProgramme = 143
    }
}

const chorusService = new ChorusService();

export default chorusService;
