<script>
    import { ProfileController } from "./Profile.controller";
    import Logout from "./logout/DeleteUser.svelte";
    import Button from "@dsfr/Button.svelte";

    const controller = new ProfileController();
</script>

<div class="fr-container">
    <div class="fr-grid-row">
        <div class="fr-col-8">
            <Logout on:delete-user={() => controller.deleteUser()} />
        </div>
    </div>
    <div class="fr-grid-row fr-mt-8v">
        <div class="fr-col-3">
            <Button type="secondary" on:click={controller.logout}>Se déconnecter</Button>
        </div>
    </div>
</div>

<!-- markup (zero or more items) goes here -->
<style>
</style>
