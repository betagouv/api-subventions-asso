<script>
    import "./global.css";
    import { ENV } from "../src/shared/config";
    import Auth from "./shared/Auth.svelte";
    import GenericModal from "./dsfr/GenericModal.svelte";
    import Matomo from "./components/Matomo.svelte";
    import Router from "./shared/Router.svelte";
    import Header from "./shared/Header.svelte";
    import Footer from "./shared/Footer.svelte";
    import Theme from "./shared/Theme.svelte";
    import { setContext } from "svelte";

    const searchParams = new URLSearchParams(location.search);
    setContext("app", {
        getEnv: () => ENV,
        getName: () => "Data.Subvention",
        getDescription: () => "Les dernières informations sur les associations et leurs subventions",
        getContact: () => "contact@datasubvention.beta.gouv.fr",
        getRepo: () => "https://github.com/betagouv/api-subventions-asso"
    });
</script>

{#if ENV.toLowerCase() == "prod"}
    <Matomo />
{/if}
<GenericModal />
<Auth>
    <div class="app-container">
        <Header />
        <div class="fr-container fr-mb-8w">
            <Router {searchParams} />
        </div>
        <Footer />
        <Theme />
    </div>
</Auth>

<style>
    .app-container {
        height: 100vh;

        /* grid container settings */
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
            "header"
            "main"
            "footer";
    }
</style>
