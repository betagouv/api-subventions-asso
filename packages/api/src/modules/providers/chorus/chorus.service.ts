import { ASSO_BRANCHE } from "../../../shared/ChorusBrancheAccepted";
import CacheData from "../../../shared/Cache";
import { asyncFilter } from "../../../shared/helpers/ArrayHelper";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../ProviderCore";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import uniteLegalEntreprisesService from "../uniteLegalEntreprises/uniteLegal.entreprises.service";
import Siren from "../../../identifierObjects/Siren";
import Siret from "../../../identifierObjects/Siret";
import chorusLinePort from "../../../dataProviders/db/providers/chorus/chorus.line.port";
import ChorusLineEntity from "./entities/ChorusLineEntity";

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

    public async isAcceptedEntity(entity: ChorusLineEntity) {
        if (entity.indexedInformations.codeBranche === ASSO_BRANCHE) return true;

        // quick fix to handle payments to assocations without siret but ridet or tahiti
        // there is cases where both siret and ridet/tahiti columns values are #
        // for now we insert all because we don't know the rules behind it
        // and we don't want to lose any information
        if (entity.indexedInformations.siret === "#") {
            return true;
        } else {
            const siren = new Siret(entity.indexedInformations.siret).toSiren();

            if (this.sirenBelongAssoCache.has(siren.value)) return this.sirenBelongAssoCache.get(siren.value)[0];

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

    public async sirenBelongAsso(siren: Siren): Promise<boolean> {
        const chorusLine = await chorusLinePort.findOneBySiren(siren);
        if (chorusLine) return true;

        if (await uniteLegalEntreprisesService.isEntreprise(siren)) return false;
        return !!(await rnaSirenService.find(siren));
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
