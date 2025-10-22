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
        } else {
            // do we want to use this method to restart a form after finishing one ?
            this.startNewForm();
        }
    }

    prevStep() {
        // cannot be null at this point
        const step = this.currentStep.value as number;

        if (step === 5 || step === 1) {
            return goToUrl("/");
        }

        this.currentStep.set(step - 1);
    }
}
