<script lang="ts">
    import InfoBox from "$lib/components/InfoBox.svelte";
    import { goToUrl } from "$lib/services/router.service";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    let { onrestartNewForm = () => {} } = $props();
</script>

<div>
    <h1 class="fr-h3 text-center">Dépôt terminé avec succès !</h1>

    <p>
        Merci pour votre contribution au partage des données sur les subventions publiques.
        <br />
        Votre fichier a été validé et intégré avec succès dans notre base. 🎉
    </p>

    <p>Vous pouvez dès à présent déposer un autre fichier pour un SIRET différent si besoin.</p>

    <InfoBox title="Pensez à importer vos données sur data.gouv.fr">
        <p>
            Data.Subvention vous accompagne pour produire et déposer votre fichier SCDL sur notre outil. Pour respecter
            pleinement vos obligations en matière d’open data, nous vous encourageons à publier également ce jeu de
            données sur data.gouv.fr.
        </p>

        <TargetBlankLink href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000034600552">
            Voir le texte de loi
        </TargetBlankLink>
    </InfoBox>

    <div style="text-align: center;">
        <button onclick={() => goToUrl("/")} class="fr-btn fr-btn fr-mr-3v" type="button">Voir sur le portail</button>

        <button onclick={onrestartNewForm} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Déposer un nouveau fichier
        </button>
    </div>
</div>
