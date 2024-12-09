import { ApplicationStatus } from "dto";
import type { FlatApplication } from "$lib/resources/@types/FlattenGrant";
import type { TableCell } from "$lib/dsfr/TableCell.types";
import { numberToEuro } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";
import { mapSiretPostCodeStore } from "$lib/store/association.store";

export const getApplicationCells = (application: FlatApplication | null, accepted: boolean): TableCell[] | null => {
    if (!application) return null;
    else {
        const grantedAmount = numberToEuro(application.montants?.accorde);

        const requestedCell = application.montants?.demande
            ? {
                  title: numberToEuro(application.montants?.demande),
                  desc: application.creer_le
                      ? `Demandé le ${withTwoDigitYear(new Date(application.creer_le))}`
                      : undefined,
              }
            : { desc: null };

        return [
            { desc: mapSiretPostCodeStore.value.get(application.siret?.toString() as string) },
            { desc: application.service_instructeur },
            { desc: application.dispositif },
            { desc: getProjectName(application) },
            requestedCell,
            {
                badge: accepted ? { type: "success", label: grantedAmount } : { status: application.statut_label },
            },
        ];
    }
};

export function getApplicationDashboardData(application: FlatApplication | null) {
    if (!application) return application;
    return {
        montantAccorde: application.montants?.accorde,
        montantDemande: application.montants?.demande,
        date_demande: application.creer_le ? new Date(application.creer_le) : undefined,
        postal_code: mapSiretPostCodeStore.value.get(application.siret?.toString() as string),
        service_instructeur: application.service_instructeur,
        dispositif: application.dispositif,
        nomProjet: getProjectName(application),
        statut_label: application.statut_label,
    };
}

export const isGranted = (application: FlatApplication | null) => {
    return application?.statut_label === ApplicationStatus.GRANTED;
};

export const getProjectName = application => {
    if (!application) return undefined;
    if (!application.actions_proposee || !application.actions_proposee.length) return;

    let names = application.actions_proposee
        .sort((actionA, actionB) => actionA.rang - actionB.rang)
        .map(action => `${capitalizeFirstLetter(action.intitule)}.`.replace(/\.\./g, "."));

    names = [...new Set(names)].join(" - ");

    return names;
};
