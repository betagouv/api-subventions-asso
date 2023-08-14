import { AgentJobTypeEnum } from "@api-subventions-asso/dto";
import Dispatch from "$lib/core/Dispatch";
import Store from "$lib/core/Store";

type Option = {
    value: AgentJobTypeEnum;
    label: string;
};

export default class StructureStepController {
    private readonly dispatch: (_: string) => void;
    public readonly options: Option[];
    public readonly errors: Store<{ [key: string]: string | undefined }>;
    private static errorMandatory = "Ce champ est obligatoire";
    private readonly validators: Record<string, (value: any) => string | undefined>;
    private readonly dirty: { [key: string]: boolean };

    constructor() {
        this.dispatch = Dispatch.getDispatcher();
        this.options = [
            { value: AgentJobTypeEnum.ADMINISTRATOR, label: "Gestionnaire administratif et financier" },
            {
                value: AgentJobTypeEnum.EXPERT,
                label: "Chargé de mission / Expert métier",
            },
            { value: AgentJobTypeEnum.SERVICE_HEAD, label: "Responsable de service" },
            { value: AgentJobTypeEnum.OTHER, label: "Autre" },
        ];
        this.errors = new Store({});
        this.validators = {
            service: (text: string) => {
                if (!text) return StructureStepController.errorMandatory;
            },
            jobType: (jobs: string[] | null) => {
                if (!jobs?.length) return StructureStepController.errorMandatory;
            },
            phoneNumber: (number: string) => {
                if (!number) return StructureStepController.errorMandatory;
                if (!number.match(/09/)) return "Entrez un numéro de téléphone au format "; // TODO
            },
        };
        this.dirty = {
            service: false,
            jobType: false,
            phoneNumber: false,
        };
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
