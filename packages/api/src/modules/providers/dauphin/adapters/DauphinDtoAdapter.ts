import { ApplicationStatus, DemandeSubvention } from "@api-subventions-asso/dto";
import DauphinSubventionDto from "../dto/DauphinSubventionDto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import dauphinService from "../dauphin.service";
import { capitalizeFirstLetter } from "../../../../shared/helpers/StringHelper";
import { toStatusFactory } from "../../helper";

export default class DauphinDtoAdapter {
    private static _statusMap: { [K in ApplicationStatus]?: string[] } = {
        [ApplicationStatus.REFUSED]: ["Rejetée"],
        [ApplicationStatus.GRANTED]: [
            "A justifier",
            "Justifiée",
            "A été versé",
            "Justification à modifier",
            "Justification en cours"
        ],
        [ApplicationStatus.INELIGIBLE]: ["Cloturée", "Non recevable"],
        [ApplicationStatus.PENDING]: [
            "Prise en charge",
            "Recevable",
            "Transmise",
            "En attente d'attestation",
            "En attente d'instruction",
            "En cours de saisie",
            "En cours"
        ]
    };

    public static toDemandeSubvention(dto: DauphinSubventionDto): DemandeSubvention {
        const lastUpdateDate =
            dto._document?.dateVersion ||
            dto.history.events[dto.history.events.length - 1]?.date ||
            dto.history.begin.date;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(
            dauphinService.provider.name,
            new Date(lastUpdateDate)
        );
        const toStatus = toStatusFactory(DauphinDtoAdapter._statusMap);
        const montantDemande = DauphinDtoAdapter.getMontantDemande(dto);
        const montantAccorde = DauphinDtoAdapter.getMontantAccorde(dto);
        let dispositif = "Politique de la ville";
        if (dto.thematique?.title) dispositif = dto.thematique?.title + " - " + dispositif;

        let serviceInstructeur = dto.financeursPrivilegies?.[0].title || "";
        if (serviceInstructeur.match(/^\d{2}-ETAT-POLITIQUE-VILLE/)) {
            const part = serviceInstructeur.split("-");
            serviceInstructeur = `Politique de la ville (Dept ${part[0]})`;
        } else if (serviceInstructeur.match(/^POLITIQUE-VILLE-\d{2,3}/)) {
            const part = serviceInstructeur.split("-");
            serviceInstructeur = `Politique de la ville (Dept ${part[2]})`;
        } else {
            serviceInstructeur = capitalizeFirstLetter(serviceInstructeur.toLowerCase().replace(/-/g, " "));
        }

        return {
            siret: toPV(dto.demandeur.SIRET.complet),
            service_instructeur: toPV(serviceInstructeur),
            dispositif: toPV(dispositif),
            statut_label: toPV(toStatus(dto.virtualStatusLabel)),
            status: toPV(dto.virtualStatusLabel),
            annee_demande: toPV(dto.exerciceBudgetaire),
            montants: {
                demande: montantDemande ? toPV(montantDemande) : undefined,
                accorde: montantAccorde ? toPV(montantAccorde) : undefined
            },
            actions_proposee: [
                {
                    intitule: toPV(dto.intituleProjet),
                    objectifs: toPV(dto.description?.value || dto.virtualStatusLabel)
                }
            ]
        };
    }

    private static getMontantDemande(demande: DauphinSubventionDto) {
        return demande.planFinancement
            .find(pf => pf.current)
            ?.recette?.postes?.map(p =>
                p?.sousPostes?.map(s => s?.lignes?.map(l => (l.dispositifEligible ? l.montant.ht : undefined)))
            )
            .flat(2)
            .filter(a => a)[0];
    }

    private static getMontantAccorde(demande: DauphinSubventionDto) {
        return demande.planFinancement
            .map(pf =>
                pf.recette?.postes?.map(p =>
                    p?.sousPostes?.map(s => s?.lignes?.map(l => l.financement?.montantVote?.ht))
                )
            )
            .flat(3)
            .filter(a => a)[0];
    }
}
