<script lang="ts">
    import "../global.css";
    import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
    import "@gouvfr/dsfr/dist/utility/icons/icons.min.css";
    import "@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js";

    import { AppController } from "./App.controller";
    import Auth from "$lib/components/Auth/Auth.svelte";
    import GenericModal from "$lib/dsfr/GenericModal.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Theme from "$lib/components/Theme.svelte";
    import Breadcrumb from "$lib/dsfr/Breadcrumb.svelte";
    import { page } from "$lib/store/kit.store";

    import SkipLinks from "$lib/dsfr/SkipLinks.svelte";
    import MainInfoBanner from "$lib/components/MainInfoBanner/MainInfoBanner.svelte";

    export let data;

    const ctrl = new AppController();
    const { displayBanner } = ctrl;
    // Options disponibles à l'initialisation du DSFR
    // @ts-expect-error: DSFR
    window.dsfr = {
        verbose: false,
        mode: "runtime",
    };
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
        <div class="stick-footer">
            <div class:main-view={$page.data.withBlueBanner}>
                <Header />
                {#if $displayBanner}
                    <MainInfoBanner />
                {/if}
                <div class="fr-container fr-mb-8w">
                    <main id="content">
                        <Breadcrumb crumbs={data.crumbs} />
                        <slot />
                    </main>
                </div>
            </div>
            <Footer />
        </div>
        <Theme />
    </div>
</Auth>

<style>
    .stick-footer {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .main-view {
        display: flex;
        flex-direction: column;
        background-image: linear-gradient(
            to bottom,
            var(--background-action-low-blue-france) 0 40em,
            var(--background-alt-grey) 40em
        );
    }
</style>
