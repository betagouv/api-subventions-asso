<script>
    import { StructureTitleController } from "./StructureTitle.controller";
    import Button from "../../dsfr/Button.svelte";

    export let association;
    export let etablissementId = undefined;

    const controller = new StructureTitleController(association, etablissementId);
</script>

<div class="fr-grid-row">
    <div class:fr-col-10={controller.hasActionButton}>
        <h1>{controller.title}</h1>
        {#if controller.subtitle}
            <div class="fr-h4">{controller.subtitle}</div>
        {/if}
        <div class="fr-text--lg">
            RNA : <span class="fr-text--bold">{controller.rna}</span>
            - SIREN :
            <span class="fr-text--bold">{controller.siren}</span>
        </div>
    </div>
    {#if controller.hasActionButton}
        <div class="fr-col-2">
            <a href="controller.linkToAsso" tabindex="-1">
                <Button moreClasses="fr-mt-1w">Voir l'association</Button>
            </a>
        </div>
    {/if}
</div>
