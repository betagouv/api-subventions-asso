<script lang="ts">
    import NotFoundController from "./NotFound.controller";
    import svg404 from "$lib/assets/images/svg404.svg";

    const ctrl = new NotFoundController();
</script>

<div class="flex">
    <div class="same-size fr-pr-8v">
        <h1>Page non trouvée</h1>
        <p class="fr-text--sm">Erreur 404</p>
        <p class="fr-text--lead">La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.</p>
        <p>
            Si vous êtes arrivé sur cette page en tapant une url depuis votre navigateur, c’est probable que vous vous
            soyez trompé d’url.
        </p>
        <p>
            Si vous êtes arrivé sur cette page en cliquant sur un lien du site, merci de nous contacter via
            {ctrl.contactEmail}
            pour que nous puissions trouver la panne 🕵️‍♀️.
        </p>
        <div class="flex">
            <a
                class="fr-btn fr-btn--secondary"
                href="mailto:{ctrl.contactEmail}?subject=Page%20non%20trouvée%20&body=Bonjour%2C%0A%0AJe%20ne%20parviens%20pas%20%C3%A0%20acc%C3%A9der%20%C3%A0%20la%20page%20%3A%20{window
                    .location.href}&html=true">
                Contactez-nous
            </a>
        </div>
    </div>
    <div class="same-size flex center fr-pl-8v fr-mx-8v">
        <img src={svg404} alt="404 - Page non trouvée" />
    </div>
</div>

<style>
    .same-size {
        flex: 1 1 0;
    }
</style>
