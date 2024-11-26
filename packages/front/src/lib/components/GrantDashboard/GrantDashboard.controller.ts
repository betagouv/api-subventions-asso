import type { StructureIdentifierDto } from "dto";
import type { FlatGrant, FlatPayment, OnlyApplication } from "../../resources/@types/FlattenGrant";
import { isSiret } from "$lib/helpers/identifierHelper";
import associationPort from "$lib/resources/associations/association.port";
import establishmentPort from "$lib/resources/establishments/establishment.port";
import { returnInfinitePromise } from "$lib/helpers/promiseHelper";
import Store, { derived, ReadStore } from "$lib/core/Store";
import trackerService from "$lib/services/tracker.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import associationService from "$lib/resources/associations/association.service";
import documentHelper from "$lib/helpers/document.helper";
import { PUBLIC_PROVIDER_BLOG_URL } from "$env/static/public";
import { mapSiretPostCodeStore } from "$lib/store/association.store";
import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";
import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";

export class GrantDashboardController {
    public identifier: StructureIdentifierDto;
    public grantPromise: Promise<FlatGrant[]> = returnInfinitePromise();
    public grants: Store<FlatGrant[] | undefined> = new Store(undefined);
    public grantsByExercise: Record<string, FlatGrant[]> = {};
    public grantRowsByExercise: Record<string, string[][]> = {};
    public selectedExerciseIndex: Store<number | undefined> = new Store(undefined);

    // @ts-expect-error: done in initStores()
    public selectedExercise: ReadStore<string | null>;
    // @ts-expect-error: done in initStores()
    public selectedGrants: ReadStore<FlatGrant[] | null>;
    // represents selectedGrants but in a table row format
    // @ts-expect-error: done in initStores()
    public selectedGrantRows: ReadStore<string[][]>;
    // final rows displayed in view
    // can be updated with exercise filter and in a futur with other filters
    public rows: Store<string[][]> = new Store([]);
    public isExtractLoading: Store<boolean> = new Store(false);
    public exerciseOptions: Store<string[] | undefined> = new Store(undefined);
    public headers: string[];
    private columnsSortOrder: number[];

    constructor(identifier: StructureIdentifierDto) {
        this.identifier = identifier;

        this.headers = [
            "Code postal",
            "Instructeur",
            "Dispositif",
            "Action",
            "Demandé",
            "Statut",
            "Versé",
            "Programme",
        ];
        this.columnsSortOrder = Array(this.headers.length).fill(1);

        this.initStores();

        if (isSiret(identifier)) {
            this.grantPromise = establishmentPort.getGrants(identifier);
        } else {
            this.grantPromise = associationPort.getGrants(identifier);
        }

        this.grantPromise.then(grants => this.processGrants(grants));
    }

    private initStores() {
        this.selectedGrants = derived(this.selectedExerciseIndex, index => {
            if (!index) return null;
            const exercise = (this.exerciseOptions.value as string[])[index];
            return this.grantsByExercise[exercise];
        });
        this.selectedGrantRows = derived(this.selectedExerciseIndex, index => {
            if (!index) return [];
            const exercise = (this.exerciseOptions.value as string[])[index];
            return this.grantRowsByExercise[exercise];
        });
        this.selectedExercise = derived(this.selectedExerciseIndex, index => {
            if (!index || !this.exerciseOptions.value) return null;
            const exercise = this.exerciseOptions.value[index];
            this.rows.set(this.grantRowsByExercise[exercise]);
            return this.exerciseOptions.value[index];
        });
    }

    get providerBlogUrl() {
        return PUBLIC_PROVIDER_BLOG_URL;
    }

    get notFoundMessage() {
        const defaultContent = "Nous sommes désolés, nous n'avons trouvé aucune donnée pour cet établissement";
        if (this.exerciseOptions.value?.length) return `${defaultContent} sur l'année ${this.selectedExercise.value}`;
        else return defaultContent;
    }

    // TODO: make sort works for "Versé" => use custom sort method casting numbers
    public sortTable(index) {
        this.columnsSortOrder[index] = this.columnsSortOrder[index] * -1;
        this.rows.update(rows => {
            const sortedRows = rows.sort((a, b) => {
                const valueA = a[index],
                    valueB = b[index];

                // TODO: use ENUM
                const currencyColumnIndexes = [this.headers.indexOf("Demandé"), this.headers.indexOf("Versé")];
                if (currencyColumnIndexes.includes(index)) {
                    // TODO: specific treatment for non usual column values
                }

                if (valueA < valueB) return -1 * this.columnsSortOrder[index];
                else if (valueA > valueB) return 1 * this.columnsSortOrder[index];
                else return 0;
            });
            return sortedRows;
        });
        console.log(`sortTable with index ${index}`);
    }

