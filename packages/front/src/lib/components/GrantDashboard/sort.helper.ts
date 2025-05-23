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
        if (a == undefined) {
            if (b == undefined) return 0;
            return 1;
        }
        if (b == undefined) return -1;
        return orderInt * cmpFn(a, b);
    };

const strCompare = nullIsLowCmpBuilder((a: string, b: string) => a?.localeCompare(b));
const positiveNumberCompare = nullIsLowCmpBuilder((a: number, b: number) => (a ?? 0) - (b ?? 0));

type StatusAmount = { status: ApplicationStatus; montantAccorde: number | undefined };

/*
 * any amount > granted with no amount > other statuses
 * exported for test purposes
 * */
export const statusAmountCmp = nullIsLowCmpBuilder((a: StatusAmount, b: StatusAmount) => {
    if (a.status !== ApplicationStatus.GRANTED) {
        if (b.status !== ApplicationStatus.GRANTED) return a.status.localeCompare(b.status);
        return -1;
    }
    if (b.status !== ApplicationStatus.GRANTED) return 1;

    if (a.montantAccorde == undefined) {
        if (b.montantAccorde == undefined) return 0;
        return -1;
    }
    if (b.montantAccorde == undefined) return 1;

    return a.montantAccorde - b.montantAccorde;
});

// TODO: make a type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    {
        compareFn: positiveNumberCompare,
        compareGetter: g => {
            if (typeof g.payment?.programme == "string") return typeof g.payment?.programme;
            else return g.payment?.programme?.code;
        },
    }, // "Programme",
];

// gets proper compare fonction and proper getter for proper attribute according to column index required
// exported for test purposes
export function grantCompareBuilder<S>(
    cmpFunction: <T>(a: T, b: T, orderInt: number) => number,
    compareGetter: <T>(g: S) => T,
): (a: S, b: S, orderInt: number) => number {
    return (a, b, orderInt) => cmpFunction(compareGetter(a), compareGetter(b), orderInt);
}

// builds array of compare fonctions based on compare ingredients
export const grantCompareFn = compareIngredients.map(({ compareFn, compareGetter }) =>
    grantCompareBuilder(compareFn, compareGetter),
);
