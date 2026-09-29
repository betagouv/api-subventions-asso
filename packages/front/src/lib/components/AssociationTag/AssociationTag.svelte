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
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        height: 32px;
        max-width: 100%;
        padding: 0 1rem;
        border-radius: 999rem;
        background-color: var(--background-contrast-grey);
        background-image: none;
        color: var(--text-title-grey);
        font-family: Marianne, Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        text-decoration: none;
    }

    .association-tag-label {
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        white-space: nowrap;
    }

    .association-tag:hover {
        background-color: var(--background-contrast-grey-hover);
    }

    .association-tag:active {
        background-color: var(--background-contrast-grey-active);
    }
</style>
