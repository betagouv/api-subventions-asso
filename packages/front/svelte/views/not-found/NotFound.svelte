<script>
    import NotFoundController from "./NotFound.controller";
    import Button from "@dsfr/Button.svelte";

    const ctrl = new NotFoundController();
</script>

<div class="flex">
    <div class="same-size">
        <h1>Page non trouvée</h1>
        <p class="fr-text--sm">Erreur 404</p>
        <p class="fr-text--lead">La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.</p>
        <p>
            Si vous êtes arrivé sur cette page en tapant une url depuis votre navigateur, c’est probable que vous vous
            soyez trompé d’url.
        </p>
        <p>
            Si vous êtes arrivé sur cette page en cliquant sur un lien du site, merci de nous contacter via
            <u>contact@datasubvention.bata.gouv.fr</u>
            pour que nous puissions trouver la panne 🕵️‍♀️.
        </p>
        <div class="flex gap-16">
            <Button on:click={() => ctrl.toHome()}>Page d'accueil</Button>
            <Button on:click={() => ctrl.openMail()} type="secondary">Contactez-nous</Button>
        </div>
    </div>
    <div class="same-size flex center">
        <img src="/static/images/404.svg" alt="404 - Page non trouvée" />
    </div>
</div>

<style>
    .gap-16 {
        gap: 16px;
    }

    .same-size {
        flex: 1 1 0;
    }
</style>
