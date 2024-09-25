import type { Step } from "./Step";
import Store, { derived, ReadStore } from "$lib/core/Store";

export default class MultiStepFormController {
    public steps: Step[];
    public onSubmit: (callback) => void;
    public currentStep: Store<{
        index: number;
        positionLabel: number;
        step: Step;
        isFirstStep: boolean;
        isLastStep: boolean;
        nextStepName: string | null;
        nextStepPositionLabel: 2 | null;
    }>;
    // used in component
    public isStepBlocked: ReadStore<boolean>;
    public data: Store<any[]>;
    public context: ReadStore<unknown>;

    private stepsValidation: Store<boolean[]>;

    constructor(steps, onSubmit, buildContext) {
        this.steps = steps;
        this.onSubmit = onSubmit;
        this.currentStep = new Store({
            index: 0,
            positionLabel: 1,
            step: steps[0],
            isFirstStep: true,
            isLastStep: this.steps.length === 1,
            nextStepName: steps.length > 1 ? steps[1].name : null,
            nextStepPositionLabel: steps.length > 1 ? 2 : null,
        });

        this.stepsValidation = new Store(this.steps.map(step => !step.needsValidation));
        this.isStepBlocked = derived(
            [this.stepsValidation, this.currentStep],
            ([validation, currentStep]) => !validation[currentStep.index],
        );

        // create an array of empty object that represent each step values
        this.data = new Store(this.steps.map(() => ({})));
        this.context = derived(this.data, data => buildContext(data));
    }

    /**
     * Move in to direction to the "step"
     *
     * @param {1|-1} direction
     */
    _shift(direction) {
        const oldStep = this.currentStep.value;
        const newIndex = oldStep.index + direction;
        const nextIndex = newIndex + 1;
        this.currentStep.set({
            index: newIndex,
            positionLabel: oldStep.positionLabel + direction,
            step: this.steps[newIndex],
            isFirstStep: newIndex === 0,
            isLastStep: this.steps.length === nextIndex,
            nextStepName: this.steps.length > nextIndex ? this.steps[nextIndex].name : null,
            nextStepPositionLabel: this.steps.length > nextIndex ? nextIndex + 1 : null,
        });
    }

    _getFlattenedData() {
        return this.data.value.reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});
    }

    submit() {
        this.onSubmit(this._getFlattenedData());
    }

    next() {
        this._shift(1);
    }

    previous() {
        this._shift(-1);
    }

    updateValidation(isValid) {
        this.stepsValidation.update(validation => {
            validation[this.currentStep.value.index] = isValid;
            return validation;
        });
    }
}
