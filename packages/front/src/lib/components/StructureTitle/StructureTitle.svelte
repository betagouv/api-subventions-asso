<script>
    import { StructureTitleController } from "./StructureTitle.controller";
    import { currentAssociation, currentIdentifiers } from "$lib/store/association.store";
    import Badge from "$lib/dsfr/Badge.svelte";
    export let siret = undefined;

    const controller = new StructureTitleController($currentAssociation, siret, $currentIdentifiers);
</script>

<div class="fr-grid-row">
    <div class:fr-col-10={controller.hasActionButton}>
        <h1>{controller.title}</h1>
        {#if controller.subtitle}
            <div class="fr-h4">{controller.subtitle}</div>
        {/if}
        <div class="structure-info fr-grid-row">
            <p class="fr-text--lg">
                RNA : <span class="fr-text--bold">{controller.rna}</span>
                - SIREN :
                <span class="fr-text--bold">{controller.siren}</span>
            </p>
            {#if controller.rup}
                <Badge label="Association reconnue d'utilité publique" noIcon={true} type="purple-glycine" />
            {/if}
            <p class="nb-estab fr-icon-info-fill fr-text--sm">
                {controller.nbEstabLabel}
            </p>
        </div>
    </div>
    {#if controller.hasActionButton}
        <div class="fr-col-2 fr-pt-1w">
            <a class="fr-link fr-icon-community-line fr-link--icon-left" href={controller.linkToAsso}>
                Voir l'association
            </a>
        </div>
    {/if}
</div>

<style>
    .structure-info {
        gap: 1em;
    }

    .structure-info > p {
        margin-bottom: 0;
    }

    .structure-info > p.nb-estab {
        color: var(--text-default-info);
    }

    .structure-info > p.fr-icon-info-fill::before {
        margin-right: 0.5em;
    }
</style>
