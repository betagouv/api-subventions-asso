<script>
    import Tabs from "../../../dsfr/Tabs.svelte";
    import TabContent from "../../../dsfr/TabContent.svelte";

    export let titles;
</script>

<div class="tabs-asso">
    <Tabs {titles}>
        <svelte:fragment slot="tab-content">
            {#each titles as title, index}
                <TabContent selected={index == 0} {index}>{title}</TabContent>
            {/each}
        </svelte:fragment>
    </Tabs>
</div>

<style>
    .tabs-asso :global(.fr-tabs > .fr-tabs__list) {
        justify-content: center;
    }
</style>
