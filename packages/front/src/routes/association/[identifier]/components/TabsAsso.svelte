<script>
    import Establishments from "./Establishments/Establishments.svelte";
    import Bodacc from "./Bodacc/Bodacc.svelte";
    import Tabs from "$lib/dsfr/Tabs.svelte";
    import TabContent from "$lib/dsfr/TabContent.svelte";
    import Documents from "$lib/components/Documents/Documents.svelte";
    import SubventionsPaymentsDashboard from "$lib/components/SubventionsPaymentsDashboard/SubventionsPaymentsDashboard.svelte";
    import { currentAssociation } from "$lib/store/association.store";
    // import Stats from "./Stats/Stats.svelte";

    export let titles;
    export let associationIdentifier;
</script>

<Tabs {titles}>
    <svelte:fragment slot="tab-content">
        {#each titles as _title, index}
            <TabContent selected={index === 0} {index}>
                {#if index === 0}
                    <SubventionsPaymentsDashboard identifier={associationIdentifier} />
                    <!-- {:else if index === 1} // Uncomment when stats are available
                    <Stats /> -->
                {:else if index === 1}
                    <Documents resource={$currentAssociation} />
                {:else if index === 2}
                    <Establishments />
                {:else}
                    <Bodacc bodacc={$currentAssociation.bodacc} />
                {/if}
            </TabContent>
        {/each}
    </svelte:fragment>
</Tabs>
