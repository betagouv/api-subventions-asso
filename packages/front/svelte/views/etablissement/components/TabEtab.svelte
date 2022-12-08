<script>
    import Tabs from "../../../dsfr/Tabs.svelte";
    import TabContent from "../../../dsfr/TabContent.svelte";
    import ContactEtab from "./ContactEtab/ContactEtab.svelte";
    import Documents from "../../../components/Documents/Documents.svelte";
    import InfosBancairesEtab from "./InfosBancairesEtab/InfosBancairesEtab.svelte";
    import SubventionsVersementsDashboard from "../../../components/SubventionsVersementsDashboard/SubventionsVersementsDashboard.svelte";

    export let etablissement;
    export let titles;
    export let identifier;
</script>

<div class="tabs-etab">
    <Tabs {titles}>
        <svelte:fragment slot="tab-content">
            {#each titles as _title, index}
                <TabContent selected={index === 0} {index}>
                    {#if index === 0}
                        <SubventionsVersementsDashboard {identifier} />

                    {:else if index === 1}
                        <ContactEtab contacts={etablissement.contacts} />
                    {:else if index === 2}
                        <Documents resource={etablissement} resourceType="etablissement" />
                    {:else}
                        <InfosBancairesEtab elements={etablissement.information_banquaire} />
                    {/if}
                </TabContent>
            {/each}
        </svelte:fragment>
    </Tabs>
</div>

<style>
    .tabs-etab :global(.fr-tabs > .fr-tabs__list) {
        justify-content: center;
    }
</style>
