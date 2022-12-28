<script>
    import Card from "../../dsfr/Card.svelte";
    import { user as userStore } from "../../store/user.store";

    const user = $userStore;

    if (!user || !user.roles || !user.roles.includes("admin")) {
        document.location.href = "/";
    }
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <div class="fr-grid-row fr-grid-row--left">
            <h2>Bienvenue sur l'interface administrateur</h2>
        </div>
        <div class="fr-grid-row fr-grid-row--gutters">
            <Card title="Statistiques d'usage" url="/admin/stats" size="6">
                Donne une vision sur les usages des utilisateurs inscrits
            </Card>

            <Card title="Gestion des comptes utilisateurs" url="/admin/users/list" size="6">
                Vous permet de consulter la liste des utilisateurs
            </Card>

            <Card title="Créer un compte utilisateur" url="/admin/users/create" size="6">
                Vous permet de créer un utilisateur
            </Card>

            <Card title="Noms de domaine" url="/admin/users/domain" size="6">
                Donne une vision sur les noms de domaine et les utilisateurs inscrits via ceux-ci
            </Card>
        </div>
    </div>
</div>
