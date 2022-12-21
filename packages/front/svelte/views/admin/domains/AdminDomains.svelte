<script>
    import ActionGroup from "../../../components/ActionGroup.svelte";
    import Spinner from "../../../components/Spinner.svelte";
    import Alert from "../../../dsfr/Alert.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Input from "../../../dsfr/Input.svelte";
    import adminService from "../admin.service";
    let domain = "";
    let domainError;

    const addDomain = async () => {
        try {
            await adminService.addDomain(domain);
            domainError = false;
        } catch (e) {
            domainError = true;
        }
    };

    const promise = adminService.getUserDomaines();
</script>

{#if domainError === false}
    <Alert title="Domaine ajouté!" type="success" />
{:else if domainError === true}
    <Alert title="L'ajout du nom de domaine a échoué" />
{/if}
<div class="action-group-layout">
    <ActionGroup>
        <svelte:fragment slot="content">
            <Input bind:value={domain} label="Ajouter un nom de domaine" />
        </svelte:fragment>
        <svelte:fragment slot="action">
            <Button on:click={addDomain}>Ajouter</Button>
        </svelte:fragment>
    </ActionGroup>
</div>
{#await promise}
    <Spinner description="Chargement en cours ..." />
{:then domains}
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-12">
            <h2>Liste des noms de domaines :</h2>
            <ul class="admin-domain-ul">
                {#each domains as domain}
                    <li>
                        <a href="#{domain.name}">{domain.name.replace("@", "")} {domain.users.length} utilisateurs</a>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="fr-col-12 fr-col-md-12">
            <h2>Détail pour chaque nom de domaine :</h2>
        </div>
        {#each domains as domain}
            <div class="fr-col-12 fr-col-md-6" id={domain.name}>
                <h3>{domain.name}</h3>
                <p>Nombre d'utilisateurs : {domain.users.length}</p>
                <p>Nombre d'utilisateurs ayant activé leur compte : {domain.totalActive}</p>
                <div class="fr-table">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Email</th>
                                <th scope="col">Roles</th>
                                <th scope="col">Actif</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each domain.users as user}
                                <tr>
                                    <td>{user.email}</td>
                                    <td>{user.roles.join(" - ")}</td>
                                    <td>{user.active ? "Oui" : "Non"}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/each}
    </div>
{/await}

<style>
    .action-group-layout {
        margin-bottom: 1em;
    }
</style>
