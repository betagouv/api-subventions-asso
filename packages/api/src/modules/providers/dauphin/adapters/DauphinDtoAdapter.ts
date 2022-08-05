import DauphinSubventionDto from "../dto/DauphinSubventionDto"
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { DemandeSubvention } from "@api-subventions-asso/dto";

export default class DauphinDtoAdapter {
    public static toDemandeSubvention(dto: DauphinSubventionDto): DemandeSubvention {
        const lastUpdateDate = dto._document?.dateVersion || dto.history.events[dto.history.events.length -1]?.date || dto.history.begin.date;
        const toPV = ProviderValueFactory.buildProviderValueAdapter("Dauphin", new Date(lastUpdateDate));
        const montantDemande = DauphinDtoAdapter.getMontantDemande(dto);
        const montantAccorde = DauphinDtoAdapter.getMontantAccorder(dto);

        return {
            siret: toPV(dto.demandeur.SIRET.complet),
            service_instructeur: toPV(dto.financeursPrivilegies?.[0].title || ""),
            dispositif: toPV(dto.dispositif?.title || ''),
            status: toPV(dto.status),
            annee_demande: toPV(dto.exerciceBudgetaire),
            montants: {
                demande: montantDemande ? toPV(montantDemande) : undefined,
                accorde: montantAccorde ? toPV(montantAccorde) : undefined,
            },
            actions_proposee: [
                {
                    intitule: toPV(dto.intituleProjet),
                    objectifs: toPV(dto.description?.value || dto.virtualStatusLabel),
                }
            ]
        }
    }

    private static getMontantDemande(demande: DauphinSubventionDto) {
        return demande.planFinancement.find(pf => pf.current)?.recette.postes?.map(p => p?.sousPostes?.map(s => s?.lignes?.map(l => l.dispositifEligible ? l.montant.ht : undefined))).flat(2).filter(a => a)[0]
    }
    private static getMontantAccorder(demande: DauphinSubventionDto) {
        return demande.planFinancement.map(pf => pf.recette.postes?.map(p => p?.sousPostes?.map(s => s?.lignes?.map(l => l.financement?.montantVote?.ht)))).flat(3).filter(a => a)[0];
    }
}