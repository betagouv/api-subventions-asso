<script>
    import Tabs from "../../../dsfr/Tabs.svelte";
    import TabContent from "../../../dsfr/TabContent.svelte";
    import ContactEtab from "./ContactEtab/ContactEtab.svelte";

    export let etablissement;
    export let titles;
</script>

<div class="tabs-asso">
    <Tabs {titles}>
        <svelte:fragment slot="tab-content">
            {#each titles as _title, index}
                <TabContent selected={index == 0} {index}>
                    {#if index == 0}
                        <!-- <Dashboard {association} /> -->
                    {:else if index == 1}
                        <ContactEtab contacts={etablissement.contacts} />
                    {:else}
                        <!-- <Etablissements {associationIdentifier} {association} /> -->
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
