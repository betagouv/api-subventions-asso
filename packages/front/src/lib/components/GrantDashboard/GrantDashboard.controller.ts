import type { StructureIdentifierDto } from "dto";
import type { FlatGrant, OnlyApplication } from "../../resources/@types/FlattenGrant";
import ApplicationInfoModal from "./Modals/ApplicationInfoModal.svelte";
import PaymentsInfoModal from "./Modals/PaymentsInfoModal.svelte";
import { getApplicationCells, isGranted } from "./application.helper";
import { getPaymentsCells } from "./payments.helper";
import type { TableCell } from "$lib/dsfr/TableCell.types";
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
import { data, modal } from "$lib/store/modal.store";

export class GrantDashboardController {
    public identifier: StructureIdentifierDto;
    public grantPromise: Promise<FlatGrant[]> = returnInfinitePromise();
    public grants: Store<FlatGrant[] | undefined> = new Store(undefined);
    public grantsByExercise: Record<string, FlatGrant[]> = {};
    public grantRowsByExercise: Record<string, string[][]> = {};
    public selectedExerciseIndex: Store<number | undefined> = new Store(undefined);

    // @ts-expect-error: done in initStores()
    public selectedGrants: ReadStore<FlatGrant[] | null>;
    // @ts-expect-error: done in initStores()
    public selectedExercise: ReadStore<string | null>;
    // final rows displayed in view
    // can be updated with exercise filter and in a futur with other filters
    public rows: Store<{ applicationCells: TableCell[]; paymentsCells: TableCell[]; granted: boolean }[]> = new Store(
        [],
    );
    public isExtractLoading: Store<boolean> = new Store(false);
    public exerciseOptions: Store<string[] | undefined> = new Store(undefined);
    public headers: string[];
    private columnsSortOrder: number[];

    constructor(identifier: StructureIdentifierDto) {
        this.identifier = identifier;

        // if you change this please update applicationCellsLength and paymentsCellsLength
        // TODO create this from a applicationHeader + paymentHeader to simplify above comment
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
        this.selectedExercise = derived(this.selectedExerciseIndex, index => {
            if (!index || !this.exerciseOptions.value) return null;
            return this.exerciseOptions.value[index];
        });
        this.selectedGrants = derived(this.selectedExerciseIndex, index => {
            if (!index) return null;
            const exercise = (this.exerciseOptions.value as string[])[index];
            const grants = this.grantsByExercise[exercise];
            this.updateRows(grants);
            return grants;
        });
    }

    private processGrants(grants: FlatGrant[]) {
        this.grants.set(grants);
        this.grantsByExercise = this.splitGrantsByExercise(this.grants.value as FlatGrant[]);

        // needs to be done after grantRowsByExercise or it will not be initialized for derived store trigger
        this.exerciseOptions.set(Object.keys(this.grantsByExercise));
        this.selectedExerciseIndex.set((this.exerciseOptions.value as string[]).length - 1);
    }

    get providerBlogUrl() {
        return PUBLIC_PROVIDER_BLOG_URL;
    }

    get notFoundMessage() {
        const defaultContent = "Nous sommes désolés, nous n'avons trouvé aucune donnée pour cet établissement";
        if (this.exerciseOptions.value?.length) return `${defaultContent} sur l'année ${this.selectedExercise.value}`;
        else return defaultContent;
    }

    // TODO: move valueOrHyphen thing to ApplicationRow and PaymentRow
    private updateRows(grants) {
        this.rows.set(
            grants.map(grant => {
                const granted = isGranted(grant.application);
                return {
                    applicationCells: getApplicationCells(grant.application, granted),
                    paymentsCells: getPaymentsCells(grant.payments),
                    granted,
                };
            }),
        );
        console.log("updated rows", this.rows.value);
    }

    // TODO: MAKE THIS WORK WITH ROWS AS APPLICATION_CELLS AND PAYMENTS_CELLS
    public sortTable(index) {
        // this.columnsSortOrder[index] = this.columnsSortOrder[index] * -1;
        // this.rows.update(rows => {
        //     const sortedRows = rows.sort((a, b) => {
        //         const valueA = a[index],
        //             valueB = b[index];

        //         const currencyColumnIndexes = [this.headers.indexOf("Demandé"), this.headers.indexOf("Versé")];
        //         if (currencyColumnIndexes.includes(index)) {
        //             console.info("specific treatment for non usual column values");
        //         }

        //         if (valueA < valueB) return -1 * this.columnsSortOrder[index];
        //         else if (valueA > valueB) return 1 * this.columnsSortOrder[index];
        //         else return 0;
        //     });
        //     return sortedRows;
        // });
        console.log(`sortTable with index ${index}`);
    }

    public selectExercise(index) {
        this.selectedExerciseIndex.set(index);
    }

    public clickProviderLink() {
        trackerService.trackEvent("association-etablissement.dashboard.display-provider-modal");
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

    public onRowClick(rowIndex, cellIndex) {
        if (cellIndex <= this.rows.value[rowIndex].applicationCells.length - 1) this.onApplicationClick(rowIndex);
        else this.onPaymentClick(rowIndex);
    }

    public onPaymentClick(index) {
        trackerService.buttonClickEvent("association-etablissement.dashbord.payment.more_information");
        data.set({ payments: (this.selectedGrants.value as FlatGrant[])[index].payments });
        modal.set(PaymentsInfoModal);
    }

    public onApplicationClick(index) {
        trackerService.buttonClickEvent("association-etablissement.dashbord.subvention.more_information");
        data.set({
            application: (this.selectedGrants.value as FlatGrant[])[index].application,
        });
        modal.set(ApplicationInfoModal);
    }
}
