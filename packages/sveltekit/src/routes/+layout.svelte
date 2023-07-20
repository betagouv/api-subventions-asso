<script>
    import { setContext } from "svelte";
    import "../global.css";
    import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css"
    import "@gouvfr/dsfr/dist/utility/icons/icons.min.css"
    import { displayBlueBanner } from "$lib/store/context.store";

    import Auth from "$lib/components/Auth/Auth.svelte";
    import GenericModal from "$lib/dsfr/GenericModal.svelte";
    import Matomo from "$lib/components/Matomo.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Theme from "$lib/components/Theme.svelte";
    import { ENV } from "$lib/config";

    setContext("app", {
        getEnv: () => ENV,
        getName: () => "Data.Subvention",
        getDescription: () => "Les dernières informations sur les associations et leurs subventions",
        getContact: () => "contact@datasubvention.beta.gouv.fr",
        getRepo: () => "https://github.com/betagouv/api-subventions-asso",
    });
</script>

<GenericModal />
<Auth>
    {#if ENV?.toLowerCase() === "prod"}
        <Matomo />
    {/if}
    <div class:main-view={$displayBlueBanner}>
        <Header />
        <div class="fr-container fr-mb-8w">
            <main id="content">
                <slot></slot>
            </main>
        </div>
        <Footer />
        <Theme />
    </div>
</Auth>
