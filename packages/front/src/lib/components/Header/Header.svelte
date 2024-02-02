<script>
    import { getContext } from "svelte";
    import HeaderController from "./Header.controller";
    import authService from "$lib/resources/auth/auth.service";
    import Button from "$lib/dsfr/Button.svelte";
    import { version } from "$app/environment";

    const user = authService.getCurrentUser();
    const { getName, getDescription, getEnv } = getContext("app");
    const name = getName();
    const description = getDescription();
    const env = getEnv();

    const controller = new HeaderController();
</script>

<header class="fr-header" id="header-navigation">
    <div class="fr-header__body">
        <div class="fr-container">
            <div class="fr-header__body-row">
                <div class="fr-header__brand fr-enlarge-link">
                    <div class="fr-header__brand-top">
                        <div class="fr-header__logo">
                            <p class="fr-logo">
                                République
                                <br />
                                Française
                            </p>
                        </div>
                        <div class="fr-header__navbar">
                            <button
                                class="fr-btn--menu fr-btn"
                                data-fr-opened="false"
                                aria-controls="modal-menu"
                                aria-haspopup="menu"
                                title="Menu">
                                Menu
                            </button>
                        </div>
                    </div>
                    <div class="fr-header__service">
                        <a href="/" title="Accueil - {name}">
                            <p class="fr-header__service-title">
                                {name} - V{version}
                            </p>
                            {#if env != "prod"}
                                <p class="stage">{env}</p>
                            {/if}
                        </a>
                        <p class="fr-header__service-tagline">
                            {description}
                        </p>
                    </div>
                </div>

                <div class="fr-header__tools">
                    <div class="fr-header__tools-links">
                        <ul class="fr-btns-group">
                            <li>
                                <a
                                    class="fr-btn fr-link--icon-right"
                                    href="https://github.com/betagouv/api-subventions-asso"
                                    title="code source - nouvelle fenêtre"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Code source
                                </a>
                            </li>
                            <li>
                                <button
                                    class="fr-btn fr-link--icon-left"
                                    aria-controls="fr-theme-modal"
                                    data-fr-opened="false">
                                    Paramètres d'affichage
                                </button>
                            </li>
                            {#if user?.roles?.includes("admin")}
                                <li>
                                    <a class="fr-btn fr-link--icon-right" href="/admin" title="admin" rel="noopener">
                                        Admin
                                    </a>
                                </li>
                            {/if}
                            {#if user}
                                <li>
                                    <Button
                                        on:click={controller.logout}
                                        type="tertiary"
                                        outline={false}
                                        trackerName="header.logout">
                                        Se déconnecter
                                    </Button>
                                </li>
                                <li>
                                    <Button
                                        on:click={controller.goToProfile}
                                        type="tertiary"
                                        icon="user-fill"
                                        trackerName="header.profil">
                                        Profil
                                    </Button>
                                </li>
                            {/if}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TODO : fix aria-labelled-by -->
    <div class="fr-header__menu fr-modal" id="modal-menu" aria-labelledby="button-825">
        <div class="fr-container">
            <button class="fr-link--close fr-link" aria-controls="modal-menu">Fermer</button>
            <div class="fr-header__menu-links" />
        </div>
    </div>
</header>

<style>
    .stage {
        color: hsl(143deg 63.5% 33.8%);
    }
</style>
