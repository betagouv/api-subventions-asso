<script>
    import { setContext } from "svelte";
    import "./global.css";
    import { ENV } from "../src/shared/config";
    import routes from "./routes";
    import { displayBlueBanner } from "./store/context.store";

    import Auth from "./components/Auth/Auth.svelte";
    import GenericModal from "./dsfr/GenericModal.svelte";
    import Matomo from "./components/Matomo.svelte";
    import Router from "./components/Router/Router.svelte";
    import Header from "./components/Header/Header.svelte";
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
    <div class:main-view={$displayBlueBanner}>
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
</style>
