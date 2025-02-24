import CollectedDataAlert from "$lib/components/AgentTypeStep/CollectedDataAlert.svelte";
import AgentTypeStep from "$lib/components/AgentTypeStep/AgentTypeStep.svelte";
import StructureFormStep from "$lib/components/StructureFormStep/StructureFormStep.svelte";
import { goToUrl } from "$lib/services/router.service";
import userService from "$lib/resources/users/user.service";
import Store from "$lib/core/Store";
import trackerService from "$lib/services/tracker.service";

export default class SignupACController {
    constructor() {
        this.errorMessage = new Store(null);
        this.steps = [
            {
                name: "Informations sur votre profil",
                component: AgentTypeStep,
                alert: CollectedDataAlert,
                needsValidation: true,
            },
            {
                name: "Informations sur votre structure",
                component: StructureFormStep,
            },
        ];
        this.buildContext = values => ({ agentType: values[0].agentType, fromAC: true });
    }

    async onSubmit(values) {
        try {
            await userService.completeProfile(values);
            trackerService.buttonClickEvent("signup-ac.form.step.submit-success");
            goToUrl("/?success=ACCOUNT_COMPLETED", true, true);
        } catch (e) {
            trackerService.buttonClickEvent("signup-ac.form.submit-error", e?.message);
            this.errorMessage.set("Veuillez ré-essayer");
        }
    }
}
