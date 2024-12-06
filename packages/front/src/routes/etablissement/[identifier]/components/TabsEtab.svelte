<script>
    import ContactEtab from "./ContactEtab/ContactEtab.svelte";
    import InfosBancairesEtab from "./InfosBancairesEtab/InfosBancairesEtab.svelte";
    import Tabs from "$lib/dsfr/Tabs.svelte";
    import TabContent from "$lib/dsfr/TabContent.svelte";
    import Documents from "$lib/components/Documents/Documents.svelte";
    import GrantDashboard from "$lib/components/GrantDashboard/GrantDashboard.svelte";

    export let establishment;
    export let titles;
    export let identifier;
</script>

<div class="tabs-etab">
    <Tabs {titles}>
        <svelte:fragment slot="tab-content">
            {#each titles as _title, index}
                <TabContent selected={index === 0} {index}>
                    {#if index === 0}
                        <GrantDashboard structureId={identifier} />
                    {:else if index === 1}
                        <ContactEtab contacts={establishment.contacts} siret={identifier} />
                    {:else if index === 2}
                        <Documents resource={establishment} resourceType="establishment" />
                    {:else}
                        <InfosBancairesEtab elements={establishment.information_banquaire} />
                    {/if}
                </TabContent>
            {/each}
        </svelte:fragment>
    </Tabs>
</div>
