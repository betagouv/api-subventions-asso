<script lang="ts">
    import { getContext } from "svelte";
    import type AppContext from "../../../routes/AppContext";
    import HeaderController from "./Header.controller";
    import authService from "$lib/resources/auth/auth.service";
    import Button from "$lib/dsfr/Button.svelte";

    import appLogo from "$lib/assets/images/logo-data-subvention.png";

    const user = authService.getCurrentUserStore();
    const { getEnv } = getContext<typeof AppContext>("app");
    const env = getEnv();

    const controller = new HeaderController();
</script>

<header class="fr-header" id="header-navigation">
    <div class="fr-header__body">
        <div class="fr-container">
            <div class="fr-header__body-row">
                <div class="fr-header__brand fr-enlarge-link">
                    <div class="fr-header__brand-top fr-mr-3v">
                        <div class="fr-header__logo">
                            <p class="fr-logo">
                                République
                                <br />
                                Française
                            </p>
                        </div>
                    </div>
                    <div class="app-logo fr-header__service">
                        <img src={appLogo} alt="Data.Subvention" title="Accueil - Data.Subvention" />
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
                            <!-- TODO: remove env check when feature will be ready -->
                            {#if env != "prod" && $user}
                                <li>
                                    <a
                                        class="fr-btn"
                                        href="/depot-scdl"
                                        title="Déposer vos données SCDL"
                                        rel="noopener">
                                        Déposer vos données SCDL
                                    </a>
                                </li>
                            {/if}
                            {#if $user?.roles?.includes("admin")}
                                <li>
                                    <a class="fr-btn fr-link--icon-right" href="/admin" title="admin" rel="noopener">
                                        Admin
                                    </a>
                                </li>
                            {/if}
                            {#if $user}
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

                <div class="fr-header__navbar">
                    <button
                        class="fr-btn--menu fr-btn"
                        data-fr-opened="false"
                        aria-controls="modal-menu"
                        aria-haspopup="menu"
                        id="header__menu__button"
                        title="Menu">
                        Menu
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="fr-header__menu fr-modal" id="modal-menu" aria-labelledby="header__menu__button">
        <div class="fr-container">
            <button class="fr-link--close fr-link" aria-controls="modal-menu">Fermer</button>
            <div class="fr-header__menu-links" />
        </div>
    </div>
</header>

<style>
    .app-logo {
        width: 160px;
    }
    .app-logo img {
        width: 100%;
        height: auto;
    }
</style>
