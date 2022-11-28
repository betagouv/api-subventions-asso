<script>
    import Card from "../../dsfr/Card.svelte";
    import { user as userStore } from "../../store/user.store";
    import Toto from "../toto/Toto.svelte";

    const user = $userStore;
    if (!user || !user.roles || !user.roles.includes("admin")) {
        document.location.href = "/";
    }
</script>

<Toto tutu="coucou" />

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
            <div class="fr-col fr-col-lg-12">
                <div role="alert" class="fr-alert fr-alert--info fr-alert--sm">
                    <p>Bienvenue sur l'interface administrateur</p>
                </div>
            </div>
        </div>
        <div class="fr-grid-row fr-grid-row--gutters">
            <Card title="Liste des utilisateurs" url="/admin/users/list" size="6">(ancienne page Admin)</Card>

            <Card title="Création d'un utilisateur" url="/admin/users/create" size="6">
                Vous permet de créer un utilisateur
            </Card>

            <Card title="Noms de domaine" url="/admin/users/domain" size="6">
                Donne une vision sur les noms de domaine et les utilisateurs inscrits via ceux-ci
            </Card>
        </div>
    </div>
</div>
