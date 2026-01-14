import { ApplicationStatus, type ApplicationFlatDto } from "dto";
import type { TableCell } from "$lib/dsfr/TableCell.types";
import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import { mapSiretPostCodeStore } from "$lib/store/association.store";
import type { DashboardApplication } from "$lib/components/GrantDashboard/@types/DashboardGrant";
import { NOT_APPLICABLE_VALUE } from "$lib/constants/values";

export const isSCDL = (application: ApplicationFlatDto) => {
    return !!application.fournisseur.match(new RegExp(/^scdl/));
};

export const getApplicationCells = (application: ApplicationFlatDto | null, accepted: boolean): TableCell[] | null => {
    if (!application) return null;
    else {
        const grantedAmount = valueOrHyphen(numberToEuro(application.montantAccorde));

        const requestedCell = application.montantDemande
            ? {
                  title: valueOrHyphen(numberToEuro(application.montantDemande)),
                  desc: valueOrHyphen(
                      application.dateDepotDemande
                          ? `Demandé le ${withTwoDigitYear(new Date(application.dateDepotDemande))}`
                          : undefined,
                  ),
              }
            : { desc: "-" };

        const instructor = isSCDL(application)
            ? application.nomAttribuant
            : valueOrHyphen(application.nomServiceInstructeur);

        return [
            { desc: valueOrHyphen(mapSiretPostCodeStore.value.get(application.idEtablissementBeneficiaire as string)) },
            { desc: instructor },
            { desc: valueOrHyphen(application.dispositif) },
            { desc: valueOrHyphen(application.objet) },
            requestedCell,
            application.statutLabel != undefined
                ? {
                      badge: accepted
                          ? { type: "success", label: grantedAmount || application.statutLabel }
                          : { status: application.statutLabel },
                  }
                : { desc: "-" },
        ];
    }
};

export function getApplicationDashboardData(application: ApplicationFlatDto | null): DashboardApplication | null {
    if (!application) return application;
    if (!application.exerciceBudgetaire) return null;
    const depositDate = application.dateDepotDemande
        ? application.dateDepotDemande === NOT_APPLICABLE_VALUE
            ? undefined
            : new Date(application.dateDepotDemande)
        : undefined;
    return {
        montantAccorde: application.montantAccorde,
        montantDemande: application.montantDemande,
        date_demande: depositDate,
        postal_code: mapSiretPostCodeStore.value.get(application.typeIdEtablissementBeneficiaire),
        service_instructeur: application.nomServiceInstructeur ?? "",
        dispositif: application.dispositif ?? undefined,
        nomProjet: application.objet ?? "",
        statut_label: application.statutLabel,
    };
}

// TODO: move in core package
export const isGranted = (application: ApplicationFlatDto | null) => {
    return application?.statutLabel === ApplicationStatus.GRANTED;
};
