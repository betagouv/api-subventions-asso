<script>
    import { setContext } from "svelte";
    import "../global.css";
    import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
    import "@gouvfr/dsfr/dist/utility/icons/icons.min.css";
    import "@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js";

    import Auth from "$lib/components/Auth/Auth.svelte";
    import GenericModal from "$lib/dsfr/GenericModal.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Theme from "$lib/components/Theme.svelte";
    import Breadcrumb from "$lib/dsfr/Breadcrumb.svelte";
    import { page } from "$lib/store/kit.store";
    import { ENV } from "$env/static/public";
    import trackerService from "$lib/services/tracker.service";
    import SkipLinks from "$lib/dsfr/SkipLinks.svelte";

    export let data;

    setContext("app", {
        getEnv: () => ENV,
        getName: () => "Data.Subvention",
        getDescription: () => "Les dernières informations sur les associations et leurs subventions",
        getContact: () => "contact@datasubvention.beta.gouv.fr",
        getRepo: () => "https://github.com/betagouv/api-subventions-asso",
    });

    // Options disponibles à l'initialisation du DSFR
    window.dsfr = {
        verbose: false,
        mode: "runtime",
    };

    trackerService.init(ENV);
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <!-- TODO: rendre le nom dynamique -->
    <title>Data.subvention</title>
    <meta name="theme-color" content="#000091" />
</svelte:head>

<GenericModal />
<SkipLinks
    links={[
        { anchor: "content", label: "Contenu" },
        { anchor: "header-navigation", label: "Menu" },
        { anchor: "footer", label: "Pied de page" },
    ]} />
<Auth>
    <div>
        <div class:main-view={$page.data.withBlueBanner}>
            <Header />
            <div class="fr-container fr-mb-8w">
                <main id="content">
                    <Breadcrumb crumbs={data.crumbs} />
                    <slot />
                </main>
            </div>
        </div>
        <Footer />
        <Theme />
    </div>
</Auth>
