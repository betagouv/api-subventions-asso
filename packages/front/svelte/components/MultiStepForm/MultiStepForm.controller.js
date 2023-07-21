import Store from "@core/Store";

export default class MultiStepFormController {
    constructor(steps, onSubmit) {
        this.steps = steps;
        this.onSubmit = onSubmit;
        this.currentStepIndex = new Store(0);
        // create an array of empty object that represent each step values
        this.data = new Store(this.steps.map(() => ({})));
    }

    _getFlattenedData() {
        return this.data.value.reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});
    }

    submit() {
        console.log("submit");
        this.onSubmit(this._getFlattenedData());
    }

    next() {
        console.log("next");
        this.currentStepIndex.value = this.currentStepIndex.value + 1;
    }

    previous() {
        console.log("previous");
        this.currentStepIndex.value = this.currentStepIndex.value - 1;
    }
}
