<script>
    import Card from "@dsfr/Card.svelte";
    import { EstablismentCardController } from "@components/EstablishmentCard/EstablismentCard.controller";

    export let association;
    export let establishment;

    const { siret, status, assoName, address, url } = new EstablismentCardController(association, establishment);
</script>

<Card title={assoName} {url}>
    <p>
        {status}
        <br />
        SIRET : {siret}
        <br />
    </p>
    <div class="flex">
        <span class="fr-col-md-1 fr-mr-1w fr-icon-map-pin-2-line color" />
        <span class="fr-col-md-11 fr-text--bold">{address}</span>
    </div>
</Card>

<style>
    .color {
        color: var(--blue-france-sun-113-625);
    }
</style>
