import type { StructureIdentifierDto } from "dto";
import ApplicationInfoModal from "./Modals/ApplicationInfoModal.svelte";
import PaymentsInfoModal from "./Modals/PaymentsInfoModal.svelte";
import { getApplicationCells, getApplicationDashboardData, isGranted } from "./application.helper";
import { getPaymentDashboardData, getPaymentsCells } from "./payments.helper";
import type { FlatGrant, OnlyApplication } from "$lib/resources/@types/FlattenGrant";
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
import type { SortableRow } from "$lib/components/GrantDashboard/@types/DashboardGrant";
import { grantCompareFn } from "$lib/components/GrantDashboard/sort.helper";

export class GrantDashboardController {
    public identifier: StructureIdentifierDto;
    public grantPromise: Promise<FlatGrant[]> = returnInfinitePromise();
    public grants: Store<FlatGrant[] | undefined> = new Store(undefined);
    public grantsByExercise: Record<string, FlatGrant[]> = {};
    public selectedExerciseIndex: Store<number | undefined> = new Store(undefined);

    public selectedGrants: Store<FlatGrant[] | null> = new Store(null);
    public selectedExercise: ReadStore<string | null> = new ReadStore(null);

    // final rows displayed in view: can be updated with exercise filter and in a future with other filters
    public rows: Store<SortableRow[]> = new Store([]);
    public isExtractLoading: Store<boolean> = new Store(false);
    public exerciseOptions: Store<string[] | undefined> = new Store(undefined);
    public headers: string[];
    private columnsSortOrder: number[];

    constructor(identifier: StructureIdentifierDto) {
        this.identifier = identifier;

        // if you change this please update applicationCellsLength and paymentsCellsLength
        // TODO create this from a applicationHeader + paymentHeader to simplify above comment THIS
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

        this.grantPromise = isSiret(identifier)
            ? establishmentPort.getGrants(identifier)
            : associationPort.getGrants(identifier);

        this.grantPromise.then(grants => this.processGrants(grants));
    }

    private initStores() {
        this.selectedGrants = new Store(null);
        this.selectedExercise = derived(this.selectedExerciseIndex, index => {
            if (index == null || !this.exerciseOptions.value) return null;
            return this.exerciseOptions.value[index];
        });
        this.selectedExercise.subscribe(exercise => {
            if (exercise == null) return;
            this.selectedGrants.set(this.grantsByExercise[exercise]);
        });
        this.selectedGrants.subscribe(grants => this.updateRows(grants));
    }

    /*
    initial processing of grants to split them by exercise and fill available exercises for select
     */
    private processGrants(grants: FlatGrant[]) {
        this.grants.set(grants);
        this.grantsByExercise = this.splitGrantsByExercise(this.grants.value as FlatGrant[]);

        this.exerciseOptions.set(Object.keys(this.grantsByExercise));
        this.selectedExerciseIndex.set((this.exerciseOptions.value as string[]).length - 1);
    }

    get providerBlogUrl() {
        return PUBLIC_PROVIDER_BLOG_URL;
    }

    /*
    message for no subvention at all
     */
    get notFoundMessage() {
        const defaultContent = "Nous sommes désolés, nous n'avons trouvé aucune donnée pour cet établissement";
        if (this.exerciseOptions.value?.length) return `${defaultContent} sur l'année ${this.selectedExercise.value}`;
        else return defaultContent;
    }

    private updateRows(grants) {
        if (!grants) return;
        this.rows.set(
            grants.map(grant => {
                const granted = isGranted(grant.application);
                return {
                    applicationCells: getApplicationCells(grant.application, granted),
                    paymentsCells: getPaymentsCells(grant.payments),
                    granted,
                    application: getApplicationDashboardData(grant.application),
                    payment: getPaymentDashboardData(grant.payments),
                };
            }),
        );
    }

    public sortTable(index: number) {
        // change order between ASC and DESC
        this.columnsSortOrder[index] *= -1;
        this.rows.update(rows => rows.sort((a, b) => grantCompareFn[index](a, b, this.columnsSortOrder[index])));
    }

    public selectExercise(index) {
        this.selectedExerciseIndex.set(index);
    }

    public clickProviderLink() {
        trackerService.trackEvent("association-etablissement.dashboard.display-provider-modal");
    }

    // Grants are expected to be ordered from API
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

    public onPaymentClick(index) {
        if (!this.rows.value[index].paymentsCells) return;
        trackerService.buttonClickEvent("association-etablissement.dashbord.payment.more_information");
        data.set({ payments: (this.selectedGrants.value as FlatGrant[])[index].payments });
        modal.set(PaymentsInfoModal);
    }

    public onApplicationClick(index) {
        if (!this.rows.value[index].applicationCells) return;
        trackerService.buttonClickEvent("association-etablissement.dashbord.subvention.more_information");
        data.set({ application: (this.selectedGrants.value as FlatGrant[])[index].application });
        modal.set(ApplicationInfoModal);
    }
}
