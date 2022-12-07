<script>
    import { getContext } from "svelte";
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
                    <a title="Voir le code source" href={getRepo()} target="_blank" rel="noopener">
                        Voir le code source
                    </a>
                </p>
                <ul class="fr-footer__content-list">
                    <li class="fr-footer__content-item">
                        <a class="fr-footer__content-link" title="Contactez-nous" href="/contact">Contactez-nous</a>
                    </li>
                    <li class="fr-footer__content-item">
                        <a class="fr-footer__content-link" href="https://www.numerique.gouv.fr/">numerique.gouv.fr</a>
                    </li>
                    <li class="fr-footer__content-item">
                        <a class="fr-footer__content-link" href="https://beta.gouv.fr/">beta.gouv.fr</a>
                    </li>
                    <li class="fr-footer__content-item">
                        <a class="fr-footer__content-link" href="https://www.gouvernement.fr/">gouvernement.fr</a>
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
                    <a class="fr-footer__bottom-link" href="/mentions-legales">Mentions légales</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href="/cgu">Conditions générales d’utilisation</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <a class="fr-footer__bottom-link" href="/contact">Contactez-nous</a>
                </li>
                <li class="fr-footer__bottom-item">
                    <button
                        class="fr-footer__bottom-link fr-icon-sun-line fr-link--icon-left"
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
                        target="_blank">
                        licence etalab-2.0
                    </a>
                </p>
            </div>
        </div>
    </div>
</footer>
