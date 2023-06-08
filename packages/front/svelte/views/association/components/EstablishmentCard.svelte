<script>
    import { EstablishmentCardController } from "./EstablishmentCard.controller";
    import Card from "@dsfr/Card.svelte";
    import EstablishmentPreview from "@components/EstablishmentPreview/EstablishmentPreview.svelte";
    import BadgeGroup from "@dsfr/BadgeGroup.svelte";

    export let name;
    export let establishment;
    const { badgesProps } = new EstablishmentCardController(establishment);
</script>

<Card title={name} url="/etablissement/{establishment.siret}">
    <BadgeGroup slot="card-start" badges={[badgesProps]} />
    <EstablishmentPreview {establishment} />
</Card>
