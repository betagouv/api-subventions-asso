<script lang="ts">
    import ContactEtab from "./ContactEtab/ContactEtab.svelte";
    import InfosBancairesEtab from "./InfosBancairesEtab/InfosBancairesEtab.svelte";
    import Tabs from "$lib/dsfr/Tabs.svelte";
    import TabContent from "$lib/dsfr/TabContent.svelte";
    import Documents from "$lib/components/Documents/Documents.svelte";
    import GrantDashboard from "$lib/components/GrantDashboard/GrantDashboard.svelte";

    let { establishment, titles, identifier } = $props();
</script>

<div class="tabs-etab">
    <Tabs {titles}>
        {#snippet tabContent()}
            {#each titles as _title, index (_title)}
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
        {/snippet}
    </Tabs>
</div>
