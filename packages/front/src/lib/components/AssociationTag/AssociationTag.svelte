<script lang="ts">
    import type { AssociationTagAssociation } from "./AssociationTag.controller";
    import AssociationTagController from "./AssociationTag.controller";

    export let simplifiedAsso: AssociationTagAssociation;

    const ctrl = new AssociationTagController(simplifiedAsso);
</script>

<a class="association-tag" href={ctrl.url}>
    <span class="association-tag-label">{ctrl.label}</span>
</a>

<style>
    .association-tag {
        --hover-tint: var(--hover);
        --hover: var(--background-action-low-blue-france-hover);
        --active: var(--background-action-low-blue-france-active);
        --underline-img: none;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        background-color: var(--background-contrast-grey);
        color: var(--text-title-grey);
        font-size: 0.875rem;
        line-height: 1.5rem;
    }
</style>
