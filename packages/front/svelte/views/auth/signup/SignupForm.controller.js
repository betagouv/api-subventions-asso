import step1 from "./ExampleStep.svelte";
import Store from "@core/Store";

export default class SignupFormController {
    // a step's component's controller must inherit AbstractStepController
    // see ExampleStep to know about the step component's requirements
    // "final" stepID is a reserved key name that means no next step
    stepsById = {
        names: {
            component: step1,
            next: values => (values.firstName ? "job" : "final"),
            previous: null,
            index: 1,
            title: "Titre exemple d'une étape",
        },
        job: { component: step1, next: "final", previous: "names", index: 2, title: "titre de l'étape 2" },
    };
    finalStepIndex = 3;

    constructor() {
        this.stepId = new Store("names");
        this.currentStepData = new Store({});
        this.stepsStateById = new Store({});
        this.step = new Store();
        this.nextStep = new Store();

        this.stepId.subscribe(value => {
            this.step.set(this.stepsById[value]);
            this._updateNextStep();
        });
        this.currentStepData.subscribe(() => this._updateNextStep());
    }

    // Our handlers
    // if this need to become asynchronous, you must add `await` in `AbstractStepController.init` when it is called
    onSubmit = values => {
        // here we could do different things according to the step if needed
        // for instance do the actual submission at last step
        if (!this.step.value.next) return;
        if (typeof this.step.value.next === "function") this.toStep(this.step.value.next(values), values);
        else this.toStep(this.step.value.next, values);
    };

    // if this need to become asynchronous, you must add `await` in `AbstractStepController.init` when it is called
    onBack = values => {
        this.toStep(this.step.value.previous, values);
    };

    toStep = (stepIdToGo, values) => {
        if (!stepIdToGo) return;
        this.stepsStateById.value[this.stepId.value] = values;
        this.stepsStateById.set(this.stepsStateById.value); // triggering update
        this.stepId.set(stepIdToGo);
    };

    _updateNextStep() {
        this.nextStep.set(
            this.step.value.next
                ? typeof this.step.value.next === "string"
                    ? this.stepsById[this.step.value.next]
                    : this.stepsById[this.step.value.next(this.currentStepData.value)]
                : null,
        );
    }
}
