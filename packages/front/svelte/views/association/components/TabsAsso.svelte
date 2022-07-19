<script>
    import Tabs from "../../../dsfr/Tabs.svelte";
    import TabContent from "../../../dsfr/TabContent.svelte";
    import Etablissements from "./Etablissements.svelte";
    import Documents from "./Documents.svelte";
    import Dashboard from "./dashboard/Dashboard.svelte";

    export let titles;
    export let association;
    export let associationIdentifier;
</script>

<div class="tabs-asso">
    <Tabs {titles}>
        <svelte:fragment slot="tab-content">
            {#each titles as _title, index}
                <TabContent selected={index == 0} {index}>
                    {#if index == 0}
                        <Dashboard {association} />
                    {:else if index == 1}
                        <Documents {associationIdentifier} />
                    {:else}
                        <Etablissements {associationIdentifier} />
                    {/if}
                </TabContent>
            {/each}
        </svelte:fragment>
    </Tabs>
</div>

<style>
    .tabs-asso :global(.fr-tabs > .fr-tabs__list) {
        justify-content: center;
    }
</style>
