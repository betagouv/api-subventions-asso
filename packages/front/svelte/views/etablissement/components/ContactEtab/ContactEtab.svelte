<script>
    import ActionGroup from "../../../../components/ActionGroup.svelte";
    import Button from "../../../../dsfr/Button.svelte";
    import Input from "../../../../dsfr/Input.svelte";
    import Select from "../../../../dsfr/Select.svelte";
    import Table from "../../../../dsfr/Table.svelte";
    import ContactEtabController from "./ContactEtabController";

    export let contacts = [];

    const controller = new ContactEtabController(contacts);
    const { contacts: _contacts } = controller;
</script>

<ActionGroup>
    <svelte:fragment slot="content">
        <h2>Contacts et représentants légaux</h2>
    </svelte:fragment>
    <svelte:fragment slot="action">
        <Button on:click={controller.download} type="secondary">Télécharger au format CSV</Button>
    </svelte:fragment>
</ActionGroup>
<div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-6">
        <Input label="Rechercher un nom, un prénom" bind:value={controller.inputName} />
    </div>
    <div class="fr-col-6">
        <Select on:change={e => controller.filterByRole(e.detail)} label="Rôle" options={controller.roles} />
    </div>
</div>
<Table title="Tableau des contacts de l'établissement">
    <svelte:fragment slot="colgroup">
        <col class="small" />
        <col span="3" class="medium" />
        <col class="large" />
        <col span="1" class="medium" />
    </svelte:fragment>
    <svelte:fragment slot="head">
        {#each controller.getHeaders() as header}
            <th scope="col">{header}</th>
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="body">
        {#each $_contacts as contact}
            <tr>
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
            </tr>
        {/each}
    </svelte:fragment>
</Table>

<style>
    .small {
        width: calc(100% / 12);
    }

    .medium {
        width: calc(100% / 6);
    }

    .large {
        width: calc(100% / 3);
    }
</style>
