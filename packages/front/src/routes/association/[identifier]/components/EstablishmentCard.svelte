<script>
    import { EstablishmentCardController } from "./EstablishmentCard.controller";
    import Card from "$lib/dsfr/Card.svelte";
    import EstablishmentPreview from "$lib/components/EstablishmentPreview/EstablishmentPreview.svelte";
    import BadgeGroup from "$lib/dsfr/BadgeGroup.svelte";

    export let name;
    export let establishment;
    const { badgesProps } = new EstablishmentCardController(establishment);
</script>

<Card title={name} url="/etablissement/{establishment.siret}" titleTag="h4" keepSpaceForTitle={true}>
    <BadgeGroup slot="card-start" badges={[badgesProps]} />
    <EstablishmentPreview {establishment} />
</Card>
