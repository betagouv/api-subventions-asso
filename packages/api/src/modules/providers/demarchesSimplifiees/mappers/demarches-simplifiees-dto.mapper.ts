import { DemarchesSimplifieesSuccessDto } from "../dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";

export default class DemarchesSimplifieesDtoMapper {
    static toEntities(dto: DemarchesSimplifieesSuccessDto, formId: number): DemarchesSimplifieesDataEntity[] {
        return dto.data.demarche.dossiers.nodes
            .map(dossier => {
                if (!dossier?.demandeur?.siret) return null;
                return {
                    demarcheId: formId,
                    siret: dossier.demandeur.siret,
                    demande: {
                        ...dossier,
                        champs: dossier.champs.reduce((acc, champ) => {
                            acc[champ.id] = {
                                value: champ.stringValue,
                                label: champ.label,
                            };
                            return acc;
                        }, {}),
                        annotations: dossier.annotations.reduce((acc, annotation) => {
                            acc[annotation.id] = {
                                value: annotation.stringValue,
                                label: annotation.label,
                            };
                            return acc;
                        }, {}),
                    },
                    service: dto.data.demarche.service,
                };
            })
            .filter(entity => entity) as DemarchesSimplifieesDataEntity[];
    }
}
