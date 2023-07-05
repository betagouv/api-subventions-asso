import step1 from "./ExampleStep.svelte";
import Store from "@core/Store";

export default class SignupFormController {
    // a step's component's controller must inherit AbstractStepController
    // see ExampleStep to know about the step component's requirements
    stepsById = {
        names: {
            component: step1,
            next: values => (values ? "job" : "final"),
            previous: null,
            index: 1,
            title: "Titre exemple d'une étape",
        },
        job: { component: step1, next: "final", previous: "names", index: 2 },
    };
    finalStepIndex = 3;

    constructor() {
        this.stepId = new Store("names");
        this.currentStepData = new Store({});
        this.stepsStateById = new Store({
            names: {
                component: step1,
                next: values => (values ? "job" : "final"),
                previous: null,
                index: 1,
                title: "Prmi",
            },
            job: { component: step1, next: "final", previous: "names", index: 2 },
        });
        this.step = new Store();
        this.nextStep = new Store();

        this.stepId.subscribe(value => {
            this.step.set(this.stepsById[value]);
            this.nextStep.set(
                typeof this.step.value.next === "string"
                    ? this.stepsById[this.step.value.next]
                    : this.stepsById[this.step.value.next(this.currentStepData)],
            );
        });
    }

    // Our handlers
    // if this need to become asynchronous, you must add `await` in `AbstractStepController.init` when it is called
    onSubmit = values => {
        // here we could do different things according to the step if needed
        // for instance do the actual submission at last step
        if (this.step.value.next === "final") return;
        if (typeof this.step.value.next === "function") this.toStep(this.step.value.next(values), values);
        else this.toStep(this.step.value.next, values);
    };

    // if this need to become asynchronous, you must add `await` in `AbstractStepController.init` when it is called
    onBack = values => {
        this.toStep(this.step.value.previous, values);
    };

    toStep = (stepIdToGo, values) => {
        if (!stepIdToGo) return;
        this.stepsStateById.value[this.stepId] = values;
        this.stepsStateById.set(this.stepsStateById); // triggering update
        this.stepId.set(stepIdToGo);
    };
}
