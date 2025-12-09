<script>
    import { getContext } from "svelte";
    import { PUBLIC_STATS_URL, PUBLIC_PRIVACY_POLICY_URL, PUBLIC_CGU_URL } from "$env/static/public";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";
    import { resolve } from "$app/paths";

    const { getDescription, getRepo } = getContext("app");
</script>

<footer class="fr-footer" id="footer">
    <div class="fr-container">
        <div class="fr-footer__body">
            <div class="fr-footer__brand fr-enlarge-link">
                <a href={resolve("/")} title="Retour à l’accueil">
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
                    <TargetBlankLink href={getRepo()} title="Voir le code source - nouvelle fenêtre">
                        Voir le code source
                    </TargetBlankLink>
                </p>
                <ul class="fr-footer__content-list">
                    <li class="fr-footer__content-item">
                        <TargetBlankLink
                            href="https://info.gouv.fr"
                            linkClass="fr-footer__content-link"
                            title="info.gouv.fr - nouvelle fenêtre">
                            info.gouv.fr
                        </TargetBlankLink>
                    </li>
                    <li class="fr-footer__content-item">
                        <TargetBlankLink
                            linkClass="fr-footer__content-link"
                            title="service-public.fr - nouvelle fenêtre"
                            href="https://service-public.fr">
                            service-public.fr
                        </TargetBlankLink>
                    </li>
                    <li class="fr-footer__content-item">
                        <TargetBlankLink
                            linkClass="fr-footer__content-link"
                            title="legifrance.gouv.fr - nouvelle fenêtre"
                            href="https://legifrance.gouv.fr">
                            legifrance.gouv.fr
                        </TargetBlankLink>
                    </li>
                    <li class="fr-footer__content-item">
                        <TargetBlankLink
                            linkClass="fr-footer__content-link"
                            href="https://data.gouv.fr"
                            title="data.gouv.fr - nouvelle fenêtre">
                            data.gouv.fr
                        </TargetBlankLink>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fr-footer__bottom">
            <ul class="fr-footer__bottom-list">
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href={resolve("/accessibilite")}>Accessibilité : non conforme</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <TargetBlankLink
                        linkClass="fr-footer__bottom-link"
                        href={PUBLIC_PRIVACY_POLICY_URL}
                        title="Politique de confidentialité - nouvelle fenêtre">
                        Politique de confidentialité
                    </TargetBlankLink>
                </li>
                <li class="fr-footer__bottom-item">
                    <TargetBlankLink
                        linkClass="fr-footer__bottom-link"
                        href={PUBLIC_STATS_URL}
                        title="Statistiques d'usage - nouvelle fenêtre">
                        Statistiques d'usage
                    </TargetBlankLink>
                </li>
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href={resolve("/mentions-legales")}>Mentions légales</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <TargetBlankLink
                        linkClass="fr-footer__bottom-link"
                        href={PUBLIC_CGU_URL}
                        title="Conditions générales d'utilisation - nouvelle fenêtre">
                        Conditions générales d’utilisation
                    </TargetBlankLink>
                </li>
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href={resolve("/contact")}>Contactez-nous</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <button
                        class="fr-footer__bottom-link fr-icon-theme-fill fr-link--icon-left"
                        aria-controls="fr-theme-modal"
                        data-fr-opened="false">
                        Paramètres d'affichage
                    </button>
                </li>
                <li class="fr-footer__bottom-item">
                    <a
                        class="fr-footer__bottom-link"
                        href="mailto:contact@datasubvention.beta.gouv.fr?subject=Faille de sécurité détectée&body=Bonjour, %0D%0A %0D%0A Il me semble avoir détecté une faille de sécurité. %0D%0A %0D%0A Voici la description : &html=true">
                        Signaler un problème de sécurité
                    </a>
                </li>
            </ul>
            <div class="fr-footer__bottom-copy">
                <p>
                    Sauf mention contraire, tous les contenus de ce site sont sous
                    <TargetBlankLink
                        href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                        title="licence etalab-2.0 - nouvelle fenêtre">
                        licence etalab-2.0
                    </TargetBlankLink>
                </p>
            </div>
        </div>
    </div>
</footer>
