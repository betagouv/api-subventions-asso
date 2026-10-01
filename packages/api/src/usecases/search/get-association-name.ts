import UseCase from "../../@types/use-case/UseCase";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";
import { NotificationType } from "../../modules/notify/@types/NotificationType";
import notifyService, { NotifyService } from "../../modules/notify/notify.service";

export class GetAssociationName implements UseCase<AssociationSearchEntity, string> {
    constructor(private notifier: NotifyService) {}
    execute(entity: AssociationSearchEntity) {
        const name = entity.name;
        if (name.rna) return name.rna;
        else if (name.sirene) return name.sirene;
        else {
            this.notifier.notify(NotificationType.USECASE_ERROR, {
                message: "AssociationSearchEntity should not have both name.rna and name.siren undefined",
                object: name,
            });
            return "";
        }
    }
}

const getAssociationName = new GetAssociationName(notifyService);
export default getAssociationName;
