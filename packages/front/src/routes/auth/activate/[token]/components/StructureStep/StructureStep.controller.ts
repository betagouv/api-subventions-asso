import { AgentTypeEnum, AgentJobTypeEnum } from "dto";
import type { SvelteComponent } from "svelte";
import ExampleSubStep from "./ExampleSubStep/ExampleSubStep.svelte";
import Dispatch from "$lib/core/Dispatch";
import Store from "$lib/core/Store";
import { isPhoneNumber } from "$lib/helpers/stringHelper";

type Option = {
    value: AgentJobTypeEnum;
    label: string;
};

interface Context {
    agentType: AgentTypeEnum;
}

interface SubStep {
    component: typeof SvelteComponent;
    // valid: boolean
}

export default class StructureStepController {
    private readonly dispatch: (_: string) => void;

    public readonly errors: Store<{ [key: string]: string | undefined }>;
    // private static errorMandatory = "Ce champ est obligatoire";
    private readonly dirty: { [key: string]: boolean };

    private readonly validators: Record<string, (value: any) => string | undefined> = {
        // service: (text: string) => {
        //     if (!text) return StructureStepController.errorMandatory;
        // },
        // jobType: (jobs: string[] | null) => {
        //     if (!jobs?.length) return StructureStepController.errorMandatory;
        // },
        phoneNumber: (number: string) => {
            // if (!number) return StructureStepController.errorMandatory;
            if (number && !isPhoneNumber(number)) return "Entrez un numéro de téléphone valide";
        },
    };

    public readonly jobTypeOptions: Option[] = [
        { value: AgentJobTypeEnum.ADMINISTRATOR, label: "Gestionnaire administratif et financier" },
        {
            value: AgentJobTypeEnum.EXPERT,
            label: "Chargé de mission / Expert métier",
        },
        { value: AgentJobTypeEnum.SERVICE_HEAD, label: "Responsable de service" },
        { value: AgentJobTypeEnum.OTHER, label: "Autre" },
    ];

    private static subStepByAgentType: Record<AgentTypeEnum, typeof SvelteComponent | undefined> = {
        [AgentTypeEnum.CENTRAL_ADMIN]: ExampleSubStep,
        [AgentTypeEnum.OPERATOR]: ExampleSubStep,
        [AgentTypeEnum.TERRITORIAL_COLLECTIVITY]: ExampleSubStep,
        [AgentTypeEnum.DECONCENTRATED_ADMIN]: ExampleSubStep,
    };
    public subStep: Store<SubStep | undefined>;

    constructor() {
        this.dispatch = Dispatch.getDispatcher();
        this.subStep = new Store(undefined);

        this.errors = new Store({});
        this.dirty = {};
        for (const inputName of Object.keys(this.validators)) {
            this.dirty[inputName] = false;
        }
        this.dispatch("valid") // no required field so default is valid
    }

    onUpdate(values: Record<string, unknown>, changedKey: string) {
        this.dirty[changedKey] = true;
        const tempErrors: { [key: string]: string | undefined } = {};
        let currentError;
        let shouldBlockStep = false;
        // a step should sometimes be blocked even if we display no error to the user,
        // typically when a required field was not filled at all
        for (const [key, validator] of Object.entries(this.validators)) {
            currentError = validator(values[key] as string);
            if (currentError) shouldBlockStep = true;
            if (this.dirty[key]) tempErrors[key] = currentError;
        }
        this.errors.set(tempErrors);
        this.dispatch(shouldBlockStep ? "error" : "valid");
    }

    async onUpdateContext(context: Context) {
        const component = StructureStepController.subStepByAgentType[context.agentType];
        this.subStep.set(
            component
                ? {
                      component,
                      // valid: false
                  }
                : undefined,
        );
    }
}
