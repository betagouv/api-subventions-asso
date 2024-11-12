import type { StructureIdentifierDto } from "dto";
import type { FlatGrant, OnlyApplication } from "../../resources/@types/FlattenGrant";
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

export class GrantDashboardController {
    public identifier: StructureIdentifierDto;
    public grantPromise: Promise<FlatGrant[]> = returnInfinitePromise();
    public grants: Store<FlatGrant[] | undefined> = new Store(undefined);
    public grantsByExercise: Record<string, FlatGrant[]> = {};
    public selectedExerciseIndex: Store<number | undefined> = new Store(undefined);
    public selectedGrants: ReadStore<FlatGrant[] | null>;
    public isExtractLoading: Store<boolean> = new Store(false);
    public exerciseOptions: Store<string[] | undefined> = new Store(undefined);

    constructor(identifier: StructureIdentifierDto) {
        this.identifier = identifier;
        this.selectedGrants = derived(this.selectedExerciseIndex, index => {
            if (!index) return null;
            const exercise = (this.exerciseOptions.value as string[])[index];
            return this.grantsByExercise[exercise];
        });
        if (isSiret(identifier)) {
            this.grantPromise = establishmentPort.getGrants(identifier);
        } else {
            this.grantPromise = associationPort.getGrants(identifier);
        }

        this.grantPromise.then(grants => this.processGrants(grants));
    }

    get providerBlogUrl() {
        return PUBLIC_PROVIDER_BLOG_URL;
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
        this.exerciseOptions.set(Object.keys(this.grantsByExercise));
        this.selectedExerciseIndex.set((this.exerciseOptions.value as string[]).length - 1);
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
