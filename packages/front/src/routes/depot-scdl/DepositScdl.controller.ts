import Store, { ReadStore } from "$lib/core/Store";
import { goToUrl } from "$lib/services/router.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import type { DepositScdlLogResponseDto } from "dto";
import type { ComponentType } from "svelte";
import { derived } from "svelte/store";

export class DepositScdlController {
    private lastStep: number;
    public stepsDesc = [
        "Information sur la mise à jour des données",
        "Pour qui déposez-vous ce jeu de données ?",
        "Déposer votre fichier au format SCDL",
        "Résumé de votre dépôt",
        "Finalisation du dépôt",
    ]; // todo merge stepComponents with stepsDesc ?
    public stepComponents: Record<number, ComponentType>;
    public depositLog = depositLogStore;
    public currentStep: Store<number | null> = new Store(null);
    public currentView: Store<"loading" | "welcome" | "resume" | "form"> = new Store("loading");
    public currentStepComponent: ReadStore<ComponentType>;
    public currentLoadingMessage = "Veuillez patientez, nous analysons vos données";

    constructor(stepComponents: Record<number, ComponentType>) {
        this.stepComponents = stepComponents;
        this.lastStep = Object.keys(this.stepComponents).length;
        // @ts-expect-error: don't know how to fix that
        this.currentStepComponent = derived(this.currentStep, step => {
            if (!step) return this.stepComponents[1];
            else return this.stepComponents[step];
        });
    }

    async onMount() {
        if (depositLogStore.value == null) {
            this.restartNewForm();
        } else {
            this.displayResume();
        }
    }

    displayResume() {
        this.currentView.set("resume");
        this.currentStep.set((this.depositLog.value as DepositScdlLogResponseDto).step + 1); // todo: only works not but we need to find a way to match form steps and deposit steps (api)
    }

    startNewForm() {
        this.currentView.set("form");
        this.currentStep.set(1);
    }

    restartNewForm() {
        this.currentView.set("welcome");
        this.currentStep.set(null);
    }

    resumeForm() {
        this.currentView.set("form");

        // temporarly behavior to resume form
        if (depositLogStore.value!.step === 1 || depositLogStore.value!.step === 2) {
            const currentFormStep = 3;
            this.currentStep.set(currentFormStep);
        }
    }

    nextStep() {
        this.currentView.set("form");
        if (this.currentStep.value && this.currentStep.value < this.lastStep) {
            this.currentStep.set(this.currentStep.value + 1);
        } else {
            goToUrl("/");
        }
    }

    prevStep() {
        this.currentView.set("form");
        // cannot be null at this point
        const step = this.currentStep.value as number;

        if (step === this.lastStep) {
            goToUrl("/");
        }

        if (step === 1) {
            this.restartNewForm();
        }

        this.currentStep.set(step - 1);
    }

    loading() {
        this.currentView.set("loading");
    }

    endLoading() {
        this.currentView.set("form");
    }
}
