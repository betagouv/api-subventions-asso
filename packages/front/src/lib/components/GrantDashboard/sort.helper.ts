import { ApplicationStatus } from "dto";
import type { DashboardGrant } from "$lib/components/GrantDashboard/@types/DashboardGrant";

type CompareIngredient<T> = {
    compareFn: (a: T, b: T, orderInt: number) => number;
    compareGetter: (g: DashboardGrant) => T;
};

/*
 * Ensures that in any order, empty values are in the end
 * To do that, we need to know if we are asc or desc order
 *  */
export const nullIsLowCmpBuilder =
    <T>(cmpFn: (a: T, b: T) => number) =>
    (a: T | undefined, b: T | undefined, orderInt: number) => {
        if (a === undefined) {
            if (b === undefined) return 0;
            return 1;
        }
        if (b === undefined) return -1;
        return orderInt * cmpFn(a, b);
    };

const strCompare = nullIsLowCmpBuilder((a: string, b: string) => a?.localeCompare(b));
const positiveNumberCompare = nullIsLowCmpBuilder((a: number, b: number) => (a ?? 0) - (b ?? 0));

type StatusAmount = { status: ApplicationStatus; montantAccorde: number | undefined };

/*
 * any amount > granted with no amount > other statuses
 * */
const statusAmountCmp = nullIsLowCmpBuilder((a: StatusAmount, b: StatusAmount) => {
    if (a.montantAccorde === undefined) {
        if (b.montantAccorde === undefined) return 0;
        return 1;
    }
    if (b.montantAccorde === undefined) return -1;

    if (a.status !== ApplicationStatus.GRANTED) {
        if (b.status !== ApplicationStatus.GRANTED) return a.status.localeCompare(b.status);
        return 1;
    }
    if (a.status !== ApplicationStatus.GRANTED) return -1;

    return a.montantAccorde - b.montantAccorde;
});

const compareIngredients: CompareIngredient<any>[] = [
    { compareFn: strCompare, compareGetter: g => g.application?.postal_code }, // "Code postal"
    { compareFn: strCompare, compareGetter: g => g.application?.service_instructeur }, // "Instructeur"
    { compareFn: strCompare, compareGetter: g => g.application?.dispositif }, // "Dispositif",
    { compareFn: strCompare, compareGetter: g => g.application?.nomProjet }, // "Action",
    { compareFn: positiveNumberCompare, compareGetter: g => g.application?.montantDemande }, // "Demandé",
    {
        compareFn: statusAmountCmp,
        compareGetter: g =>
            g.application
                ? {
                      status: g.application?.statut_label,
                      montantAccorde: g.application?.montantAccorde,
                  }
                : undefined,
    }, // "Statut",
    { compareFn: positiveNumberCompare, compareGetter: g => g.payment?.total }, // "Versé",
    { compareFn: positiveNumberCompare, compareGetter: g => g.payment?.programme?.code }, // "Programme",
];

// gets proper compare fonction and proper getter for proper attribute according to column index required
function grantCompareBuilder(
    cmpFunction: <T>(a: T, b: T, orderInt: number) => number,
    compareGetter: <T>(g: DashboardGrant) => T,
): (a: DashboardGrant, b: DashboardGrant, orderInt: number) => number {
    return (a, b, orderInt) => cmpFunction(compareGetter(a), compareGetter(b), orderInt);
}

// builds array of compare fonctions based on compare ingredients
export const grantCompareFn = compareIngredients.map(({ compareFn, compareGetter }) =>
    grantCompareBuilder(compareFn, compareGetter),
);
