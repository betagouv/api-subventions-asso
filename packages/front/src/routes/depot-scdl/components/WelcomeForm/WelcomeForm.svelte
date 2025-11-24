<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ start: void }>();
</script>

<div class="fr-col-12 fr-col-lg-9">
    <h1 class="text-center fr-mb-10v">Bienvenue sur le parcours de dépôt de données de Data.Subvention</h1>
    <div class="fr-text--bold fr-text--lead fr-mb-7v">Déposez vos données de subventions en toute simplicité</div>
    <div class="fr-text">
        <p class="fr-mb-7v">
            Contribuez à l'amélioration de la transparence et de la qualité des données publiques en partageant vos
            données de subventions au format SCDL. Notre parcours de dépôt vous accompagne pas à pas pour :
        </p>
        <ul class="fr-mb-7v">
            <li>Vérifier la conformité de vos fichiers avec le format SCDL</li>
            <li>Importer facilement vos données</li>
            <li>Suivre l'état de vos dépôts</li>
        </ul>
        <p class="fr-mb-7v">
            👉 Avant de commencer, nous vous recommandons de consulter
            <a
                href="https://www.notion.so/R-gles-de-format-SCDL-1281788663a380e1a57efdd9b324c1ba"
                target="_blank"
                rel="noopener noreferrer">
                notre guide de préparation des fichiers
            </a>
            .
        </p>
        <p class="fr-mb-7v">
            Merci pour votre contribution, qui permet d'améliorer la connaissance sur le financement public des
            associations et de faciliter la mutualisation des données entre administrations.
        </p>
    </div>
    <div class="text-center">
        <button on:click={() => dispatch("start")} class="fr-btn" type="button">Débuter</button>
    </div>
</div>
