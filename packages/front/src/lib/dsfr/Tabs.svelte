<script lang="ts">
    import type { Snippet } from "svelte";
    import Tab from "./Tab.svelte";

    interface Props {
        titles: string[];
        tabContent?: Snippet;
    }

    let { titles, tabContent }: Props = $props();
</script>

<div class="fr-tabs">
    <ul class="fr-tabs__list" role="tablist" aria-label="Système d'onglet">
        {#each titles as title, index (index)}
            <Tab {title} {index} selected={index == 0} />
        {/each}
    </ul>
    {@render tabContent?.()}
</div>
