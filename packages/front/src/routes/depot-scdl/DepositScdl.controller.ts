import Store, { ReadStore } from "$lib/core/Store";
import { goToUrl } from "$lib/services/router.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import type { DepositScdlLogResponseDto } from "dto";
import type { ComponentType } from "svelte";
import { derived } from "svelte/store";

export class DepositScdlController {
    public stepsDesc = [
        "Information sur la mise à jour des données",
        "Pour qui déposez-vous ce jeu de données ?",
        "Déposer votre fichier au format SCDL",
        "Résumé de votre dépôt",
        "Finalisation du dépôt",
    ];
    public stepComponents: Record<number, ComponentType>;
    public depositLog = depositLogStore;
    public currentStep: Store<number | null> = new Store(null);
    public currentView: Store<"loading" | "welcome" | "resume" | "form"> = new Store("loading");
    public currentStepComponent: ReadStore<ComponentType>;

    constructor(stepComponents: Record<number, ComponentType>) {
        this.stepComponents = stepComponents;
        // @ts-expect-error: don't know how to fix that
        this.currentStepComponent = derived(this.currentStep, step => {
            if (!step) return this.stepComponents[1];
            else return this.stepComponents[step];
        });
    }

    async onMount() {
        if (depositLogStore.value == null) {
            this.currentView.set("welcome");
            this.currentStep.set(null);
        } else {
            this.currentView.set("resume");
            this.currentStep.set((this.depositLog.value as DepositScdlLogResponseDto).step + 1);
        }
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
        // currentStep = $depositLogStore!.step + 2; // todo faire une fonction claire
        this.currentStep.set(depositLogStore.value!.step + 1); // pour test
    }

    nextStep() {
        if (this.currentStep.value && this.currentStep.value < 5) {
            this.currentStep.set(this.currentStep.value + 1);
        } // todo: else pour aller vers l'accueil
    }

    prevStep() {
        // if form has been ended then start a new one
        // TODO: maybe the previous button should be grayed / hidden ?
        if (this.currentStep.value === 5) {
            return goToUrl("/");
        }

        // is this actually a thing ?
        if (!this.currentStep.value || this.currentStep.value === 1) {
            return this.startNewForm();
        }

        this.currentStep.set(this.currentStep.value - 1);
    }
}
