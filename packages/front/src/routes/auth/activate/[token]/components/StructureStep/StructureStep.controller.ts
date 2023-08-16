import { AgentJobTypeEnum } from "@api-subventions-asso/dto";
import Dispatch from "$lib/core/Dispatch";
import Store from "$lib/core/Store";
import { isPhoneNumber } from "$lib/helpers/stringHelper";

type Option = {
    value: AgentJobTypeEnum;
    label: string;
};

export default class StructureStepController {
    private readonly dispatch: (_: string) => void;
    public readonly errors: Store<{ [key: string]: string | undefined }>;
    private static errorMandatory = "Ce champ est obligatoire";
    private readonly dirty: { [key: string]: boolean };

    private readonly validators: Record<string, (value: any) => string | undefined> = {
        service: (text: string) => {
            if (!text) return StructureStepController.errorMandatory;
        },
        jobType: (jobs: string[] | null) => {
            if (!jobs?.length) return StructureStepController.errorMandatory;
        },
        phoneNumber: (number: string) => {
            if (!number) return StructureStepController.errorMandatory;
            if (!isPhoneNumber(number)) return "Entrez un numéro de téléphone valide";
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

    constructor() {
        this.dispatch = Dispatch.getDispatcher();
        this.errors = new Store({});
        this.dirty = {};
        for (const inputName of Object.keys(this.validators)) {
            this.dirty[inputName] = false;
        }
    }

    onUpdate(values: Record<string, unknown>, changedKey: string) {
        this.dirty[changedKey] = true;
        const tempErrors: { [key: string]: string | undefined } = {};
        let currentError;
        let error = false;
        for (const [key, validator] of Object.entries(this.validators)) {
            currentError = validator(values[key] as string);
            if (currentError) error = true;
            if (this.dirty[key]) tempErrors[key] = currentError;
        }
        this.errors.set(tempErrors);
        this.dispatch(error ? "error" : "valid");
    }
}
