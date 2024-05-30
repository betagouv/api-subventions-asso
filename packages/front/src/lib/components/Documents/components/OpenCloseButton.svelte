<script lang="ts">
    import { nanoid } from "nanoid";

    export let expanded: boolean;
    export let id = nanoid(7);
    export let toCloseLabel = "Masquer";
    export let toOpenLabel = "Afficher plus";
</script>

<section class="fr-accordion">
    <div class="fr-collapse fr-p-0" id="accordion-{id}">
        <slot />
    </div>
    <h3 class="fr-accordion__title">
        <button class="fr-accordion__btn" aria-expanded={expanded} aria-controls="accordion-{id}" on:click>
            <div class="fr-ml-auto">
                {#if expanded}
                    {toCloseLabel}
                {:else}
                    {toOpenLabel}
                {/if}
            </div>
        </button>
    </h3>
</section>

<style>
    .fr-accordion:before {
        box-shadow: none;
    }

    .fr-accordion__btn {
        display: flex;
    }

    .fr-accordion__btn:after {
        margin-left: 0.5rem;
        margin-right: auto;
    }
</style>
