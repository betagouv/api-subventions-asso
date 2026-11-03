import CollectedDataAlert from "$lib/components/AgentTypeStep/CollectedDataAlert.svelte";
import AgentTypeStep from "$lib/components/AgentTypeStep/AgentTypeStep.svelte";
import StructureFormStep from "$lib/components/StructureFormStep/StructureFormStep.svelte";
import userService from "$lib/resources/users/user.service";
import Store from "$lib/core/Store";
import authService from "$lib/resources/auth/auth.service";

export default class SignupACController {
    errorMessage: Store<string | null> = new Store(null);
    steps = [
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

    buildContext = values => ({ agentType: values[0].agentType, fromPC: true });

    constructor() {}

    async onSubmit(values) {
        try {
            const user = await userService.completeProfile(values);
            return authService.redirectAfterProConnectLogin(user.data);
        } catch {
            this.errorMessage.set("Veuillez ré-essayer");
        }
    }
}
