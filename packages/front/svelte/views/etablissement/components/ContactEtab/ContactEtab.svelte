<script>
    import Button from "../../../../dsfr/Button.svelte";
    import Input from "../../../../dsfr/Input.svelte";
    import Select from "../../../../dsfr/Select.svelte";
    import Table from "../../../../dsfr/Table.svelte";
    import ContactEtabController from "./ContactEtabController";

    export let contacts = [];
    export let siret;

    const controller = new ContactEtabController(contacts, siret);
    const { contacts: _contacts } = controller;
</script>

<div class="fr-grid-row">
    <div class="fr-col-8">
        <h2>Contacts et représentants légaux</h2>
    </div>
    <div class="fr-col-4 align-right">
        <span>
            <Button on:click={() => controller.download()} type="secondary">Télécharger au format CSV</Button>
        </span>
    </div>
</div>
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

    .align-right {
        display: flex;
        justify-content: flex-end;
    }

    .align-right > span {
        align-self: flex-start;
    }
</style>
