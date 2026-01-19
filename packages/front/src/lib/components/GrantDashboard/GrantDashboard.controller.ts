import type { GrantFlatDto, StructureIdentifierDto } from "dto";
import ApplicationInfoModal from "./Modals/ApplicationInfoModal.svelte";
import PaymentsInfoModal from "./Modals/PaymentsInfoModal.svelte";
import { getApplicationCells, getApplicationDashboardData, isGranted } from "./application.helper";
import { getPaymentDashboardData, getPaymentsCells } from "./payments.helper";
import { isSiret } from "$lib/helpers/identifierHelper";
import associationPort from "$lib/resources/associations/association.port";
import establishmentPort from "$lib/resources/establishments/establishment.port";
import { returnInfinitePromise } from "$lib/helpers/promiseHelper";
import Store from "$lib/core/Store";
import trackerService from "$lib/services/tracker.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import associationService from "$lib/resources/associations/association.service";
import documentHelper from "$lib/helpers/document.helper";
import { PUBLIC_PROVIDER_BLOG_URL } from "$env/static/public";
import { data, modal } from "$lib/store/modal.store";
import type { SortableRow } from "$lib/components/GrantDashboard/@types/DashboardGrant";
import { grantCompareFn } from "$lib/components/GrantDashboard/sort.helper";
import type { Option } from "$lib/types/FieldOption";
import { getOrInit } from "$lib/helpers/array.helper";

export class GrantDashboardController {
    public identifier: StructureIdentifierDto;
    public grantPromise: Promise<GrantFlatDto[]> = returnInfinitePromise();
    public grants: Store<GrantFlatDto[] | undefined> = new Store(undefined);
    public grantsByExercise: Record<string, GrantFlatDto[]> = {};
    private UNKNOWN_EXERCISE = "unknown" as const;
    public selectedGrants: Store<GrantFlatDto[] | null> = new Store(null);
    public selectedExercise: Store<string | null> = new Store(null);

    // final rows displayed in view: can be updated with exercise filter and in a future with other filters
    public rows: Store<SortableRow[]> = new Store([]);
    public isExtractLoading: Store<boolean> = new Store(false);
    public exerciseOptions: Store<Option<string | null>[] | undefined> = new Store(undefined);
    public headers: { name: string; tooltip?: string }[];
    private columnsSortOrder: number[];

    constructor(identifier: StructureIdentifierDto) {
        this.identifier = identifier;

        // if you change this please update applicationCellsLength and paymentsCellsLength
        // TODO create this from a applicationHeader + paymentHeader to simplify above comment THIS
        this.headers = [
            { name: "CP" },
            { name: "Instructeur", tooltip: "Nom du service qui instruit la demande." },
            { name: "Dispositif", tooltip: "Nom du dispositif de financement ou du programme de subvention." },
            { name: "Action" },
            { name: "Demandé" },
            { name: "Statut" },
            {
                name: "Versé",
                tooltip:
                    "Le montant affiché correspond à la somme des versements sur l'exercice budgétaire sélectionné.",
            },
            { name: "Programme" },
        ];

        this.columnsSortOrder = Array(this.headers.length).fill(1);

        this.initStores();

        this.grantPromise = isSiret(identifier)
            ? establishmentPort.getGrants(identifier)
            : associationPort.getGrants(identifier);

        this.grantPromise.then(grants => this.processGrants(grants));
    }

    private initStores() {
        this.selectedExercise.subscribe(exercise => {
            if (!exercise) return; // bypass the first execution when the store is not defined
            this.selectedGrants.set(this.grantsByExercise[exercise]);
        });
        this.selectedGrants.subscribe(grants => this.updateRows(grants as GrantFlatDto[]));
    }

    /*
    initial processing of grants to split them by exercise and fill available exercises for select
     */
    private processGrants(grants: GrantFlatDto[]) {
        this.grants.set(grants);
        this.grantsByExercise = this.splitGrantsByExercise(this.grants.value as GrantFlatDto[]);
        this.exerciseOptions.set(this._buildExercices(Object.keys(this.grantsByExercise)));
        this.selectedExercise.set(this.getDefaultExercise());
    }

    private getDefaultExercise(): string | null {
        const currentExercise = new Date().getFullYear().toString();
        const exercises = (this.exerciseOptions.value as Option<string>[]).map(exercise => exercise.value);
        if (!exercises || exercises.length === 0) return null;
        if (exercises.find(year => year === currentExercise)) return currentExercise; // initialized to current exercise
        const firstKnownExercise = exercises
            .filter(exercise => exercise !== this.UNKNOWN_EXERCISE)
            .sort()
            .at(-1);
        if (firstKnownExercise) return firstKnownExercise;
        else return this.UNKNOWN_EXERCISE;
    }

    _buildExercices(exercices: (string | null)[]) {
        return exercices.map(year => {
            let label: string;
            if (year === this.UNKNOWN_EXERCISE) label = `Exercice inconnu`;
            else label = `Exercice ${year} (année civile)`;
            return { value: year, label };
        });
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

    private updateRows(grants: GrantFlatDto[]) {
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
                    grant: grant,
                };
            }),
        );
    }

    public sortTable(index: number) {
        // change order between ASC and DESC
        this.columnsSortOrder[index] *= -1;
        this.rows.update(rows => rows.sort((a, b) => grantCompareFn[index](a, b, this.columnsSortOrder[index])));
    }

    public clickProviderLink() {
        trackerService.trackEvent("association-etablissement.dashboard.display-provider-modal");
    }

    // Grants are expected to be ordered from API
    private splitGrantsByExercise(grants: GrantFlatDto[]) {
        const byExercise: Record<string | number, GrantFlatDto[]> = {};
        return grants.reduce((byExercise, grant) => {
            const exercise = grant.application?.exerciceBudgetaire ?? grant.payments?.[0]?.exerciceBudgetaire;
            if (!exercise) {
                byExercise["unknown"] = getOrInit(byExercise["unknown"]).concat(grant);
            } else byExercise[exercise] = getOrInit(byExercise[exercise]).concat(grant);
            return byExercise;
        }, byExercise);
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

    // Display payment modal for the clicked row
    public onPaymentClick(index) {
        if (!this.rows.value[index].paymentsCells) return;
        trackerService.buttonClickEvent("association-etablissement.dashbord.payment.more_information");
        data.set({ payments: (this.rows.value as SortableRow[])[index].grant.payments });
        modal.set(PaymentsInfoModal);
    }

    // Display application modal for the clicked row
    public onApplicationClick(index) {
        if (!this.rows.value[index].applicationCells) return;
        trackerService.buttonClickEvent("association-etablissement.dashbord.subvention.more_information");
        data.set({ application: (this.rows.value as SortableRow[])[index].grant.application });
        modal.set(ApplicationInfoModal);
    }
}
