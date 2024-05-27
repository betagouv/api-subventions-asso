<script lang="ts">
    import { nanoid } from "nanoid";

    export let expanded: boolean;
    export let id = nanoid(7);
    export let toCloseLabel = "Masquer";
    export let toOpenLabel = "Afficher plus";
</script>

<section class="fr-accordion">
    <h3 class="fr-accordion__title">
        <button class="fr-accordion__btn" aria-expanded={expanded} aria-controls="accordion-{id}" on:click>
            {#if expanded}
                {toCloseLabel}
            {:else}
                {toOpenLabel}
            {/if}
        </button>
    </h3>
    {#if $$slots["default"]}
        <div class="fr-collapse" id="accordion-{id}">
            <slot />
        </div>
    {/if}
</section>
