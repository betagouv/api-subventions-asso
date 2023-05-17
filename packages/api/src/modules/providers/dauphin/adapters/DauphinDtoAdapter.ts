import { ApplicationStatus, DemandeSubvention } from "@api-subventions-asso/dto";
import DauphinSubventionDto from "../dto/DauphinSubventionDto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import dauphinService from "../dauphin.service";
import { capitalizeFirstLetter } from "../../../../shared/helpers/StringHelper";
import { toStatusFactory } from "../../helper";
import DauphinGisproDbo from "../repositories/dbo/DauphinGisproDbo";

export default class DauphinDtoAdapter {
    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["Rejetée"] },
        {
            label: ApplicationStatus.GRANTED,
            providerStatusList: [
                "A justifier",
                "Justifiée",
                "A été versé",
                "Justification à modifier",
                "Justification en cours",
            ],
        },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["Cloturée", "Non recevable"] },
        {
            label: ApplicationStatus.PENDING,
            providerStatusList: [
                "Prise en charge",
                "Recevable",
                "Transmise",
                "En attente d'attestation",
                "En attente d'instruction",
                "En cours de saisie",
                "En cours",
            ],
        },
    ];

    public static toDemandeSubvention(dbo: DauphinGisproDbo): DemandeSubvention {
        const dauphinData = dbo.dauphin;
        const lastUpdateDate =
            dauphinData._document?.dateVersion ||
            dauphinData.history.events[dauphinData.history.events.length - 1]?.date ||
            dauphinData.history.begin.date;
        const toPV = ProviderValueFactory.buildProviderValueAdapter(
            dauphinService.provider.name,
            new Date(lastUpdateDate),
        );
        const toStatus = toStatusFactory(DauphinDtoAdapter._statusConversionArray);
        const montantDemande = DauphinDtoAdapter.getMontantDemande(dauphinData);
        const montantAccorde = DauphinDtoAdapter.getMontantAccorde(dauphinData);
        let dispositif = "Politique de la ville";
        if (dauphinData.thematique?.title) dispositif = dauphinData.thematique?.title + " - " + dispositif;

        let serviceInstructeur = dauphinData.financeursPrivilegies?.[0].title || "";
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
            siret: toPV(dauphinData.demandeur.SIRET.complet),
            service_instructeur: toPV("Dauphin"), // Dont use serviceInstructeur because it does not take into account the multifunders
            dispositif: toPV(dispositif),
            ej: dbo.gispro?.ej ? toPV(dbo.gispro?.ej) : undefined,
            versementKey: dbo.gispro?.ej ? toPV(dbo.gispro?.ej) : undefined,
            statut_label: toPV(toStatus(dauphinData.virtualStatusLabel)),
            status: toPV(dauphinData.virtualStatusLabel),
            annee_demande: toPV(dauphinData.exerciceBudgetaire),
            montants: {
                demande: montantDemande ? toPV(montantDemande) : undefined,
                accorde: montantAccorde ? toPV(montantAccorde) : undefined,
            },
            actions_proposee: [
                {
                    intitule: toPV(dauphinData.intituleProjet),
                    objectifs: toPV(dauphinData.description?.value || dauphinData.virtualStatusLabel),
                },
            ],
        };
    }

    private static getMontantDemande(demande: DauphinSubventionDto) {
        return demande.planFinancement
            .find(pf => pf.current)
            ?.recette?.postes?.map(p =>
                p?.sousPostes?.map(s => s?.lignes?.map(l => (l.dispositifEligible ? l.montant.ht : undefined))),
            )
            .flat(2)
            .filter(a => a)[0];
    }

    private static getMontantAccorde(demande: DauphinSubventionDto) {
        return demande.planFinancement
            .find(pf => pf.current)
            ?.recette?.postes?.map(p => p?.sousPostes?.map(s => s?.lignes?.map(l => l.financement?.montantVote?.ht)))
            .flat(2)
            .filter(a => a)[0];
    }
}
