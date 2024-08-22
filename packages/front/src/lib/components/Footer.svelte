<script>
    import { getContext } from "svelte";
    import { STATS_URL, PRIVACY_POLICY_URL, CGU_URL } from "$env/static/public";

    const { getDescription, getRepo } = getContext("app");
</script>

<footer class="fr-footer" id="footer">
    <div class="fr-container">
        <div class="fr-footer__body">
            <div class="fr-footer__brand fr-enlarge-link">
                <a href="/" title="Retour à l’accueil">
                    <p class="fr-logo">
                        République
                        <br />
                        française
                    </p>
                </a>
            </div>
            <div class="fr-footer__content">
                <p class="fr-footer__content-desc">
                    {getDescription()}
                </p>
                <p class="fr-footer__content-desc">
                    Le code source est ouvert et les contributions sont bienvenues.
                    <a
                        title="Voir le code source - nouvelle fenêtre"
                        href={getRepo()}
                        target="_blank"
                        rel="noopener noreferrer">
                        Voir le code source
                    </a>
                </p>
                <ul class="fr-footer__content-list">
                    <li class="fr-footer__content-item">
                        <a
                            class="fr-footer__content-link"
                            target="_blank"
                            rel="noopener external"
                            title="info.gouv.fr - nouvelle fenêtre"
                            href="https://info.gouv.fr">
                            info.gouv.fr
                        </a>
                    </li>
                    <li class="fr-footer__content-item">
                        <a
                            class="fr-footer__content-link"
                            target="_blank"
                            rel="noopener external"
                            title="service-public.fr - nouvelle fenêtre"
                            href="https://service-public.fr">
                            service-public.fr
                        </a>
                    </li>
                    <li class="fr-footer__content-item">
                        <a
                            class="fr-footer__content-link"
                            target="_blank"
                            rel="noopener external"
                            title="legifrance.gouv.fr - nouvelle fenêtre"
                            href="https://legifrance.gouv.fr">
                            legifrance.gouv.fr
                        </a>
                    </li>
                    <li class="fr-footer__content-item">
                        <a
                            class="fr-footer__content-link"
                            target="_blank"
                            rel="noopener external"
                            title="data.gouv.fr - nouvelle fenêtre"
                            href="https://data.gouv.fr">
                            data.gouv.fr
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fr-footer__bottom">
            <ul class="fr-footer__bottom-list">
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href="/accessibilite">Accessibilité : non conforme</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <a
                        class="fr-footer__bottom-link"
                        href={PRIVACY_POLICY_URL}
                        target="_blank"
                        rel="noopener external"
                        title="Politique de confidentialité - nouvelle fenêtre">
                        Politique de confidentialité
                    </a>
                </li>
                <li class="fr-footer__bottom-item">
                    <a
                        class="fr-footer__bottom-link"
                        href={STATS_URL}
                        target="_blank"
                        rel="noopener external"
                        title="Statistiques d'usage - nouvelle fenêtre">
                        Statistiques d'usage
                    </a>
                </li>
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href="/mentions-legales">Mentions légales</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <a
                        class="fr-footer__bottom-link"
                        href={CGU_URL}
                        target="_blank"
                        title="Conditions générales d'utilisation - nouvelle fenêtre">
                        Conditions générales d’utilisation
                    </a>
                </li>
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href="/contact">Contactez-nous</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <button
                        class="fr-footer__bottom-link fr-icon-theme-fill fr-link--icon-left"
                        aria-controls="fr-theme-modal"
                        data-fr-opened="false">
                        Paramètres d'affichage
                    </button>
                </li>
            </ul>
            <div class="fr-footer__bottom-copy">
                <p>
                    Sauf mention contraire, tous les contenus de ce site sont sous <a
                        href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                        target="_blank"
                        title="licence etalab-2.0 - nouvelle fenêtre"
                        rel="noopener external">
                        licence etalab-2.0
                    </a>
                </p>
            </div>
        </div>
    </div>
</footer>
