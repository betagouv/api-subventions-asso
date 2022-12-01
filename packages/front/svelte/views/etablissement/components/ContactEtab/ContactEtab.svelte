<script>
    import Button from "../../../../dsfr/Button.svelte";
    import Input from "../../../../dsfr/Input.svelte";
    import Select from "../../../../dsfr/Select.svelte";
    import Table from "../../../../dsfr/Table.svelte";
    import { valueOrHyphen } from "../../../../helpers/dataHelper";
    import ContactEtabController from "./ContactEtabController";

    export let contacts = [];

    const controller = new ContactEtabController(contacts);
    const { contacts: _contacts } = controller;
</script>

<div class="fr-grid-row">
    <div class="fr-col-8">
        <h2>Contacts et représentants légaux</h2>
    </div>
    <div class="fr-col-4 align-right">
        <span>
            <Button on:click={controller.download} type="secondary">Télécharger au format CSV</Button>
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
                    {valueOrHyphen(contact.civilite)}
                </td>
                <td>
                    {valueOrHyphen(contact.nom)}
                </td>
                <td>
                    {valueOrHyphen(contact.prenom)}
                </td>
                <td>
                    {valueOrHyphen(contact.telephone)}
                </td>
                <td>
                    {valueOrHyphen(contact.email)}
                </td>
                <td>
                    {valueOrHyphen(contact.role)}
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
