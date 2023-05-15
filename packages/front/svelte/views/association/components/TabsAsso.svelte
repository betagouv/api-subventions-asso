<script>
    import Tabs from "../../../dsfr/Tabs.svelte";
    import TabContent from "../../../dsfr/TabContent.svelte";
    import Documents from "../../../components/Documents/Documents.svelte";
    import SubventionsVersementsDashboard from "../../../components/SubventionsVersementsDashboard/SubventionsVersementsDashboard.svelte";
    import Etablissements from "./Etablissements.svelte";
    import Bodacc from "./Bodacc/Bodacc.svelte";
    // import Stats from "./Stats/Stats.svelte";

    export let titles;
    export let association;
    export let associationIdentifier;
</script>

<Tabs {titles}>
    <svelte:fragment slot="tab-content">
        {#each titles as _title, index}
            <TabContent selected={index === 0} {index}>
                {#if index === 0}
                    <SubventionsVersementsDashboard identifier={associationIdentifier} />
                    <!-- {:else if index === 1} // Uncomment when stats are available
                    <Stats /> -->
                {:else if index === 1}
                    <Documents resource={association} />
                {:else if index === 2}
                    <Etablissements {associationIdentifier} {association} />
                {:else}
                    <Bodacc bodacc={association.bodacc} />
                {/if}
            </TabContent>
        {/each}
    </svelte:fragment>
</Tabs>
