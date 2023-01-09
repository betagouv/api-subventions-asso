<script>
    import { setContext } from "svelte";
    import "./global.css";
    import routes from "./routes";
    import { ENV } from "../src/shared/config";
    import { displayBlueBanner } from "./store/context.store";

    import Auth from "./components/Auth.svelte";
    import GenericModal from "./dsfr/GenericModal.svelte";
    import Matomo from "./components/Matomo.svelte";
    import Router from "./components/Router.svelte";
    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import Theme from "./components/Theme.svelte";

    setContext("app", {
        getEnv: () => ENV,
        getName: () => "Data.Subvention",
        getDescription: () => "Les dernières informations sur les associations et leurs subventions",
        getContact: () => "contact@datasubvention.beta.gouv.fr",
        getRepo: () => "https://github.com/betagouv/api-subventions-asso"
    });
</script>

<GenericModal />
<Auth>
    {#if ENV.toLowerCase() == "prod"}
        <Matomo />
    {/if}
    <div class="app-container" class:main-view={$displayBlueBanner}>
        <Header />
        <div class="fr-container fr-mb-8w">
            <main id="content">
                <Router {routes} />
            </main>
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
