<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ nextStep: void; prevStep: void }>();
</script>

<div>
    <div class="fr-text fr-mb-4v">
        <p class="fr-text--bold fr-text--lead fr-mb-0">À savoir</p>
        <ul>
            <li>Vos imports n’impactent que les exercices que vous transmettez.</li>
            <li>Les données des exercices non inclus dans votre fichier sont conservées.</li>
            <li>
                Pour un même exercice, les données existantes sont remplacées uniquement si l’import contient davantage
                de lignes que celles déjà présentes en production.
            </li>
        </ul>
    </div>

    <div>
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Retour
        </button>

        <button on:click={() => dispatch("nextStep")} class="fr-btn fr-mr-3v" type="button">
            Je comprends et je poursuis l'import
        </button>
    </div>
</div>
