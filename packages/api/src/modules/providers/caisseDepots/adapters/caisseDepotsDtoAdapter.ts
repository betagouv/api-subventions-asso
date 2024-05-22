import { ApplicationStatus, DemandeSubvention, FullGrantDto } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import caisseDepotsService from "../caisseDepots.service";
import { CaisseDepotsSubventionDto } from "../dto/CaisseDepotsDto";
import { sameDateNextYear } from "../../../../shared/helpers/DateHelper";

export default class CaisseDepotsDtoAdapter {
    private static _multiannuality(dto: CaisseDepotsSubventionDto): "Oui" | "Non" {
        if (dto.fields.conditionsversement === "UNIQUE") return "Non";
        if (!dto.fields.datesversement_fin || !dto.fields.datesversement_debut) return "Non";
        const start = new Date(dto.fields.datesversement_debut);
        const end = new Date(dto.fields.datesversement_fin);
        const startNextYear = sameDateNextYear(start);
        if (end > startNextYear) return "Oui";
        return "Non";
    }

    public static toDemandeSubvention(dto: CaisseDepotsSubventionDto): DemandeSubvention {
        const lastUpdateDate = new Date(dto.timestamp);
        const toPV = ProviderValueFactory.buildProviderValueAdapter(caisseDepotsService.provider.name, lastUpdateDate);
        const amount = toPV(dto.fields.montant);

        return {
            siret: toPV(dto.fields.idbeneficiaire),
            service_instructeur: toPV(dto.fields.nomattribuant),
            actions_proposee: [{ intitule: toPV(dto.fields.objet) }],
            statut_label: toPV(ApplicationStatus.GRANTED),
            status: toPV(ApplicationStatus.GRANTED), // not given by provider
            montants: {
                accorde: amount,
            },
            date_commision: toPV(new Date(dto.fields.dateconvention)), // doubt
            financeur_principal: toPV(dto.fields.nomattribuant),
            annee_demande: toPV(new Date(dto.fields.dateconvention).getFullYear()), // doubt
            pluriannualite: toPV(this._multiannuality(dto)),
            versementKey: toPV(dto.id),
        };
    }

    public static toCommon(dto: CaisseDepotsSubventionDto): FullGrantDto {
        return {
            exercice: new Date(dto.fields.dateconvention).getFullYear(),
            bop: "",
            date_debut: new Date(dto.fields.datesversement_debut),
            dispositif: "Caisse des dépôts", // business logic doubt here
            montant_accorde: dto.fields.montant,
            montant_verse: dto.fields.montant,
            objet: "Caisse des dépôts",
            service_instructeur: dto.fields.nomattribuant,
            siret: dto.fields.idbeneficiaire,
            statut: ApplicationStatus.GRANTED,
        };
    }
}
