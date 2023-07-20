<script>
    import Button from "$lib/dsfr/Button.svelte";
    import { data, action } from "../../../../store/modal.store";
</script>

<div class="fr-modal__content">
    <h1 id="fr-modal-title" class="fr-modal__title">
        <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true" />
        Suppression d'un utilisateur
    </h1>
    <p>
        Êtes-vous sûr de vouloir supprimer l'utilisateur {$data} ?
        <br />
        Cette action sera définitive, il sera impossible de revenir en arrière.
    </p>
</div>
<div class="fr-modal__footer">
    <ul
        class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
        <li>
            <Button type="primary" ariaControls="fr-modal">Non</Button>
        </li>
        <li>
            <Button type="secondary" on:click={$action} ariaControls="fr-modal">Oui</Button>
        </li>
    </ul>
</div>
