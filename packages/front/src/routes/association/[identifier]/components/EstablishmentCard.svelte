<script lang="ts">
    import { EstablishmentCardController } from "./EstablishmentCard.controller";
    import Card from "$lib/dsfr/Card.svelte";
    import EstablishmentPreview from "$lib/components/EstablishmentPreview/EstablishmentPreview.svelte";
    import BadgeGroup from "$lib/dsfr/BadgeGroup.svelte";

    let { name, establishment } = $props();
    const { badgesProps } = new EstablishmentCardController(establishment);
</script>

<Card title={name} url="/etablissement/{establishment.siret}" titleTag="h4" keepSpaceForTitle={true}>
    {#snippet cardStart()}
        <BadgeGroup badges={[badgesProps]} />
    {/snippet}
    <EstablishmentPreview {establishment} />
</Card>
