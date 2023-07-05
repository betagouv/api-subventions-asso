import { createForm } from "felte";

export default class AbstractStepController {
    constructor(formConfig = {}, standalone = true) {
        // formConfig based on felte https://felte.dev/docs/svelte/submitting#custom-handler
        // many handlers are not managed by this component, but could be, modelling onSubmit
        this._stepFormConfig = formConfig;

        // use standalone param to condition some behaviours/displays if there are used as a step or not
        this.standalone = standalone;
    }

    init() {
        this.formConfig = {
            ...this._stepFormConfig,
            onSubmit: async (...args) => {
                // onSubmit will be called if a button type submit is called in a form with attribute 'use:form'
                await this.localOnSubmit(...args);
                if (!this.standalone) this._stepFormConfig?.onSubmit(...args);
            },
            onBack: async (...args) => {
                // onBack is not automatically used and needs to be called in the component
                await this.localOnBack(...args);
                if (!this.standalone) this._stepFormConfig?.onBack(...args);
            },
        };
        this.createdForm = createForm(this.formConfig);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function -- abstract optional method
    localOnSubmit() {
        return Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function -- abstract optional method
    async localOnBack() {
        return Promise.resolve();
    }

    // this is here to be easier to call from the component
    onBack(args) {
        return this.formConfig.onBack(args);
    }
}
