<script lang="ts">
    import ContactEtabController from "./ContactEtabController";
    import ActionGroup from "$lib/components/ActionGroup.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Input from "$lib/dsfr/Input.svelte";
    import Select from "$lib/dsfr/Select.svelte";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";

    let { contacts = [], siret } = $props();

    const tableId = "contact-etab";
    const controller = $state(new ContactEtabController(contacts, siret));
    const { contacts: _contacts } = controller;
</script>

<ActionGroup>
    {#snippet content()}
        <h2>Contacts et représentants légaux</h2>
    {/snippet}
    {#snippet action()}
        {#if controller.hasContact}
            <Button
                onclick={() => controller.download()}
                type="secondary"
                trackerName="etablissements.contacts.download-csv">
                Télécharger au format CSV
            </Button>
        {/if}
    {/snippet}
</ActionGroup>
{#if controller.hasContact}
    <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-6">
            <Input label="Rechercher un nom, un prénom" bind:value={controller.inputName} />
        </div>
        <div class="fr-col-6">
            <Select
                onchange={selectedIndex => controller.filterByRole(selectedIndex)}
                label="Rôle"
                options={controller.roles} />
        </div>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
            <Table
                id={tableId}
                title="Tableau des contacts de l'établissement"
                headers={controller.headers}
                headersSize={controller.headersSize}
                scrollable={false}>
                {#each $_contacts as contact, index (index)}
                    <TableRow id={tableId} {index}>
                        <td>
                            {contact.civilite}
                        </td>
                        <td>
                            {contact.nom}
                        </td>
                        <td>
                            {contact.prenom}
                        </td>
                        <td>
                            {contact.telephone}
                        </td>
                        <td>
                            {contact.email}
                        </td>
                        <td>
                            {contact.role}
                        </td>
                    </TableRow>
                {/each}
            </Table>
        </div>
    </div>
{:else}
    <p>Nous sommes désolés, nous n'avons trouvé aucune donnée pour cet établissement</p>
{/if}
