<script>
    import Card from "$lib/dsfr/Card.svelte";
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <div class="fr-grid-row fr-grid-row--left">
            <h2>Bienvenue sur l'interface administrateur</h2>
        </div>
        <div class="fr-grid-row fr-grid-row--gutters">
            <Card title="Gestion des comptes utilisateurs" url="/admin/users/list" size="6">
                Vous permet de consulter les noms de domaines et gérer les utilisateurs
            </Card>
            <Card title="Créer un compte utilisateur" url="/admin/users/create" size="6">
                Vous permet d’ajouter un nouvel utilisateur
            </Card>
        </div>
    </div>
</div>
