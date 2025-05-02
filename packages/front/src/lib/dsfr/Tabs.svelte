<script>
    import Tab from "./Tab.svelte";

    export let titles;
</script>

<div class="fr-tabs">
    <ul class="fr-tabs__list" role="tablist" aria-label="Système d'onglet">
        {#each titles as title, index (index)}
            <Tab {title} {index} selected={index == 0} />
        {/each}
    </ul>
    <slot name="tab-content" />
</div>
