import { WithId } from "mongodb";
import OsirisActionEntity from "../../../../../modules/providers/osiris/entities/OsirisActionEntity";

export default class OsirisActionMapper {
    public static toEntity(dbo: WithId<OsirisActionEntity>): OsirisActionEntity {
        return {
            dossier: dbo.dossier,
            beneficiaire: dbo.beneficiaire,
            federation: dbo.federation,
            moyens: dbo.moyens,
            territoires: dbo.territoires,
            caracteristiques: dbo.caracteristiques,
            evaluation: dbo.evaluation,
            cofinanceurs: dbo.cofinanceurs,
            montants: dbo.montants,
            updateDate: dbo.updateDate,
        };
    }
}
