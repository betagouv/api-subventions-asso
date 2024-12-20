import { ObjectId } from "mongodb";
import FonjepDispositifEntity from "../../../../modules/providers/fonjep/entities/FonjepDispositifEntity";
import FonjepPosteEntity from "../../../../modules/providers/fonjep/entities/FonjepPosteEntity";
import FonjepVersementEntity from "../../../../modules/providers/fonjep/entities/FonjepVersementEntity";
import FonjepTiersEntity from "../../../../modules/providers/fonjep/entities/FonjepTiersEntity";
import FonjepTypePosteEntity from "../../../../modules/providers/fonjep/entities/FonjepTypePosteEntity";
import FonjepDispositifDbo from "./dbo/fonjepDispositifDbo";
import FonjepPosteDbo from "./dbo/fonjepPosteDbo";
import FonjepVersementDbo from "./dbo/FonjepVersementDbo";
import FonjepTiersDbo from "./dbo/fonjepTiersDbo";
import FonjepTypePosteDbo from "./dbo/fonjepTypePosteDbo";

export default class FonjepDboAdapter {
    static toDispositifDbo(entity: FonjepDispositifEntity): FonjepDispositifDbo {
        return {
            _id: new ObjectId(),
            ID: entity.ID,
            Libelle: entity.Libelle,
            FinanceurCode: entity.FinanceurCode,
        };
    }

    static toPosteDbo(entity: FonjepPosteEntity): FonjepPosteDbo {
        return {
            _id: new ObjectId(),
            Code: entity.Code,
            DispositifId: entity.DispositifId,
            PstStatutPosteLibelle: entity.PstStatutPosteLibelle,
            PstRaisonStatutLibelle: entity.PstRaisonStatutLibelle,
            FinanceurPrincipalCode: entity.FinanceurPrincipalCode,
            FinanceurAttributeurCode: entity.FinanceurAttributeurCode,
            AssociationBeneficiaireCode: entity.AssociationBeneficiaireCode,
            AssociationImplantationCode: entity.AssociationImplantationCode,
            Annee: entity.Annee,
            MontantSubvention: entity.MontantSubvention,
            DateFinTriennalite: entity.DateFinTriennalite,
            PstTypePosteCode: entity.PstTypePosteCode,
            PleinTemps: entity.PleinTemps,
            DoublementUniteCompte: entity.DoublementUniteCompte,
        };
    }

    static toVersementDbo(entity: FonjepVersementEntity): FonjepVersementDbo {
        return {
            _id: new ObjectId(),
            PosteCode: entity.PosteCode,
            PeriodeDebut: entity.PeriodeDebut,
            PeriodeFin: entity.PeriodeFin,
            DateVersement: entity.DateVersement,
            MontantAPayer: entity.MontantAPayer,
            MontantPaye: entity.MontantPaye,
        };
    }

    static toTierDbo(entity: FonjepTiersEntity): FonjepTiersDbo {
        return {
            _id: new ObjectId(),
            Code: entity.Code,
            RaisonSociale: entity.RaisonSociale,
            EstAssociation: entity.EstAssociation,
            EstCoFinanceurPostes: entity.EstCoFinanceurPostes,
            EstFinanceurPostes: entity.EstFinanceurPostes,
            SiretOuRidet: entity.SiretOuRidet,
            CodePostal: entity.CodePostal,
            Ville: entity.Ville,
            ContactEmail: entity.ContactEmail,
        };
    }

    static toTypePosteDbo(entity: FonjepTypePosteEntity): FonjepTypePosteDbo {
        return {
            _id: new ObjectId(),
            Code: entity.Code,
            Libelle: entity.Libelle,
        };
    }
}
