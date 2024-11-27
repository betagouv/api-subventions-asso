import { ApplicationStatus } from "dto";
import type { FlatApplication } from "$lib/resources/@types/FlattenGrant";
import type { TableCell } from "$lib/dsfr/TableCell.types";
import { numberToEuro } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";
import { mapSiretPostCodeStore } from "$lib/store/association.store";

export const getApplicationCells = (application: FlatApplication, accepted): TableCell[] | null => {
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

export const isGranted = status => {
    return status === ApplicationStatus.GRANTED;
};

export const getProjectName = application => {
    if (!application) return undefined;
    if (!application.actions_proposee || !application.actions_proposee.length) return;

    let names = application.actions_proposee
        .sort((actionA, actionB) => actionA.rang - actionB.rang)
        .map(action => `${capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));

    names = [...new Set(names)].join(" - ");

    return names;
};
