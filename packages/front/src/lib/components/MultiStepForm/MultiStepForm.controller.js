import Store from "$lib/core/Store";

export default class MultiStepFormController {
    constructor(steps, onSubmit) {
        this.steps = steps;
        this.onSubmit = onSubmit;
        this.currentStep = new Store({
            index: 0,
            positionLabel: 1,
            step: steps[0],
            isFirstStep: true,
            isLastStep: this.steps.length === 1,
        });

        // create an array of empty object that represent each step values
        this.data = new Store(this.steps.map(() => ({})));
    }

    onDestroy() {
        this._unsubscribe();
    }

    /**
     * Move in to direction to the "step"
     *
     * @param {1|-1} direction
     */
    _shift(direction) {
        const oldStep = this.currentStep.value;
        const newIndex = oldStep.index + direction;
        this.currentStep.set({
            index: newIndex,
            positionLabel: oldStep.positionLabel + direction,
            step: this.steps[newIndex],
            isFirstStep: newIndex === 0,
            isLastStep: this.steps.length === newIndex + 1,
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
}
