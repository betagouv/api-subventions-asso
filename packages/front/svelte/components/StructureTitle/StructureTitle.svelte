<script>
    import Button from "../../dsfr/Button.svelte";
    import { StructureTitleController } from "./StructureTitle.controller";

    export let association;
    export let siret = undefined;

    const controller = new StructureTitleController(association, siret);
</script>

<div class="fr-grid-row">
    <div class:fr-col-10={controller.hasActionButton}>
        <h1>{controller.title}</h1>
        {#if controller.subtitle}
            <div class="fr-h4">{controller.subtitle}</div>
        {/if}
        <p class="fr-text--lg">
            RNA : <span class="fr-text--bold">{controller.rna}</span>
            - SIREN :
            <span class="fr-text--bold">{controller.siren}</span>
        </p>
    </div>
    {#if controller.hasActionButton}
        <div class="fr-col-2 fr-pt-1w">
            <a class="fr-link" href={controller.linkToAsso}>Voir l'association</a>
        </div>
    {/if}
</div>
