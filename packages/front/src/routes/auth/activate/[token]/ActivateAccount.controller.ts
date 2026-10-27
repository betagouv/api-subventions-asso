import { TokenValidationType } from "dto";
import AgentTypeStep from "$lib/components/AgentTypeStep/AgentTypeStep.svelte";
import CollectedDataAlert from "$lib/components/AgentTypeStep/CollectedDataAlert.svelte";
import StructureFormStep from "$lib/components/StructureFormStep/StructureFormStep.svelte";
import DefinePassword from "$lib/components/DefinePassword/DefinePassword.svelte";
import PasswordFormatAlert from "$lib/components/DefinePassword/PasswordFormatAlert.svelte";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service";
import Store from "$lib/core/Store";
import trackerService from "$lib/services/tracker.service";

export default class ActivateAccountController {
    token: string;
    validationTokenStore = new Store("waiting");
    error: { httpCode: number } | null = null;
    steps = [
        {
            name: "Définir un mot de passe",
            component: DefinePassword,
            alert: PasswordFormatAlert,
            needsValidation: true,
        },
        {
            name: "Informations sur votre profil",
            component: AgentTypeStep,
            alert: CollectedDataAlert,
            needsValidation: true,
        },
        { name: "Informations sur votre structure", component: StructureFormStep },
    ];
    buildContext = values => ({ agentType: values[1].agentType });

    constructor(token: string) {
        this.token = token;
    }

    onSubmit(values) {
        const { confirmPwd: _confirmPwd, ...noConfirmValues } = values;
        return authService
            .activate(this.token, noConfirmValues)
            .then(() => {
                trackerService.buttonClickEvent("activate.form.step.submit-success");
                goToUrl("/?success=ACCOUNT_ACTIVATED");
            })
            .catch(e => {
                trackerService.buttonClickEvent("activate.form.submit-error", e?.message);
            });
    }

    async init() {
        await this._checkTokenValidity();
    }

    async _checkTokenValidity() {
        const tokenValidation = await authService.validateToken(this.token);
        if (!tokenValidation.valid) {
            this.error = { httpCode: 404 };
            this.validationTokenStore.set("invalid");
        } else {
            if (tokenValidation.type === TokenValidationType.FORGET_PASSWORD) {
                goToUrl(`/auth/reset-password/${this.token}`);
            } else {
                this.validationTokenStore.set("valid");
            }
        }
    }
}
