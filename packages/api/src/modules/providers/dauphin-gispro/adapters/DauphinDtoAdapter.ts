import { CommonApplicationDto, ApplicationStatus, DemandeSubvention, ProviderValue, DocumentDto } from "dto";
import DauphinSubventionDto from "../dto/DauphinSubventionDto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import dauphinService from "../dauphin.service";
import { capitalizeFirstLetter } from "../../../../shared/helpers/StringHelper";
import { toStatusFactory } from "../../providers.adapter";
import DauphinGisproDbo from "../../../../dataProviders/db/providers/dauphin/DauphinGisproDbo";
import DauphinDocumentDto from "../dto/DauphinDocumentDto";
import { RawApplication } from "../../../grant/@types/rawGrant";

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

    private static getDispositif(dauphinData: DauphinSubventionDto) {
        const baseDispositif = "Politique de la ville";
        if (dauphinData.thematique?.title) return dauphinData.thematique?.title + " - " + baseDispositif;
        return baseDispositif;
    }

    private static getInstructorService(dauphinData: DauphinSubventionDto) {
        return "Dauphin";
        // Does not use serviceInstructeur because it does not take into account  multi-funding

        const serviceInstructeur = dauphinData.financeursPrivilegies?.[0].title || "";
        if (serviceInstructeur.match(/^\d{2}-ETAT-POLITIQUE-VILLE/)) {
            const part = serviceInstructeur.split("-");
            return `Politique de la ville (Dept ${part[0]})`;
        } else if (serviceInstructeur.match(/^POLITIQUE-VILLE-\d{2,3}/)) {
            const part = serviceInstructeur.split("-");
            return `Politique de la ville (Dept ${part[2]})`;
        } else {
            return capitalizeFirstLetter(serviceInstructeur.toLowerCase().replace(/-/g, " "));
        }
    }

    private static getStatus(rawStatus: string) {
        return toStatusFactory(DauphinDtoAdapter._statusConversionArray)(rawStatus);
    }

    static rawToApplication(rawApplication: RawApplication<DauphinGisproDbo>) {
        return this.toDemandeSubvention(rawApplication.data);
    }

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

        const montantDemande = DauphinDtoAdapter.getMontantDemande(dauphinData);
        const montantAccorde = DauphinDtoAdapter.getMontantAccorde(dauphinData);
        const dispositif = DauphinDtoAdapter.getDispositif(dauphinData);
        const serviceInstructeur = this.getInstructorService(dauphinData);

        return {
            siret: toPV(dauphinData.demandeur.SIRET.complet),
            service_instructeur: toPV(serviceInstructeur),
            dispositif: toPV(dispositif),
            ej: dbo.gispro?.ej ? toPV(dbo.gispro?.ej) : undefined,
            versementKey: dbo.gispro?.ej ? toPV(dbo.gispro?.ej) : undefined,
            statut_label: toPV(DauphinDtoAdapter.getStatus(dauphinData.virtualStatusLabel)),
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

    public static toDocuments(documentReferences: DauphinDocumentDto[]) {
        const resultArray: DocumentDto[] = [];
        let toPV: <T>(T) => ProviderValue<T>;
        for (const reference of documentReferences) {
            if (!reference.documents?.length) continue;
            for (const doc of reference.documents) {
                if (doc.error) continue;
                const date = new Date(doc.expand.properties["entity:document:date"].value);
                toPV = ProviderValueFactory.buildProviderValueAdapter(dauphinService.provider.name, new Date(date));
                resultArray.push({
                    type: toPV(reference.libelle.value),
                    url: toPV(
                        `/document/dauphin/?url=${encodeURIComponent(`https://agent-dauphin.cget.gouv.fr${doc.id}`)}`,
                    ),
                    nom: toPV(doc.title || reference.libelle.value),
                    __meta__: {},
                });
            }
        }
        return resultArray;
    }

    public static toCommon(dbo: DauphinGisproDbo): CommonApplicationDto {
        const dauphinData = dbo.dauphin;
        return {
            dispositif: DauphinDtoAdapter.getDispositif(dauphinData),
            exercice: dauphinData.exerciceBudgetaire,
            montant_accorde: DauphinDtoAdapter.getMontantAccorde(dauphinData) || null,
            montant_demande: DauphinDtoAdapter.getMontantDemande(dauphinData),
            objet: dauphinData.intituleProjet,
            service_instructeur: DauphinDtoAdapter.getInstructorService(dauphinData),
            siret: dauphinData.demandeur.SIRET.complet,
            statut: DauphinDtoAdapter.getStatus(dauphinData.virtualStatusLabel),
        };
    }
}