    public selectExercise(index) {
        this.selectedExerciseIndex.set(index);
    }

    public clickProviderLink() {
        trackerService.trackEvent("association-etablissement.dashboard.display-provider-modal");
    }

    private processGrants(grants: FlatGrant[]) {
        this.grants.set(grants);
        this.grantsByExercise = this.splitGrantsByExercise(this.grants.value as FlatGrant[]);
        this.grantRowsByExercise = Object.entries(this.grantsByExercise).reduce((acc, [year, grants]) => {
            acc[year] = grants.map(grant => this.grantToRow(grant));
            return acc;
        }, {});

        // needs to be done after grantRowsByExercise or it will not be initialized for derived store trigger
        this.exerciseOptions.set(Object.keys(this.grantsByExercise));
        this.selectedExerciseIndex.set((this.exerciseOptions.value as string[]).length - 1);
    }

    private grantToRow(grant: FlatGrant): string[] {
        const applicationCellsLength = 6;
        const paymentCellsLength = 2;

        let applicationCells: string[];
        let paymentCells: string[];

        if (!grant.application) applicationCells = Array(applicationCellsLength).fill("-");
        else {
            const grantedAmount = numberToEuro(grant.application.montants?.accorde);

            applicationCells = [
                valueOrHyphen(mapSiretPostCodeStore.value.get(grant.application.siret?.toString() as string)),
                valueOrHyphen(grant.application.service_instructeur),
                valueOrHyphen(grant.application.dispositif),
                valueOrHyphen(this.getProjectName(grant.application)),
                valueOrHyphen(numberToEuro(grant.application.montants?.demande)),
                valueOrHyphen(grantedAmount ? grantedAmount : grant.application.statut_label),
            ];
        }

        if (!grant.payments) paymentCells = Array(paymentCellsLength).fill("-");
        else {
            paymentCells = [
                valueOrHyphen(this.getTotalPayment(grant.payments)),
                // valueOrHyphen(grant.payments[0].centreFinancier),
                // valueOrHyphen(withTwoDigitYear(this.getLastPaymentsDate(grant.payments))),
                valueOrHyphen(this.buildProgrammeText(grant.payments)),
            ];
        }

        return [...applicationCells, ...paymentCells];
    }

    // private getLastPaymentsDate = (payments: FlatPayment[]) => {
    //     const orderedPayments = payments.sort((paymentA, paymentB) => {
    //         const dateA = new Date(paymentA.dateOperation);
    //         const dateB = new Date(paymentB.dateOperation);

    //         return dateB.getTime() - dateA.getTime();
    //     });

    //     if (!orderedPayments.length) return null;

    //     return new Date(orderedPayments[0].dateOperation);
    // };

    /**
     * Builds the program text based on the given payments.
     * @param {Array} payments - The array of payments.
     * @returns {string} The program text.
     */
    private buildProgrammeText(payments: FlatPayment[]) {
        const programmes = new Set(payments.map(versement => versement.programme));

        if (programmes.size > 1) {
            return "multi-programmes";
        }

        return `${payments[0].programme} - ${payments[0].libelleProgramme}`;
    }

    private getTotalPayment(payments: FlatPayment[]) {
        return numberToEuro(payments.reduce((acc, payment) => acc + payment.amount, 0));
    }

    private getProjectName(application) {
        if (!application) return undefined;
        if (!application.actions_proposee || !application.actions_proposee.length) return;

        let names = application.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));

        names = [...new Set(names)].join(" - ");

        return names;
    }

    // Grants are supposed to be ordered from API
    private splitGrantsByExercise(grants: FlatGrant[]) {
        return grants.reduce((byExercise, grant) => {
            let exercise;
            if (grant.payments?.length) exercise = String(new Date(grant.payments[0].dateOperation).getFullYear());
            else exercise = String((grant as OnlyApplication).application.annee_demande);
            if (!byExercise[exercise]) byExercise[exercise] = [grant];
            else byExercise[exercise].push(grant);
            return byExercise;
        }, {} as Record<string, FlatGrant[]>);
    }

    public async download() {
        if (this.isExtractLoading.value) return;
        trackerService.buttonClickEvent("association-etablissement.dashbord.download-csv", this.identifier); // tracking
        this.isExtractLoading.set(true);
        const resourceService = isSiret(this.identifier) ? establishmentService : associationService;
        await resourceService.getGrantExtract(this.identifier).then(({ blob, filename }) => {
            documentHelper.download(blob, filename);
        });
        this.isExtractLoading.set(false);
    }
}
