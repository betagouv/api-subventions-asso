<script>
    import { version } from "../../package.json";
    import { user as userStore } from "../store/user.store";
    import { getContext } from "svelte";

    const user = $userStore;
    const { getName, getDescription, getEnv } = getContext("app");
    const name = getName();
    const description = getDescription();
    const env = getEnv();
</script>

<header class="fr-header">
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
                                    rel="noopener">
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
                            {#if user?.jwt}
                                <li>
                                    <a
                                        class="fr-btn fr-link--icon-right"
                                        href="/auth/logout"
                                        title="se déconnecter"
                                        rel="noopener">
                                        Se déconnecter
                                    </a>
                                </li>
                            {/if}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TODO : fix arria-labellby -->
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
