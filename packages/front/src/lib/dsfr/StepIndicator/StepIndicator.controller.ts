export default class StepIndicatorController {
    public currentStep: number;
    public totalSteps: number;
    private readonly stepsTitles: string[];

    constructor(currentStep: number, steps: string[]) {
        this.currentStep = currentStep;
        this.stepsTitles = steps;
        this.totalSteps = steps.length;
    }

    get currentStepTitle(): string {
        return this.stepsTitles[this.currentStep - 1] ?? "";
    }

    get nextStepTitle(): string {
        return this.currentStep < this.totalSteps ? this.stepsTitles[this.currentStep] : "";
    }
}
